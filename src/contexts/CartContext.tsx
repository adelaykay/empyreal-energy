'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from './AuthContext';
import { CartItem, CartItemWithProduct } from '@/types/cart';
import { Product } from '@/types/product';
import { getDocument } from '@/lib/firebase/firestore';

interface CartContextType {
  items: CartItemWithProduct[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  addItem: async () => {},
  removeItem: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  syncCart: async () => {},
});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(false);

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Load cart from localStorage or Firestore
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      
      if (user) {
        // Load from Firestore for authenticated users
        await syncCart();
      } else {
        // Load from localStorage for guests
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          const cartItems: CartItem[] = JSON.parse(localCart);
          await enrichCartItems(cartItems);
        }
      }
      
      setLoading(false);
    };

    loadCart();
  }, [user]);

  // Enrich cart items with product data
  const enrichCartItems = async (cartItems: CartItem[]) => {
    const enrichedItems: CartItemWithProduct[] = [];

    for (const item of cartItems) {
      const product = await getDocument<Product>('products', item.productId);
      if (product) {
        enrichedItems.push({
          ...item,
          name: product.name,
          price: product.price,
          image: product.images[0] || '',
          inStock: product.inStock,
          stockQuantity: product.stockQuantity,
        });
      }
    }

    setItems(enrichedItems);
  };

  // Sync cart with Firestore
  const syncCart = async () => {
    if (!user) return;

    try {
      const cartRef = doc(db, 'cart', user.uid);
      const cartDoc = await getDoc(cartRef);

      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        await enrichCartItems(cartData.items);
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  };

  // Save cart to storage
  const saveCart = async (updatedItems: CartItemWithProduct[]) => {
    const cartItems: CartItem[] = updatedItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    if (user) {
      // Save to Firestore
      try {
        const cartRef = doc(db, 'cart', user.uid);
        await setDoc(cartRef, {
          userId: user.uid,
          items: cartItems,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        console.error('Error saving cart to Firestore:', error);
      }
    } else {
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    setItems(updatedItems);
  };

  // Add item to cart
  const addItem = async (productId: string, quantity: number = 1) => {
    const product = await getDocument<Product>('products', productId);
    if (!product) return;

    const existingItem = items.find(item => item.productId === productId);

    let updatedItems: CartItemWithProduct[];

    if (existingItem) {
      // Update quantity
      updatedItems = items.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Add new item
      const newItem: CartItemWithProduct = {
        productId,
        quantity,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        inStock: product.inStock,
        stockQuantity: product.stockQuantity,
      };
      updatedItems = [...items, newItem];
    }

    await saveCart(updatedItems);
  };

  // Remove item from cart
  const removeItem = async (productId: string) => {
    const updatedItems = items.filter(item => item.productId !== productId);
    await saveCart(updatedItems);
  };

  // Update item quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    const updatedItems = items.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    await saveCart(updatedItems);
  };

  // Clear cart
  const clearCart = async () => {
    if (user) {
      try {
        const cartRef = doc(db, 'cart', user.uid);
        await setDoc(cartRef, {
          userId: user.uid,
          items: [],
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    } else {
      localStorage.removeItem('cart');
    }

    setItems([]);
  };

  const value = {
    items,
    totalItems,
    totalPrice,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    syncCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
