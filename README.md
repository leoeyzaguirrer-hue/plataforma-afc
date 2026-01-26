# 🧠 Plataforma de Análisis Funcional de la Conducta (AFC)

Plataforma educativa para el desarrollo de habilidades en Análisis Conductual dirigida a psicólogos en formación de posgrado y grupos de supervisión en España.

## 📋 Características

- ✅ Sistema de autenticación con Firebase
- ✅ 6 módulos estructurados de formación
- ✅ Seguimiento de progreso personalizado
- ✅ Actividades interactivas basadas en casos reales
- ✅ Contenido basado en el Manual de ITEMA
- ✅ Responsive (móvil, tablet, PC)
- ✅ Sincronización entre dispositivos

## 🚀 Instalación y Despliegue en GitHub

### Paso 1: Crear repositorio en GitHub

1. Ve a https://github.com
2. Click en el botón verde "New" (o +  New repository)
3. Nombre del repositorio: `plataforma-afc`
4. Descripción: "Plataforma educativa de Análisis Funcional de la Conducta"
5. Selecciona **Public**
6. NO marques "Initialize with README" (ya lo tenemos)
7. Click en **"Create repository"**

### Paso 2: Subir archivos

Opción A - **Desde la web** (más fácil):
1. En tu repositorio, click en "uploading an existing file"
2. Arrastra TODOS los archivos y carpetas del proyecto
3. Scroll abajo, write "Initial commit"
4. Click "Commit changes"

Opción B - **Desde terminal** (si usas Git):
```bash
git init
git add .
git commit -m "Initial commit con Firebase"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/plataforma-afc.git
git push -u origin main
```

### Paso 3: Activar GitHub Pages

1. En tu repositorio, ve a **Settings**
2. En el menú izquierdo, click en **Pages**
3. En "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **main** → **/root** → **Save**
4. Espera 2-3 minutos
5. Refresca la página
6. Verás: "Your site is live at https://TU-USUARIO.github.io/plataforma-afc/"

## ⚙️ Configuración de Firebase (YA HECHA)

Tu proyecto Firebase ya está configurado con:
- ✅ Authentication (Email/Password habilitado)
- ✅ Firestore Database
- ✅ Reglas de seguridad configuradas

### Verificar Reglas de Firestore

Ve a Firebase Console → Firestore Database → Rules y asegúrate de tener:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📂 Estructura del Proyecto

```
plataforma-afc/
├── index.html              # Página de login/registro
├── dashboard.html          # Panel principal
├── modulo1.html           # Módulo 1 (próximo)
├── css/
│   └── styles.css         # Estilos profesionales
├── js/
│   ├── firebase-config.js # Configuración Firebase
│   ├── auth.js           # Autenticación
│   └── dashboard.js      # Lógica del dashboard
├── data/                 # Datos de módulos (próximo)
├── assets/               # Imágenes e iconos
└── README.md            # Este archivo
```

## 🎓 Módulos Disponibles

1. **Fundamentos del Análisis Funcional** ✅
   - Conceptos básicos
   - Modelo E-R-E
   - Variables disposicionales
   
2. **Identificación de Conductas** 🔒
   - Funcionalidad, topografía, morfología
   
3. **Análisis de Secuencias** 🔒
4. **Habilidades Específicas** 🔒
5. **Casos Prácticos** 🔒
6. **Diseño de Intervención** 🔒

## 🔐 Seguridad

- Autenticación via Firebase Authentication
- Datos protegidos en Firestore
- Reglas de seguridad implementadas
- Solo el usuario puede ver/editar sus propios datos

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge (últimas versiones)
- ✅ Responsive: móvil, tablet, desktop
- ✅ PWA-ready (puede instalarse como app)

## 🛠️ Próximos Pasos

1. Crear contenido del Módulo 1
2. Desarrollar actividades interactivas
3. Implementar sistema de evaluación
4. Agregar certificados de progreso
5. Desarrollar módulos 2-6

## 📖 Créditos

Contenido basado en:
- Manual de Análisis Funcional - ITEMA (Instituto Terapéutico de Madrid)
- Procesos Psicológicos Básicos: Un Análisis Funcional - Teresa Gutiérrez Domínguez

## 📧 Soporte

Para reportar problemas o sugerencias, crear un Issue en GitHub.

---

**Desarrollado con ❤️ para la comunidad de psicología conductual en España** 🇪🇸
