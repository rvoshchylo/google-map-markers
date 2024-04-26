import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAkFHVzsYbcsVMo_Oy-zgLZ2isGihVBiQM",
  authDomain: "map-test-task-84515.firebaseapp.com",
  projectId: "map-test-task-84515",
  storageBucket: "map-test-task-84515.appspot.com",
  messagingSenderId: "851791340160",
  appId: "1:851791340160:web:88adabc097a43e51d73c65",
  measurementId: "G-MQRRZVE4VP"
};

const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);