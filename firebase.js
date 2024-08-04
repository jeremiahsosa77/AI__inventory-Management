// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBX5Jt207tMZmmpDwqQPYhHx8ZR3R82adc",
  authDomain: "inventory-management-603f2.firebaseapp.com",
  projectId: "inventory-management-603f2",
  storageBucket: "inventory-management-603f2.appspot.com",
  messagingSenderId: "206413973095",
  appId: "1:206413973095:web:3db01989a12ea3b2d4f6c2",
  measurementId: "G-QRTK83CQCH"
};


const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };