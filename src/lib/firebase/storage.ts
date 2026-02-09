import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import app from './config';

const storage = getStorage(app);

/**
 * Upload a file to Firebase Storage
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'products/product-id/image1.jpg')
 * @returns The download URL of the uploaded file
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Upload product image with automatic resizing path
 * @param file - The image file
 * @param productId - The product ID
 * @param index - Image index (for multiple images)
 * @returns The download URL
 */
export const uploadProductImage = async (
  file: File,
  productId: string,
  index: number = 0
): Promise<string> => {
  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  const path = `products/${productId}/image-${index}-${timestamp}.${extension}`;
  return uploadFile(file, path);
};

/**
 * Upload product thumbnail
 * @param file - The thumbnail file
 * @param productId - The product ID
 * @returns The download URL
 */
export const uploadProductThumbnail = async (
  file: File,
  productId: string
): Promise<string> => {
  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  const path = `products/${productId}/thumbnail-${timestamp}.${extension}`;
  return uploadFile(file, path);
};

/**
 * Delete a file from Firebase Storage
 * @param url - The download URL of the file to delete
 */
export const deleteFile = async (url: string): Promise<void> => {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Generate a unique ID for new products (before Firestore creates one)
 */
export const generateStorageId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};