import { openDB } from "idb";

export const initDB = async () => {
  return openDB("TaskDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("tasks")) {
        db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
      }
    },
  });
};

// Add a new task
export const addTask = async (task) => {
  const db = await initDB();
  await db.add("tasks", task);
};

// Get all tasks
export const getTasks = async () => {
  const db = await initDB();
  return await db.getAll("tasks");
};

// Delete task by id
export const deleteTask = async (id) => {
  const db = await initDB();
  await db.delete("tasks", id);
};

// ✅ Update existing task
export const updateTask = async (id, updatedTask) => {
  const db = await initDB();
  await db.put("tasks", { ...updatedTask, id }); // replaces existing
};
