// ===== SISTEMA DE AUTENTICACIÓN CON FIREBASE =====

import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { 
    doc, 
    setDoc, 
    getDoc 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Función para cambiar entre login y registro
window.showLogin = function() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.querySelectorAll('.tab-btn')[1].classList.remove('active');
}

window.showRegister = function() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.querySelectorAll('.tab-btn')[0].classList.remove('active');
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
}

// Mostrar mensaje de error
function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    errorEl.textContent = message;
    errorEl.classList.add('show');
    setTimeout(() => {
        errorEl.classList.remove('show');
    }, 5000);
}

// Cerrar sesión
window.logout = async function() {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}

// ===== MANEJO DEL FORMULARIO DE REGISTRO =====
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim().toLowerCase();
            const password = document.getElementById('regPassword').value;
            const role = document.getElementById('regRole').value;
            
            // Validaciones
            if (password.length < 6) {
                showError('registerError', 'La contraseña debe tener al menos 6 caracteres');
                return;
            }
            
            if (!role) {
                showError('registerError', 'Por favor selecciona tu rol');
                return;
            }
            
            try {
                // Crear usuario en Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                // Crear documento de usuario en Firestore
                await setDoc(doc(db, 'users', user.uid), {
                    name: name,
                    email: email,
                    role: role,
                    createdAt: new Date().toISOString(),
                    progress: {
                        module1: 0,
                        module2: 0,
                        module3: 0,
                        module4: 0,
                        module5: 0,
                        module6: 0
                    },
                    completedActivities: [],
                    totalTimeMinutes: 0
                });
                
                // Mostrar mensaje de éxito
                const successDiv = document.createElement('div');
                successDiv.className = 'success-message';
                successDiv.textContent = '¡Cuenta creada con éxito! Redirigiendo...';
                registerForm.prepend(successDiv);
                
                // Redirigir al dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
                
            } catch (error) {
                console.error('Error en registro:', error);
                let errorMessage = 'Error al crear la cuenta';
                
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'Este correo electrónico ya está registrado';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Correo electrónico inválido';
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = 'La contraseña es muy débil';
                }
                
                showError('registerError', errorMessage);
            }
        });
    }
    
    // ===== MANEJO DEL FORMULARIO DE LOGIN =====
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const password = document.getElementById('loginPassword').value;
            
            try {
                // Iniciar sesión con Firebase
                await signInWithEmailAndPassword(auth, email, password);
                
                // Mostrar mensaje de éxito
                const successDiv = document.createElement('div');
                successDiv.className = 'success-message';
                successDiv.textContent = '¡Bienvenido! Redirigiendo...';
                loginForm.prepend(successDiv);
                
                // Redirigir al dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
                
            } catch (error) {
                console.error('Error en login:', error);
                let errorMessage = 'Error al iniciar sesión';
                
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    errorMessage = 'Correo o contraseña incorrectos';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Correo electrónico inválido';
                } else if (error.code === 'auth/too-many-requests') {
                    errorMessage = 'Demasiados intentos. Intenta más tarde';
                }
                
                showError('loginError', errorMessage);
            }
        });
    }
});

// ===== VERIFICACIÓN DE SESIÓN =====
// Esta función se ejecuta en el dashboard para verificar que el usuario está logueado
window.checkAuth = function() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = 'index.html';
                resolve(null);
            } else {
                // Obtener datos adicionales del usuario desde Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    resolve({
                        uid: user.uid,
                        email: user.email,
                        ...userData
                    });
                } else {
                    resolve({
                        uid: user.uid,
                        email: user.email,
                        name: user.email.split('@')[0],
                        role: 'estudiante'
                    });
                }
            }
        });
    });
}

// Exportar para uso en otros archivos
export { auth, db };
