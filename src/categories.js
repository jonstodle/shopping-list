import { get, writable } from "svelte/store";

const storageKey = "categories";
const loaded = localStorage.getItem(storageKey);

const categoriesStore = writable(
  (loaded && JSON.parse(loaded)) || [
    "Baked goods",
    "Dairy",
    "Frozens",
    "Meats & Seafood",
    "Produce",
    "Snacks",
  ]
);

function persist() {
  localStorage.setItem(storageKey, JSON.stringify(get(categoriesStore)));
}

function add(category) {
  categoriesStore.update((state) =>
    [...state, category].sort((a, b) => a.localeCompare(b))
  );
  persist();
}

function remove(category) {
  categoriesStore.update((state) => state.filter((cat) => cat != category));
  persist();
}

export default {
  subscribe: categoriesStore.subscribe,
  add,
  remove,
};
