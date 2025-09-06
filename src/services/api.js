// src/services/api.js
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

// 🔹 Listen to datasets in real-time
export const listenDatasets = (callback) => {
  const datasetsRef = collection(db, "datasets");
  return onSnapshot(datasetsRef, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });
};

// 🔹 Fetch datasets once (non-realtime)
export const getDatasets = async () => {
  const datasetsRef = collection(db, "datasets");
  const snapshot = await getDocs(datasetsRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// 🔹 Add new dataset
export const addDataset = async (dataset) => {
  const datasetsRef = collection(db, "datasets");
  await addDoc(datasetsRef, {
    ...dataset,
    createdAt: new Date(),
  });
};

// 🔹 Update dataset (status, description, etc.)
export const updateDataset = async (id, updates) => {
  const datasetRef = doc(db, "datasets", id);
  await updateDoc(datasetRef, updates);
};
