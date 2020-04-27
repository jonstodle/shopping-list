import { get, writable } from "svelte/store";

const storageKey = "items";
const loaded = localStorage.getItem(storageKey);

const itemsStore = writable((loaded && JSON.parse(loaded)) || []);

function persist() {
  localStorage.setItem(storageKey, JSON.stringify(get(itemsStore)));
}

function sort(items) {
  return items
    .sort((a, b) => a.description.localeCompare(b.description))
    .sort((a, b) => a.category.localeCompare(b.category))
    .sort((a, b) => (a.isDone == b.isDone ? 0 : a.isDone ? 1 : -1));
}

function add(item) {
  const randValues = new Int8Array(6);
  item._id = [...window.crypto.getRandomValues(randValues)]
    .map((v) => v.toString(16))
    .join("");

  itemsStore.update((state) => sort([...state, item]));

  persist();
}

function update(item) {
  itemsStore.update((state) =>
    sort(state.map((i) => (i._id == item._id ? item : i)))
  );

  persist();
}

export default {
  subscribe: itemsStore.subscribe,
  add,
  update,
};
