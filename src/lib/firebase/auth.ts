import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { UserFormData } from '@/types/user';

/**
 * Register a new user
 */
export const registerUser = async (formData: UserFormData) => {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
    
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, {
      displayName: `${formData.firstName} ${formData.lastName}`,
    });

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      addresses: [],
      role: 'customer',
      createdAt: serverTimestamp(),
    });

    return { success: true, user };
  } catch (error: any) {
    console.error('Error registering user:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Login user
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error('Error logging in:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Login with Google
 */
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user profile exists
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create user profile for new Google users
      const names = user.displayName?.split(' ') || ['', ''];
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        phone: user.phoneNumber || '',
        addresses: [],
        role: 'customer',
        createdAt: serverTimestamp(),
      });
    }

    return { success: true, user };
  } catch (error: any) {
    console.error('Error with Google sign-in:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('Error logging out:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    }
    return { success: false, error: 'User not found' };
  } catch (error: any) {
    console.error('Error getting user profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if user is admin
 */
export const isUserAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role === 'admin';
    }
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};