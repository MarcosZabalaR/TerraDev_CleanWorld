# DOCUMENTACIÓN BACK-END:

- Dependencias:
    - Spring Web
    - Spring Boot DevTools
    - Lombok
    - MySQL Driver
    - Sprint Data JPA

# **DOCUMENTACIÓN DE ENDPOINTS**

Basado en las entidades:

- **User**
- **Zone**
- **CleanUp_Event**
- **Event_Attendees** (relación Many-to-Many)
- Relaciones:
    - User → Zone (1-N) mediante `reported_id`
    - Zone → CleanUp_Event (1-N) mediante `zone_id`
    - User ↔ CleanUp_Event (N-M) mediante `Event_Attendees`

---

# 👨 1. **USERS**

Gestión de los usuarios, obtener sus datos, actualización y eliminación.

## ▶️ **GET /users**

**Descripción:** Lista todos los usuarios.

**Respuesta:**

```json
[
  {
    "id": 1,
    "name": "Juan",
    "email": "juan@test.com",
    "avatar": "url/img.png",
    "points": 120,
    "created_at": "2025-01-01",
    "updated_at": "2025-01-02"
  },
    {
    "id": 2,
    "name": "Pirson",
    "email": "Pirson@test.com",
    "avatar": "url/img.png",
    "points": 121,
    "created_at": "2025-01-02",
    "updated_at": "2025-01-06"
  }
]

```

---

## ▶️ **GET /users/{id}**

**Descripción:** Devuelve un usuario específico.

**Respuesta:**

```jsx
    {
    "id": 2,
    "name": "Pirson",
    "email": "Pirson@test.com",
    "avatar": "url/img.png",
    "points": 121,
    "created_at": "2025-01-02",
    "updated_at": "2025-01-06"
  }
```

---

## ▶️ **POST /users**

**Descripción:** Crea un usuario.

### **Body requerido:**

```json
{
  "name": "Juan",
  "email": "juan@test.com",
  "password": "$134%!$!$123fdds&&ga",
  "avatar": "url/img.png",
  "points": 0
}
```

---

## ▶️ **PUT /users/{id}**

**Descripción:** Actualiza todos los datos del usuario.

**Body requerido:**

```json
{
  "name": "Juan",
  "email": "juan@test.com",
  "password": "$134%!$!$123fdds&&ga",
  "avatar": "url/img.png",
  "points": 0
}
```

---

## ▶️ **PATCH /users/{id}**

**Descripción:** Actualiza algunos datos del usuario.

**Body requerido:**

```jsx
{
  "name": "Nuevo nombre",
  "avatar": "url/new.png"
}
```

---

## ▶️ **DELETE /users/{id}**

**Descripción:** Elimina un usuario por id.

---

## ▶️ **GET /users/{id}/zones**

**Descripción:** Lista las zonas que el usuario ha reportado (relación 1-N con `Zone.reported_id`).

---

## ▶️ **GET /users/{id}/events**

**Descripción:** Lista los eventos a los que el usuario está inscrito (relación N-M).

---

---

# 🏕️ 2. **ZONES**

Gestión de las zonas, obtener sus datos, actualización y eliminación.

## ▶️ **GET /zones**

**Descripción:** Listado de zonas.

**Respuesta:**

```jsx
[
 {
	  "latitude": 10.1234,
	  "longitude": -74.1234,
	  "title": "Basurero en parque",
	  "description": "Hay acumulación de basura.",
	  "img_url": "img/zone.jpg",
	  "after_img_url": "imgAfter/zone.jpg",
	  "severity": "HIGH",
	  "status": "SUCIO",
	  "reported_id": 1
 },
 {
	  "latitude": 30.1234,
	  "longitude": -174.1234,
	  "title": "Casa de Pablo",
	  "description": "Hay acumulación de basura. Esta Pablo",
	  "img_url": "img/zone.jpg",
	  "after_img_url": "imgAfter/zone.jpg",
	  "severity": "HIGH",
	  "status": "SUCIO",
	  "reported_id": 2
 }
]
```

---

## ▶️ **GET /zones/{id}**

**Descripción:** Devuelve una zona específica.

**Respuesta:**

```jsx
 {
	  "latitude": 10.1234,
	  "longitude": -74.1234,
	  "title": "Basurero en parque",
	  "description": "Hay acumulación de basura.",
	  "img_url": "img/zone.jpg",
	  "after_img_url": "imgAfter/zone.jpg",
	  "severity": "HIGH",
	  "status": "SUCIO",
	  "reported_id": 1
 }
```

---

## ▶️ **POST /zones**

**Descripción:** Crea una zona reportada por un usuario.

### **Body requerido**

