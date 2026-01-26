// ===== DASHBOARD CON FIREBASE =====

import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Verificar autenticación y cargar datos del usuario
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        // Obtener datos del usuario desde Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Actualizar UI con datos del usuario
            document.getElementById('userName').textContent = userData.name || user.email.split('@')[0];
            document.getElementById('welcomeMessage').textContent = `¡Bienvenido/a, ${userData.name || user.email.split('@')[0]}!`;
            
            // Actualizar estadísticas
            const totalModules = 14;
            const totalProgress = Object.values(userData.progress || {}).reduce((a, b) => a + b, 0);
            const avgProgress = Math.round(totalProgress / totalModules);
            
            document.getElementById('progressPercentage').textContent = `${avgProgress}%`;
            document.getElementById('completedActivities').textContent = (userData.completedActivities || []).length;
            
            const hours = Math.floor((userData.totalTimeMinutes || 0) / 60);
            const minutes = (userData.totalTimeMinutes || 0) % 60;
            document.getElementById('totalTime').textContent = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
            
            // Actualizar progreso de cada módulo
            for (let i = 1; i <= 14; i++) {
                const progress = userData.progress[`module${i}`] || 0;
                const progressBar = document.getElementById(`progress-module${i}`);
                const progressText = document.getElementById(`text-module${i}`);
                
                if (progressBar) {
                    progressBar.style.width = `${progress}%`;
                }
                
                if (progressText) {
                    // Solo actualizar texto si no es un módulo bloqueado o "próximamente"
                    if (i === 1 || i === 3 || i >= 4) {
                        progressText.textContent = `${progress}% completado`;
                    }
                }
            }
            
        } else {
            // Si no existe el documento, crear uno básico
            document.getElementById('userName').textContent = user.email.split('@')[0];
            document.getElementById('welcomeMessage').textContent = `¡Bienvenido/a, ${user.email.split('@')[0]}!`;
        }
        
    } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
    }
});

// Función para ir a un módulo
window.goToModule = function(moduleNumber) {
    if (moduleNumber === 1) {
        window.location.href = `/plataforma-afc/modulo1.html`;
    } else if (moduleNumber === 2) {
        alert('El Módulo 2 está en desarrollo. Próximamente disponible.');
    } else {
        // Los demás módulos están disponibles pero aún no tienen contenido
        alert(`El Módulo ${moduleNumber} estará disponible próximamente con contenido completo.`);
    }
}
