import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";



const app = initializeApp ({
  apiKey: "AIzaSyCBwJaecXhomn4kYayf-XMwOVfBZZyvtZ8",
  authDomain: "container-management-e3afb.firebaseapp.com",
  projectId: "container-management-e3afb",
  storageBucket: "container-management-e3afb.appspot.com",
  messagingSenderId: "355036042666",
  appId: "1:355036042666:web:d26919044f6afc7be387d3"
});
 
// Firebase storage reference
const storage = getStorage(app);
export default storage;

