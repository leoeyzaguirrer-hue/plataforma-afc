// Configuración de Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyAYusWx-ML0LUZKZs3G5QN6eHmNdNkt4os",
  authDomain: "plataforma-afc.firebaseapp.com",
  projectId: "plataforma-afc",
  storageBucket: "plataforma-afc.firebasestorage.app",
  messagingSenderId: "901680831587",
  appId: "1:901680831587:web:a1c09efd484b279e1b6c56"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
