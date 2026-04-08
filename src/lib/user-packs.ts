/**
 * User Packs Management
 * Handles saving and managing user's favorite packs
 */

import { doc, setDoc, getDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export interface SavedPack {
  packId: string;
  addedAt: Date;
  usageCount: number;
}

/**
 * Get pack save limits by subscription plan
 */
export function getPackSaveLimit(plan: string): number {
  const limits: Record<string, number> = {
    free: 3,
    starter: 5,
    pro: 10,
    unlimited: -1, // unlimited
  };
  
  return limits[plan] || 3;
}

/**
 * Check if user can save more packs
 */
export function canSaveMorePacks(userPlan: string, currentCount: number): boolean {
  const limit = getPackSaveLimit(userPlan);
  if (limit === -1) return true; // unlimited
  return currentCount < limit;
}

/**
 * Save pack to user's favorites
 */
export async function savePackToUser(userId: string, packId: string): Promise<void> {
  const packRef = doc(db, 'users', userId, 'savedPacks', packId);
  
  await setDoc(packRef, {
    packId,
    addedAt: new Date(),
    usageCount: 0,
  });
}

/**
 * Remove pack from user's favorites
 */
export async function removePackFromUser(userId: string, packId: string): Promise<void> {
  const packRef = doc(db, 'users', userId, 'savedPacks', packId);
  await deleteDoc(packRef);
}

/**
 * Get user's saved packs
 */
export async function getUserSavedPacks(userId: string): Promise<string[]> {
  const packsRef = collection(db, 'users', userId, 'savedPacks');
  const snapshot = await getDocs(packsRef);
  
  return snapshot.docs.map(doc => doc.data().packId);
}

/**
 * Check if pack is saved by user
 */
export async function isPackSaved(userId: string, packId: string): Promise<boolean> {
  const packRef = doc(db, 'users', userId, 'savedPacks', packId);
  const packDoc = await getDoc(packRef);
  
  return packDoc.exists();
}

/**
 * Increment pack usage count
 */
export async function incrementPackUsage(userId: string, packId: string): Promise<void> {
  const packRef = doc(db, 'users', userId, 'savedPacks', packId);
  const packDoc = await getDoc(packRef);
  
  if (packDoc.exists()) {
    const data = packDoc.data() as SavedPack;
    await setDoc(packRef, {
      ...data,
      usageCount: data.usageCount + 1,
    });
  }
}

/**
 * Get saved pack with details
 */
export async function getSavedPackDetails(userId: string, packId: string): Promise<SavedPack | null> {
  const packRef = doc(db, 'users', userId, 'savedPacks', packId);
  const packDoc = await getDoc(packRef);
  
  if (!packDoc.exists()) return null;
  
  const data = packDoc.data();
  return {
    packId: data.packId,
    addedAt: data.addedAt.toDate(),
    usageCount: data.usageCount,
  };
}
