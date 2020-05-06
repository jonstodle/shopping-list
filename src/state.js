import { writable } from "svelte/store";

const showDepartmentEditStore = writable(false);
export const showDepartmentEdit = {
  subscribe: showDepartmentEditStore.subscribe,
  show: () => showDepartmentEditStore.set(true),
  hide: () => showDepartmentEditStore.set(false),
};

const db = firebase.firestore();
const listsCollection = db.collection("lists");

export const getLists = () => ({
  subscribe: (sub) => {
    const cached = localStorage.getItem("lists");
    sub((cached && JSON.parse(cached)) || []);

    return listsCollection.orderBy("name").onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      localStorage.setItem("lists", JSON.stringify(data));
      sub(data);
    });
  },
  add: (name) => {
    listsCollection.add({
      name,
      items: [],
      departments: [],
    });
  },
});

export const getList = (listId) => {
  const list = listsCollection.doc(listId);
  return {
    subscribe: (sub) => {
      const cached = localStorage.getItem(listId);
      sub(
        (cached && JSON.parse(cached)) || {
          name: "",
          items: [],
          departments: [],
        }
      );

      return list.onSnapshot((snapshot) => {
        const data = {
          ...snapshot.data(),
          id: snapshot.id,
        };
        localStorage.setItem(listId, JSON.stringify(data));
        sub(data);
      });
    },
    addItem: (newItem) => {
      const randValues = new Int8Array(6);
      const id = [...window.crypto.getRandomValues(randValues)]
        .map((v) => v.toString(16))
        .join("");

      list.update({
        items: firebase.firestore.FieldValue.arrayUnion({
          id,
          description: "New item",
          department: "",
          quantity: 1,
          isDone: false,
          ...newItem,
        }),
      });
    },
    updateItem: (item, update) => {
      const batch = db.batch();
      batch.update(list, {
        items: firebase.firestore.FieldValue.arrayRemove(item),
      });
      batch.update(list, {
        items: firebase.firestore.FieldValue.arrayUnion({
          ...item,
          ...update,
        }),
      });
      batch.commit();
    },
    removeDone: () => {
      db.runTransaction((transaction) => {
        return transaction.get(list).then((snapshot) => {
          const items = snapshot.data().items.filter((i) => !i.isDone);
          transaction.update(list, { items });
        });
      });
    },
    addDepartment: (newDepartment) => {
      list.update({
        departments: firebase.firestore.FieldValue.arrayUnion(newDepartment),
      });
    },
    removeDepartment: (department) => {
      list.update({
        departments: firebase.firestore.FieldValue.arrayRemove(department),
      });
    },
  };
};
