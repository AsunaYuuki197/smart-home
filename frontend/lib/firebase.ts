import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  Messaging
} from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyDhWrwFf83i7_q_8n83bvUytOuXgTX_F-s",
  authDomain: "testfirebase-ver0.firebaseapp.com",
  projectId: 'testfirebase-ver0',
  storageBucket: 'testfirebase-ver0.appspot.com',
  messagingSenderId: '906315652109',
  appId: "1:906315652109:web:4b85315185cfd58baa8944",
  measurementId: 'G-SS9ZHK1R97',
  };

  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  if (typeof window === "undefined") return null;
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export {  getToken, onMessage };