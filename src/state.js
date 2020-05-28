import { writable } from "svelte/store";
import firebase from "firebase/app";
import "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyCPO5k-AFYp3VDhTd3zsKW1eZ9YJui2ymY",
  projectId: "jgs-shopping-list",
});

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
    addItem: (description, department) => {
      const randValues = new Int8Array(6);
      const [quantity, desc] = parseQuantity(description);

      list.update({
        items: firebase.firestore.FieldValue.arrayUnion({
          id: [...window.crypto.getRandomValues(randValues)]
            .map((v) => v.toString())
            .join(""),
          description: desc,
          department,
          quantity,
          isDone: false,
        }),
      });
    },
    updateItem: (item, update) => {
      if (update.description) {
        const [quantity, description] = parseQuantity(update.description);
        update.description = description;
        update.quantity = quantity;
      }

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

const parseQuantity = (description) => {
  const [quantity, ...desc] = description.split(" ");
  const parsed = Number.parseFloat(quantity);
  if (parsed) {
    return [parsed, desc.join(" ")];
  }
  return [1, description];
};
