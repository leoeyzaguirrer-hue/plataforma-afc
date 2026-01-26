// ===== DASHBOARD CON FIREBASE =====

import { auth, db } from '/plataforma-afc/js/firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Verificar autenticación y cargar datos del usuario
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = '/plataforma-afc/index.html';
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
            const totalModules = 6;
            const totalProgress = Object.values(userData.progress || {}).reduce((a, b) => a + b, 0);
            const avgProgress = Math.round(totalProgress / totalModules);
            
            document.getElementById('progressPercentage').textContent = `${avgProgress}%`;
            document.getElementById('completedActivities').textContent = (userData.completedActivities || []).length;
            
            const hours = Math.floor((userData.totalTimeMinutes || 0) / 60);
            const minutes = (userData.totalTimeMinutes || 0) % 60;
            document.getElementById('totalTime').textContent = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
            
            // Actualizar progreso de cada módulo
            for (let i = 1; i <= 6; i++) {
                const progress = userData.progress[`module${i}`] || 0;
                const progressBar = document.getElementById(`progress-module${i}`);
                const progressText = document.getElementById(`text-module${i}`);
                
                if (progressBar) {
                    progressBar.style.width = `${progress}%`;
                }
                
                if (progressText && i === 1) {
                    progressText.textContent = `${progress}% completado`;
                } else if (progressText && i === 2 && userData.progress.module1 >= 100) {
                    progressText.textContent = `${progress}% completado`;
                    // Desbloquear módulo 2
                    const module2Card = document.querySelectorAll('.module-card')[1];
                    if (module2Card) {
                        module2Card.classList.remove('locked');
                        module2Card.onclick = () => goToModule(2);
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
        window.location.href = `modulo1.html`;
    } else {
        // Por ahora, los otros módulos están bloqueados
        alert(`El Módulo ${moduleNumber} estará disponible próximamente`);
    }
}
