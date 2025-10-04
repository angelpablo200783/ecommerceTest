# EcommerceTest

Aplicación de pedidos y ventas en línea desarrollada con **React** (frontend) y **Node.js/Express** (backend), conectada a la base de datos **MySQL**.

## Características principales

- Registro y autenticación de usuarios
- Catálogo de productos
- Carrito de compras y gestión de pedidos
- Panel administrativo
- CRUD de productos 
- Pruebas unitarias para backend

---

## Requisitos  

- Node.js  
- npm 
- MySQL Server

---

## Instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/josh-hrr/ecommerceTest.git
cd ecommerceTest
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura la base de datos

- Crea una base de datos MySQL llamada `tienda_en_linea`.
- Ajusta las credenciales de conexión en el archivo `.env` (si existe) o en `src/backend/server.js`/`src/backend/app.js` según corresponda.

Ejemplo de variables de entorno (`.env`):

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=12345678Spring
DB_NAME=tienda_en_linea
PORT=3000
```

---

## Ejecución del proyecto

### 1. Inicia el backend

```bash
# Desde la raíz del proyecto
cd src/backend
node app.js
```

El backend estará disponible en: [http://localhost:3000](http://localhost:3000)

### 2. Inicia el frontend

En otra terminal, desde la raíz del proyecto:

```bash
npm run dev
```

El frontend estará disponible en: [http://localhost:5173](http://localhost:5173)

---

## Scripts útiles

- `npm run dev` — Inicia el frontend en modo desarrollo (Vite)
- `npm run build` — Compila el frontend para producción
- `npm run lint` — Ejecuta ESLint
- `npm run test` — Ejecuta pruebas unitarias (Jest)
- `npm run test:watch` — Ejecuta pruebas en modo watch
- `npm run test:coverage` — Genera reporte de cobertura de pruebas

---

## Estructura del proyecto

```
ecommerceTest/
│
├── src/
│   ├── backend/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── tests/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── main.tsx
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Pruebas

Para ejecutar las pruebas unitarias del backend:

```bash
npm run test
```

---

## Notas

- Asegurarse de que la base de datos esté corriendo antes de iniciar el backend.
- Puedes modificar las variables de entorno en `.env` para personalizar la configuración.
- El proyecto utiliza Vite para el frontend y NodeJS/Express para el backend.