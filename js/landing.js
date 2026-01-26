// ===== LANDING PAGE JAVASCRIPT =====

// Crear partículas doradas
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posición aleatoria
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Contador animado
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const duration = 2000; // 2 segundos
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Iniciar animación cuando sea visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Datos de los módulos
const modulesData = {
    1: {
        icon: '📝',
        title: 'Operacionalización de la Conducta',
        description: 'Aprende a definir conductas de forma medible y observable, identificando dimensiones como frecuencia, duración, latencia e intensidad.',
        levels: [
            'Nivel 1: Principios de Operacionalización - Características de una buena definición conductual',
            'Nivel 2: Práctica de Operacionalización - Operacionalizar conductas complejas',
            'Nivel 3: Clases de Respuesta - Equivalencia funcional y clases de operantes'
        ],
        duration: '45-60 min por nivel',
        activities: '15 actividades'
    },
    2: {
        icon: '🎯',
        title: 'Módulo 2',
        description: 'Este módulo está en desarrollo. Próximamente disponible.',
        levels: ['En desarrollo...'],
        duration: '--',
        activities: '--'
    },
    3: {
        icon: '🔍',
        title: 'Identificación de Estímulos',
        description: 'Reconoce y clasifica eventos ambientales, diferenciando estímulos públicos vs privados y formales vs funcionales.',
        levels: [
            'Nivel 1: Tipos de Estímulos - Clasificación y dimensiones',
            'Nivel 2: Clases de Estímulos - Clases funcionales y generalización',
            'Nivel 3: Contexto y Situación - Operaciones de establecimiento/abolición'
        ],
        duration: '45-60 min por nivel',
        activities: '12 actividades'
    },
    4: {
        icon: '🧪',
        title: 'Condicionamiento Clásico',
        description: 'Comprende y aplica los principios del condicionamiento clásico, desde los fundamentos hasta aplicaciones clínicas.',
        levels: [
            'Nivel 1: Fundamentos del CC - EI, RI, EN, EC, RC',
            'Nivel 2: Fenómenos del CC - Extinción, generalización, discriminación',
            'Nivel 3: Aplicaciones Clínicas - Fobias y respuestas emocionales'
        ],
        duration: '50-65 min por nivel',
        activities: '18 actividades'
    },
    5: {
        icon: '⚡',
        title: 'Condicionamiento Operante - Reforzamiento',
        description: 'Domina los principios del reforzamiento, tipos de reforzadores y parámetros críticos.',
        levels: [
            'Nivel 1: Fundamentos - Reforzamiento positivo vs negativo',
            'Nivel 2: Tipos de Reforzadores - Primarios, secundarios y generalizados',
            'Nivel 3: Parámetros - Magnitud, demora y valor relativo'
        ],
        duration: '50-65 min por nivel',
        activities: '20 actividades'
    },
    6: {
        icon: '🛑',
        title: 'Castigo y Extinción',
        description: 'Comprende procedimientos de reducción conductual, sus efectos y aplicación diferencial.',
        levels: [
            'Nivel 1: Castigo - Tipos y efectos secundarios',
            'Nivel 2: Extinción Operante - Procedimiento y fenómenos',
            'Nivel 3: Aplicación Diferencial - Reforzamiento diferencial y economía de fichas'
        ],
        duration: '45-55 min por nivel',
        activities: '16 actividades'
    },
    7: {
        icon: '🎛️',
        title: 'Control de Estímulos',
        description: 'Comprende el control discriminativo y contextual sobre la conducta.',
        levels: [
            'Nivel 1: Discriminación Simple - Ed y E∆',
            'Nivel 2: Discriminación Compleja - Discriminaciones condicionales',
            'Nivel 3: Control Aplicado - Control instruccional y reglas'
        ],
        duration: '50-60 min por nivel',
        activities: '17 actividades'
    },
    8: {
        icon: '📊',
        title: 'Programas de Reforzamiento',
        description: 'Domina los efectos de diferentes programas de reforzamiento y sus aplicaciones.',
        levels: [
            'Nivel 1: Programas Simples - RF, RV, IF, IV',
            'Nivel 2: Programas Compuestos - Concurrentes y ley de igualación',
            'Nivel 3: Aplicaciones Clínicas - Mantenimiento y resistencia'
        ],
        duration: '55-70 min por nivel',
        activities: '22 actividades'
    },
    9: {
        icon: '🔗',
        title: 'Contingencia de Tres Términos',
        description: 'Integra antecedentes, respuesta y consecuentes en análisis funcionales completos.',
        levels: [
            'Nivel 1: Estructura A-R-C - Triple contingencia',
            'Nivel 2: Contingencias Múltiples - Cadenas y consecuencias múltiples',
            'Nivel 3: Interacciones Condicionales - OEs/OAs y contextualización'
        ],
        duration: '50-65 min por nivel',
        activities: '19 actividades'
    },
    10: {
        icon: '💡',
        title: 'Formulación de Hipótesis Funcionales',
        description: 'Genera explicaciones funcionales preliminares y evalúa hipótesis alternativas.',
        levels: [
            'Nivel 1: Descripción a Hipótesis - Formular hipótesis tentativas',
            'Nivel 2: Análisis de Variables - Variables históricas vs actuales',
            'Nivel 3: Hipótesis Múltiples - Generar y evaluar alternativas'
        ],
        duration: '55-70 min por nivel',
        activities: '21 actividades'
    },
    11: {
        icon: '📋',
        title: 'Evaluación Funcional',
        description: 'Recopila información para análisis funcional mediante métodos indirectos, directos y experimentales.',
        levels: [
            'Nivel 1: Métodos Indirectos - Entrevista y cuestionarios',
            'Nivel 2: Observación Directa - Registro ABC y sistemas',
            'Nivel 3: Análisis Experimental - Diseños de caso único'
        ],
        duration: '60-75 min por nivel',
        activities: '24 actividades'
    },
    12: {
        icon: '🏗️',
        title: 'Construcción del Análisis Funcional',
        description: 'Integra toda la información en un análisis funcional completo y deriva intervenciones.',
        levels: [
            'Nivel 1: Organización - Jerarquizar y priorizar conductas',
            'Nivel 2: Redacción del AF - Estructura y claridad',
            'Nivel 3: Del AF a Intervención - Objetivos y procedimientos'
        ],
        duration: '60-80 min por nivel',
        activities: '25 actividades'
    },
    13: {
        icon: '🧩',
        title: 'Equivalencia y Conducta Relacional',
        description: 'Comprende aprendizaje complejo, clases de equivalencia e introducción a RFT.',
        levels: [
            'Nivel 1: Clases de Estímulos - Generalización y abstracción',
            'Nivel 2: Equivalencia - Propiedades y transferencia de funciones',
            'Nivel 3: Introducción a RFT - Marcos relacionales básicos'
        ],
        duration: '65-85 min por nivel',
        activities: '28 actividades'
    },
    14: {
        icon: '💬',
        title: 'Conducta Gobernada por Reglas',
        description: 'Analiza el control verbal sobre la conducta y reglas disfuncionales.',
        levels: [
            'Nivel 1: Control Verbal - Tactos, mandos e intraverbales',
            'Nivel 2: Seguimiento de Reglas - Pliance, tracking y augmenting',
            'Nivel 3: Reglas Clínicas - Reglas disfuncionales y fusión cognitiva'
        ],
        duration: '60-75 min por nivel',
        activities: '26 actividades'
    }
};

