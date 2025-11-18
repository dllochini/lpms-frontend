import { openDB } from "idb";

const DB_NAME = "landRegistrationDB";
const STORE_NAME = "files";
const DB_VERSION = 1;

export const getDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

export const saveFile = async (key, file) => {
  const db = await getDB();
  const arrayBuffer = await file.arrayBuffer();
  const metadata = {
    name: file.name,
    type: file.type,
    lastModified: file.lastModified,
    data: arrayBuffer,
  };
  await db.put(STORE_NAME, metadata, key);
};

export const getAllFiles = async () => {
  const db = await getDB();
  const keys = await db.getAllKeys(STORE_NAME);
  const files = {};
  for (const key of keys) {
    const metadata = await db.get(STORE_NAME, key);
    if (metadata) {
      const f = new File([metadata.data], metadata.name, {
        type: metadata.type,
        lastModified: metadata.lastModified,
      });
      files[key] = f;
    }
  }
  return files;
};

export const deleteFile = async (key) => {
  const db = await getDB();
  await db.delete(STORE_NAME, key);
};
