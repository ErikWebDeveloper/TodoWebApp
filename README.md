# ✅ ToDo Web App

¡Bienvenido a **ToDo Web App**! 🎉

Una aplicación sencilla y moderna para gestionar tus listas de tareas, con soporte para almacenamiento local o en la nube mediante **JSONBin.io**. Ideal para organizar tus ideas, tareas o proyectos desde cualquier navegador. 🌐🗂️

---

## ✨ Características

- 📝 Crear, editar y eliminar listas de tareas
- ☁️ Soporte para **JSONBin.io** como almacenamiento en la nube
- 💾 Alternativa local con **LocalStorage**
- 📱 Diseño responsive para móvil y escritorio
- 🔐 Configuración de clave API segura
- 🎨 Interfaz moderna y accesible
- 📎 Compartir listas mediante enlace (modo nube)

---

## 🚀 Primeros pasos

1. **Clona este repositorio**:

   ```bash
   git clone https://github.com/ErikWebDeveloper/TodoWebApp
   cd TodoWebApp
   ```

2. **Instala las dependencias**:

   ```bash
   npm install
   ```

3. **Inicia la aplicación**:

   ```bash
   npm run dev
   ```

---

## ⚙️ Configuración de almacenamiento

Puedes elegir entre dos modos:

### 🔘 LocalStorage (por defecto)

* No requiere configuración adicional.
* Los datos se almacenan en el navegador.

### ☁️ JSONBin.io (almacenamiento en la nube)

1. Regístrate en [jsonbin.io](https://jsonbin.io/) usando tu cuenta de Google o crea una cuenta gratuita.
2. En el panel de usuario, ve a **Settings → Secret Keys** y copia tu **API Key maestra**.
3. Pega la clave en la sección de configuración de la app.
4. ¡Listo! Ahora tus listas estarán disponibles desde cualquier lugar. 📡

> ℹ️ La cuenta gratuita incluye **10.000 peticiones únicas** (no se renuevan cada mes). Podrás ver y controlar las peticiones desde el panel de usuario de JSONBin.io.

---

## 🔐 Seguridad de la clave

* Tu API Key **nunca se guarda ni se envía a ningún servidor externo**.
* Es almacenada de forma local en tu navegador y se usa solo para autenticar tus peticiones a JSONBin.io.

---

## 📂 Estructura del proyecto

```
src/
├── components/       # Componentes reutilizables
├── context/          # Contexto de React (estado global)
├── pages/            # Páginas de la app (Inicio, Configuración)
├── services/         # Funciones relacionadas con almacenamiento
├── App.jsx           # Estructura principal de la app
└── main.jsx          # Punto de entrada
```

---

## 🙌 Contribuciones

¡Las contribuciones son bienvenidas! ✨
Si tienes ideas, errores o mejoras, no dudes en abrir un issue o enviar un pull request.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---
