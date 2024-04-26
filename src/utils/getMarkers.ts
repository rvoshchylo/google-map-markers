import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseInit';
import { MarkerInterface } from '../types/Marker';

export const getMarkers = async (): Promise<MarkerInterface[]> => {
  const docRef = await doc(db, "markers", "points");
  const docSnap = await getDoc(docRef);

  return docSnap.data()?.markers;
}