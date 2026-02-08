import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';

/**
 * Generic function to get a document by ID
 */
export const getDocument = async <T>(collectionName: string, docId: string): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    return null;
  }
};

/**
 * Generic function to get all documents from a collection
 */
export const getCollection = async <T>(
  collectionName: string,
  constraints: any[] = []
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    return [];
  }
};

/**
 * Add a document to a collection
 */
export const addDocument = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error(`Error adding document to ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Update a document
 */
export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: any
) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error: any) {
    console.error(`Error updating document in ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a document
 */
export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return { success: true };
  } catch (error: any) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Generate order number
 */
export const generateOrderNumber = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `EMP-${year}-${random}`;
};
