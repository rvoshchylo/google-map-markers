import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseInit';
import { MarkerInterface } from '../types/Marker';

export const updateMarkers = async (updatedMarkers: MarkerInterface[]) => {
  const updatedDoc = {
    markers: updatedMarkers,
  };
  
  const docRef = doc(db, 'markers', 'points');
  
  await updateDoc(docRef, updatedDoc);
}
