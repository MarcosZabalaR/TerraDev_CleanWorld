# ⚙️ HITO 3 — Sprint 1 preparado (Backlog técnico + Arquitectura + GitHub)

# **1. Arquitectura general (frontend + backend)**

### **Tecnologías**

- **Frontend:** React + Vite + Leaflet + TailwindCSS (?)
- **Backend:** Java + Spring Boot
- **BD:** MySQL
- **Autenticación:** JWT (OAuth opcional más adelante) (?)
- **Imágenes:** Almacenamiento local / Cloudinary (según tiempo)
- **Mapas:** OpenStreetMap

### **Arquitectura visual**

```
                       ┌────────────────────┐
                       │    Usuario Web     │
                       └─────────┬──────────┘
                                 │
                         (HTTP / REST API)
                                 │
                 ┌───────────────▼────────────────┐
                 │        Frontend React          │
                 └───────────────┬────────────────┘
                                 │
                 Llamadas REST   │    JSON
                                 │
                 ┌───────────────▼────────────────┐
                 │     Backend (Spring Boot)      │
                 │  Controladores / Servicios /   │
                 │  Repositorios / Seguridad JWT  │
                 └───────────────┬────────────────┘
                                 │
                           Consultas SQL
                                 │
                 ┌───────────────▼─────────────────┐
                 │             MySQL               │
                 └─────────────────────────────────┘

```

# **2. Modelo de datos + estructura de API**

## **Modelo de datos final (para MySQL)**

### Tabla: **users**

- id (PK)
- name
- email
- passwordHash
- avatar
- points

### Tabla: **zones**

- id (PK)
- lat
- lng
- title
- description
- image_url
- after_image_url
- severity (BAJA, MEDIA, ALTA)
- status (REPORTADO, EVENTO_CREADO, LIMPIO)
- reporter_id (FK -> users)
- created_at

### Tabla: **cleanup_events**

- id (PK)
- zone_id (FK -> zones)
- title
- description
- date
- time
- max_attendees

### Tabla: **event_attendees**

(M:N entre user y events)

- event_id (FK -> cleanup_events)
- user_id (FK -> users)

### Tabla: **recycling_points**

- id
- lat
- lng
- type
- address

## **Endpoints de la API**

### **Usuarios**

```
POST /auth/register
POST /auth/login
GET  /users/me
```

### **Zonas sucias**

```
GET    /zones
GET    /zones/{id}
POST   /zones
PUT    /zones/{id}
PUT    /zones/{id}/status
POST   /zones/{id}/after-image
```

### **Eventos**

```
GET    /events
GET    /events/{id}
POST   /events
PUT    /events/{id}
DELETE /events/{id}

POST   /events/{id}/join
DELETE /events/{id}/leave
```

### **Puntos de reciclaje**

```
GET /recycling

*UNO POR CADA TIPO DE CONTENEDOR
```

# **3. Historias seleccionadas para Sprint 1**

Para que Sprint 1 sea eficaz, tomamos **solo funcionalidad MUST**:

### **Sprint 1 – Historias**

1. **HU1** – Ver mapa con zonas sucias
2. **HU2** – Reportar zona sucia
3. **HU3** – Crear evento de limpieza
4. **HU4** – Apuntarse a un evento
5. **Autenticación básica (login + registro)**
6. **Backend base operativo + API funcional**

No se incluyen aún:

- Puntos de reciclaje
- Notificaciones
- Gamificación
- Validación visual post-limpieza (afterImage)

# **4. Tareas técnicas (T-01, T-02…)**

## 🔧 **Backend – Tareas**

### **Inicialización**

- **T-01** Crear proyecto Spring Boot
- **T-02** Configurar conexión MySQL
- **T-03** Crear entidades JPA (User, Zone, CleanupEvent, RecyclingPoint)
- **T-04** Crear repositorios JPA
- **T-05** Configurar seguridad JWT
- **T-06** Crear controladores base (/auth, /zones, /events)

### **HU1 / HU2 – Zonas sucias**

- **T-07** Endpoint GET /zones
- **T-08** Endpoint GET /zones/{id}
- **T-09** Endpoint POST /zones (crear zona sucia)
- **T-10** Validaciones del formulario zone
- **T-11** Subida de imagen (local o Cloudinary)

### **HU3 – Eventos**

- **T-12** Endpoint POST /events
- **T-13** Endpoint GET /events
- **T-14** Endpoint GET /events/{id}

### **HU4 – Participación**

- **T-15** Endpoint POST /events/{id}/join
- **T-16** Endpoint DELETE /events/{id}/leave

---

## 🎨 **Frontend – Tareas**

### **Base del proyecto**

- **T-17** Crear proyecto React + Vite
- **T-18** Instalar Leaflet y configurar mapa
- **T-19** Añadir Tailwind

### **HU1 – Ver zonas**

- **T-20** Vista Mapa con Leaflet
- **T-21** Petición GET /zones
- **T-22** Mostrar marcadores según gravedad

### **HU2 – Crear zona**

- **T-23** Formulario Crear Zona Sucia
- **T-24** Enviar datos + imagen al backend
- **T-25** Redibujar marcador en tiempo real

### **HU3 – Crear evento**

- **T-26** Modal/Componente Crear Evento
- **T-27** Enviar a /events
- **T-28** Mostrar evento asociado en el mapa

### **HU4 – Apuntarse**

- **T-29** Botón “Participar”
- **T-30** Enviar a /events/{id}/join
- **T-31** Actualizar listado asistentes

# **5. Tablero Kanban**

[TerraDev CleanWorld](https://marcoszabalarodriguezs-team.monday.com/boards/5088324811)

### **Meter T-01 a T-31 en To Do, ordenado según Sprint 1.**

# **6. Repositorio GitHub con estructura inicial**

```
cleanworld/
 ├─ backend/
 │   ├─ src/main/java/com/cleanworld
 │   ├─ src/main/resources/application.properties
 │   └─ pom.xml
 ├─ frontend/
 │   ├─ src/
 │   ├─ public/
 │   └─ package.json
 ├─ docs/
 │   ├─ arquitectura.md
 │   ├─ api.md
 │   └─ modelo_datos.png
 └─ README.md

```

Contenido del README:

- Descripción del proyecto
- Cómo levantar frontend
- Cómo levantar backend
- Integrantes del equipo

# **7. Scripts y configuraciones mínimas listas**

### Backend

- Spring Boot arranca sin errores
- Puerto definido (ej. 8080)
- MySQL conectado
- Controlador dummy en /health
- CORS activado para frontend

### Frontend

- Proyecto React creado
- Página con mapa vacío funcionando
- Variables de entorno preparadas