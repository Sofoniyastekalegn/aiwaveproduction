import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function logBooking(details: any) {
  try {
    await addDoc(collection(db, 'bookings'), {
      ...details,
      createdAt: serverTimestamp(),
      platform: 'Cal.com Integration'
    });
  } catch (e) {
    console.error("Booking log failed:", e);
  }
}
