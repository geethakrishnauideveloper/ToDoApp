import { openDB } from "idb";

const DB_NAME = "TaskDB";
const DB_VERSION = 2; // increment this if you add new stores/indexes

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // Tasks store
      if (!db.objectStoreNames.contains("tasks")) {
        db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
      }

      // Users store
      if (!db.objectStoreNames.contains("users")) {
        const userStore = db.createObjectStore("users", { keyPath: "id", autoIncrement: true });
        userStore.createIndex("username", "username", { unique: true });
        userStore.createIndex("mobile", "mobile", { unique: true });
      } else {
        // Ensure indexes exist for old users store
        const userStore = transaction.objectStore("users");
        if (!userStore.indexNames.contains("username")) {
          userStore.createIndex("username", "username", { unique: true });
        }
        if (!userStore.indexNames.contains("mobile")) {
          userStore.createIndex("mobile", "mobile", { unique: true });
        }
      }
    },
  });
};

/* ----------------- TASK OPERATIONS ----------------- */
export const addTask = async (task) => {
  const db = await initDB();
  return db.add("tasks", task);
};

export const getTasks = async () => {
  const db = await initDB();
  return db.getAll("tasks");
};

export const deleteTask = async (id) => {
  const db = await initDB();
  return db.delete("tasks", id);
};

export const updateTask = async (id, updatedTask) => {
  const db = await initDB();
  return db.put("tasks", { ...updatedTask, id });
};

/* ----------------- USER OPERATIONS ----------------- */
export const addUser = async (user) => {
  const db = await initDB();
  return db.add("users", user);
};

export const getUserByUsername = async (username) => {
  const db = await initDB();
  const tx = db.transaction("users", "readonly");
  const store = tx.objectStore("users");

  if (!store.indexNames.contains("username")) {
    throw new Error("Username index not found in users store");
  }

  return store.index("username").get(username);
};

export const getUserByMobile = async (mobile) => {
  const db = await initDB();
  const tx = db.transaction("users", "readonly");
  const store = tx.objectStore("users");

  if (!store.indexNames.contains("mobile")) {
    throw new Error("Mobile index not found in users store");
  }

  return store.index("mobile").get(mobile);
};

/* ----------------- DEV HELPERS (Optional) ----------------- */
// Clear all tasks
export const clearTasks = async () => {
  const db = await initDB();
  return db.clear("tasks");
};

// Clear all users
export const clearUsers = async () => {
  const db = await initDB();
  return db.clear("users");
};