// Abrir modal de módulo
function openModuleModal(moduleNumber) {
    const module = modulesData[moduleNumber];
    if (!module) return;
    
    const modal = document.getElementById('moduleModal');
    document.getElementById('modalIcon').textContent = module.icon;
    document.getElementById('modalTitle').textContent = module.title;
    document.getElementById('modalDescription').textContent = module.description;
    document.getElementById('modalDuration').textContent = module.duration;
    document.getElementById('modalActivities').textContent = module.activities;
    
    // Llenar niveles
    const levelsContainer = document.getElementById('modalLevels');
    levelsContainer.innerHTML = '';
    module.levels.forEach(level => {
        const levelDiv = document.createElement('div');
        levelDiv.className = 'level-item';
        levelDiv.innerHTML = `<strong>•</strong> ${level}`;
        levelsContainer.appendChild(levelDiv);
    });
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Cerrar modal
function closeModal() {
    const modal = document.getElementById('moduleModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Crear partículas
    createParticles();
    
    // Animar contadores
    animateCounters();
    
    // Añadir event listeners a tarjetas de módulos
    document.querySelectorAll('.module-card-landing').forEach(card => {
        card.addEventListener('click', function() {
            if (!this.classList.contains('locked')) {
                const moduleNumber = parseInt(this.getAttribute('data-module'));
                openModuleModal(moduleNumber);
            }
        });
    });
    
    // Cerrar modal
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    
    // Cerrar modal al hacer click fuera
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('moduleModal');
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Smooth scroll para anclas
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Animación de aparición al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos
    document.querySelectorAll('.path-card, .level-card, .module-card-landing, .audience-card').forEach(el => {
        observer.observe(el);
    });
});

// Efecto parallax sutil en scroll
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.particles');
    
    parallaxElements.forEach(el => {
        el.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
});
