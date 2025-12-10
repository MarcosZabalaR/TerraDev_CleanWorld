# TerraDev: CleanWorld
Projecto web de TerraDev para Fundación Esplai con el objetivo de identificar, visualizar y coordinar acciones de limpieza ciudadana en tiempo real.

---

---

![lean-orld-high-resolution-logo-transparent.png](imgs/lean-orld-high-resolution-logo-transparent.png)![logo-app.png](imgs/logo-app.png)

# **1. Problema**

En muchas ciudades existen **puntos sucios, vertidos ilegales y acumulaciones de basura** que permanecen durante semanas porque no están correctamente reportados o porque las administraciones no pueden cubrir toda la superficie urbana.

A la vez, existen **grupos de voluntarios y ciudadanos** dispuestos a colaborar en limpiezas comunitarias, pero:

- no saben **dónde** hay zonas que necesitan intervención,
- no existe una plataforma clara que **coordine** eventos de limpieza,
- no hay una herramienta que muestre **estado real**, nivel de gravedad o seguimiento,
- no hay un modo de **visualizar el impacto** del esfuerzo ciudadano.

Esto genera:

- Falta de coordinación entre voluntariado y ciudadanía.
- Zonas sucias persistentes que afectan a salud, imagen urbana y ecosistemas.
- Pérdida de oportunidades de participación comunitaria y educación ambiental.

---

# **2. Propuesta de valor**

**CleanWorld** es una plataforma web que permite identificar, visualizar y coordinar acciones de limpieza ciudadana en tiempo real.

Aporta valor porque:

- Facilita un **mapa colaborativo** donde cualquier usuario puede reportar una zona sucia.
- Permite crear **eventos de limpieza** con hora, ubicación exacta y gestión sencilla de asistentes.
- Introduce un **sistema de gravedad** (baja/media/alta) para priorizar intervenciones.
- Mejora la información ambiental ofreciendo **puntos de reciclaje cercanos**.
- Potencia la participación con **notificaciones** y llamados a la acción.
- Puede crecer hacia gamificación, validación comunitaria o automatización de eventos.

En resumen: **ordena la información, coordina a las personas y reduce el tiempo que una zona permanece sucia**, aportando impacto real y demostrable.

# 3. Lista de funcionalidades priorizadas MoSCoW

| Prioridad  | Funcionalidad  | Descripción |
| --- | --- | --- |
| **Must Have** | Gestion de mapa | Mostrar un mapa de la zona que poder marcar distintas zonas de limpieza |
|  | Gestión de usuarios | Autenticación con OAuth (?) |
|  | Creación de Evento de limpieza y gestión | Mostar en la zona marcada un evento de limpieza con la hora a la que se organiza y forma de apuntarse y gestionar los usuarios apuntados, e incluir sistema de gravedad (suciedad baja/media/alta) |
|  | Feedback fotográfico | Registro por zonas mediante fotografías del antes y el después. |
|  |  |  |
| **Should Have** | Ver puntos de reciclaje | Mostrar puntos cercanos mediante API o dataset local. Filtrar por tipo de residuo |
|  | Botón “llevarme aquí” | Abre Google Maps del móvil directamente. |
|  | Notificaciones push | Recordatorios de eventos a los que el user se registró o nuevos eventos creados en determinadas zonas |
|  |  |  |
| **Could Have** | Foro de opinión y sugerencias | Un foro comunitario donde comentar y reaccionar a los distintos eventos de la web. |
|  | Sistema de recompensa de puntos | Por cada evento asistido y acción realizada se recompensaría con puntos canjeables por utensilios de limpieza, vales restaurante, etc. |
|  | Creación de eventos automáticos | Si no hay un evento de limpieza en x zona sucia en determinado tiempo, se crea un evento automáticamente para hacer efecto llamada |
|  | Sistema de validación comunitaria | Cuando alguien marca limpio un punto, otros pueden confirmar: “¿Está limpio?” → Sí / No. Con 2-3 votos positivos, pasa a “resuelto” |
|  |  |  |
| **Wont Have (now)** | Donativos a organizaciones | Vía de pago a organizaciones para colaborar en la compra de material. |
|  | Perfiles de equipo a organizaciones | Dar versiones mejoradas a empresas u organizaciones para una mejor gestión de los eventos. |
|  | ChatBot IA | Chat sencillo donde consultar zonas comunmente en necesidad de limpieza |
|  |  |  |

# **4. Historias de usuario principales**

---

### **HU1 – Como usuario quiero ver un mapa con zonas sucias**

**Para** poder identificar qué lugares necesitan limpieza.

**Criterios de aceptación:**

- Se muestra un mapa interactivo.
- Los puntos existentes se cargan automáticamente.
- Se ven categoría, gravedad y estado al hacer clic.

---

### **HU2 – Como usuario quiero reportar una zona sucia**

**Para** que otros usuarios puedan conocer dónde hace falta intervenir.

**Criterios:**

- Seleccionar ubicación en el mapa.
- Rellenar descripción, foto opcional y gravedad.
- Confirmación visual del nuevo punto.

---

### **HU3 – Como usuario quiero crear un evento en una zona sucia**

**Para** organizar una limpieza en una fecha concreta.

**Criterios:**

- Incluye fecha, hora, descripción y nivel de gravedad.
- El evento se muestra en el mapa y listado.

---

### **HU4 – Como usuario quiero apuntarme a un evento**

**Para** participar en la limpieza y estar informado.

**Criterios:**

- Botón de “Apuntarse” visible.
- El sistema confirma mi inscripción.
- El creador del evento puede ver la lista de asistentes.

---

### **HU5 – Como usuario quiero recibir recordatorios** *(Should Have)*

**Para** no olvidar los eventos a los que me apunté.

**Criterios:**

- Notificación push 24h y 1h antes (configurable).
- Permiso de notificaciones gestionado desde el navegador.

---

### **HU6 – Como usuario quiero ver puntos de reciclaje cercanos**

**Para** saber dónde depositar residuos recogidos.

**Criterios:**

- Se muestran en el mapa como capas independientes.
- Se pueden filtrar por tipo de residuo.

---

### **HU7 – Como usuario quiero usar “llevarme aquí”**

**Para** abrir Google Maps y navegar al punto.

**Criterios:**

- Botón visible en el popup del evento.
- Abre la app de mapas con la coordenada exacta.

# **5. Alcance del MVP**

El MVP de **CleanWorld** incluirá:

### **Frontend**

- Mapa interactivo con Leaflet/OpenStreetMap.
- Marcado de zonas sucias.
- Visualización de eventos.
- Formularios para creación de eventos y gestión de asistentes.
- Filtro por gravedad.
- Capa de puntos de reciclaje (Should Have).
- Notificaciones push básicas (Should Have).

### **Backend**

- API REST para:
    - Zonas sucias (CRUD).
    - Eventos (CRUD + participación).
    - Usuarios (registro/login OAuth opcional).
    - Estadísticas básicas.
- Gestión de imágenes (Cloudinary o local).
- Seguridad con OAuth2 or JWT (según preferencia).
- Validación de datos y estados.