```json
{
  "latitude": 10.1234,
  "longitude": -74.1234,
  "title": "Basurero en parque",
  "description": "Hay acumulación de basura.",
  "img_url": "img/zone.jpg",
  "after_img_url": NULL,
  "severity": "HIGH",
  "status": "SUCIO",
  "reported_id": 1
}

```

---

## ▶️ **PUT /zones/{id}**

**Descripción:** Actualiza la zona.

### **Body requerido:**

```json
{
  "title": "Zona actualizada",
  "severity": "MEDIUM",
  "after_img_url": "img/after.jpg",
  "status": "CLEANED"
}

```

---

## ▶️ **DELETE /zones/{id}**

**Descripción:** Elimina una zona por id.

---

## ▶️ **GET /zones/{id}/events**

**Descripción:** Lista los eventos asociados a una zona.

---

---

# 🧹 3. **CLEAN UP EVENTS (CleanUp_Event)**

Gestión de los eventos, obtener sus datos, actualización y eliminación.

## ▶️ **GET /events**

**Descripción:** Lista todos los eventos.

**Respuesta:**

```jsx
[
  {
    "id": 1,
    "title": "Limpieza Parque",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "datetime": "2025-01-01",
    "created_at": "2025-01-01",
    "updated_at": "2025-01-01",
    "reward_points": 50,
    "zone_id ": 1
  },
  {
    "id": 2,
    "title": "Limpieza Casa Pablo",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "datetime": "2025-01-01",
    "created_at": "2025-01-01",
    "updated_at": "2025-01-01",
    "reward_points": 500,
    "zone_id ": 3
  }
]
```

---

## ▶️ **GET /events/{id}**

**Descripción:** Lista un evento especifico.

**Respuesta:**

```jsx
{
    "id": 1,
    "title": "Limpieza Parque",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "datetime": "2025-01-01",
    "reward_points": 50,
    "zone_id ": 1,
    "created_at": "2025-01-01",
    "updated_at": "2025-01-01"
  }
```

---

## ▶️ **POST /events**

**Descripción:** Crea un evento de limpieza para una zona.

### **Body requerido:**

```json
{
  "title": "Limpieza del parque central",
  "description": "Jornada de limpieza.",
  "datetime": "2025-02-20T10:00:00",
  "status": "SCHEDULED",
  "reward_points": 50,
  "zone_id": 3
}
```

---

## ▶️ **PUT /events/{id}**

**Descripción:** Actualizar todos los campos del evento.

### **Body requerido**:

```json
{
  "title": "Nuevo título del evento",
  "description": "Recogida de residuos en parque central",
  "datetime": "2025-12-15T10:00:00",
  "status": "COMPLETED",
  "reward_points": 50,
  "zone_id": 3
}
```

---

## ▶️ **PATCH /events/{id}**

**Descripción:** Actualizar algunos campos del evento.

### **Body requerido**:

```jsx
{
  "title": "Nuevo título del evento",
  "status": "COMPLETED"
}
```

## ▶️ **DELETE /events/{id}**

**Descripción:** Elimina un evento especifico. 

---

## ▶️ **GET /events/{id}/attendees**

**Descripción:** Lista usuarios que asistirán al evento.

---

# 🟣 4. **EVENT ATTENDEES (Relación N-M)**

## ▶️ **POST /events/{id}/attendees**

**Descripción:** Registra un usuario en un evento.

### **Body requerido:**

```json
{
  "user_id": 7
}

```

---

## ▶️ **DELETE /events/{event_id}/attendees/{user_id}**

**Descripción:** Elimina la inscripción de un usuario.

---

---

# 📝 **Resumen de cuerpos por entidad**

### ✔ **User**

```json
{
    "id": 1,
    "name": "Juan",
    "email": "juan@test.com",
    "avatar": "url/img.png",
    "points": 120,
    "created_at": "2025-01-01",
    "updated_at": "2025-01-02"
  }

```

### ✔ **Zone**

```json
{
	  "latitude": 10.1234,
	  "longitude": -74.1234,
	  "title": "Basurero en parque",
	  "description": "Hay acumulación de basura.",
	  "img_url": "img/zone.jpg",
	  "after_img_url": "imgAfter/zone.jpg",
	  "severity": "HIGH",
	  "status": "SUCIO",
	  "reported_id": 1
 }

```

### ✔ **CleanUp_Event**

```json
{
    "id": 1,
    "title": "Limpieza Parque",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "datetime": "2025-01-01",
    "created_at": "2025-01-01",
    "updated_at": "2025-01-01",
    "reward_points": 50,
    "zone_id ": 1
  }

```

### ✔ **Event_Attendees**

```json
{
  "user_id": 0
}

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```