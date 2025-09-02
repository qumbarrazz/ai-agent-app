// Utility to check if a user is admin based on Firestore 'users' collection
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function isAdmin(uid) {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() && userSnap.data().role === 'admin';
}
