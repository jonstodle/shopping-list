import { writable } from "svelte/store";

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

export default {
  subscribe: categoriesStore.subscribe,
};
