export const Cache = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify({data: value}));
  },
  get(key) {
    let storage = localStorage.getItem(key);
    if (storage) {
      try {
        storage = JSON.parse(storage);
        return storage.data;
      } catch (e) {
        return null;
      }
    }
    return null;
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  }
};
