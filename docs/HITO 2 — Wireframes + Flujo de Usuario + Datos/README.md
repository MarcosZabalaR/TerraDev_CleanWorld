# 🎨 HITO 2 — Wireframes + Flujo de Usuario + Datos

# WIREFRAME

![image.png](imgs/image.png)

![image.png](imgs/image%201.png)

![image.png](imgs/image%202.png)

![image.png](imgs/image%203.png)

![image.png](imgs/image%204.png)

![image.png](imgs/image%205.png)

![image.png](imgs/image%206.png)

![image.png](imgs/image%207.png)

![image.png](imgs/image%208.png)

![image.png](imgs/image%209.png)

![image.png](imgs/image%2010.png)

![image.png](imgs/image%2011.png)

![image.png](imgs/image%2012.png)

![image.png](imgs/image%2013.png)

![image.png](imgs/image%2014.png)

![image.png](imgs/image%2015.png)

![image.png](imgs/image%2016.png)

![image.png](imgs/image%2017.png)

![image.png](imgs/image%2018.png)

![image.png](imgs/image%2019.png)

![image.png](imgs/image%2020.png)

# Flujo completo de usuario (inicio → acción → resultado)

### **1. Flujo de Acceso (Onboarding)**

*El usuario entra por primera vez a la aplicación.*

- **Inicio:** El usuario abre la web/app. Se encuentra con la **AuthScreen** (Pantalla de Autenticación).
- **Acción:**
    - **Opción A (Google):** Clic en "Continuar con Google".
    - **Opción B (Registro/Login):** Introduce nombre (si es registro), email y contraseña → Clic en "Crear Cuenta" o "Iniciar Sesión".
- **Proceso Interno:** La app verifica credenciales.
- **Resultado:** El usuario es redirigido a la **Vista de Mapa** centrada en su ubicación actual. Se carga su perfil y puntos en la barra superior.

---

### **2. Flujo de Reporte (La funcionalidad principal)**

*El usuario encuentra basura en la calle y quiere avisar a la comunidad.*

- **Inicio:** El usuario está en la **Vista de Mapa** o **Lista**.
- **Acción 1 (Iniciar):** Clic en "Reportar" en la cabecera o en el botón flotante grande (+) (móvil).
- **Acción 2 (Ubicar):**
    - Aparece una **mirilla (crosshair)** fija en el centro de la pantalla y el mensaje "Arrastra el mapa".
    - El usuario mueve el mapa hasta que la mirilla apunta exactamente donde está la basura.
    - Clic en **"Confirmar Ubicación"**.
- **Acción 3 (Detalles):** Se abre el modal de formulario.
    - Sube una foto.
    - Escribe título y descripción.
    - Selecciona gravedad (Baja/Media/Alta).
    - Clic en **"Enviar Reporte"**.
- **Resultado:**
    - El modal se cierra.
    - Aparece inmediatamente un nuevo **marcador en el mapa** (Amarillo, Naranja o Rojo según la gravedad).
    - El reporte se añade a la "Lista de Zonas".

---

### **3. Flujo de Eventos de Limpieza**

*Coordinación para limpiar una zona reportada.*

### **A. Crear un Evento (Organizador)**

- **Inicio:** El usuario hace clic en un marcador de zona sucia en el mapa.
- **Acción 1:** Se abre el **Drawer de Detalle** (panel inferior). Ve la info de la zona.
- **Acción 2:** Clic en el botón azul **"Crear Evento"**.
- **Acción 3:** Rellena el formulario (Nombre del evento, fecha, hora, máx. asistentes, instrucciones). Clic en "Crear".
- **Resultado:**
    - El marcador de la zona en el mapa cambia de icono: de "Alerta" a **"Calendario"**.
    - El estado de la zona pasa a EVENTO_CREADO.
    - El evento aparece en la pestaña "Eventos".

### **B. Unirse a un Evento (Voluntario)**

- **Inicio:** El usuario navega a la pestaña **"Eventos"** o hace clic en una zona con icono de calendario.
- **Acción 1:** Visualiza la tarjeta del evento.
- **Acción 2:** Clic en el botón **"Apuntarme"**.
- **Resultado:**
    - El contador de asistentes sube (+1).
    - El botón cambia a estado rojo **"Desapuntarse"**.
    - El usuario ve reflejada su participación en su perfil.

---

### **4. Flujo de Puntos de Reciclaje**

*El usuario quiere saber dónde tirar vidrio, pilas, etc.*

- **Inicio:** Vista de Mapa (donde se ven las zonas sucias).
- **Acción:** Clic en el botón superior derecho **"Ver Reciclaje"**.
- **Resultado Visual:**
    - **Desaparecen** los marcadores de zonas sucias y eventos (limpieza visual).
    - **Aparecen** los iconos de reciclaje.
- **Acción Secundaria:** Clic en un icono de reciclaje.
- **Resultado Final:** Se abre un popup con el tipo de residuo y un botón "Ir al punto" que abre Google Maps para navegar hacia allí.

---

### **5. Flujo de Perfil y Configuración**

*Gestión de usuario.*

- **Inicio:** Clic en la pestaña **"Perfil"** (o "Yo" en móvil).
- **Visualización:** Ve sus estadísticas (Puntos de impacto, nº de reportes, nº de eventos).
- **Acción (Editar):** Clic en "Configuración de Perfil".
    - Cambia su nombre o avatar.
    - Clic en "Guardar".
- **Resultado:** Los datos se actualizan en toda la app.
- **Acción (Logout):** Clic en "Cerrar Sesión".
- **Resultado:** Se borran los datos de sesión local y el usuario vuelve a la **AuthScreen** (Inicio).

# Lista de datos/entidades del sistema

### **1. Usuario (User)**

Representa a una persona registrada en la plataforma.

- **id** (string): Identificador único (ej. "user_123").
- **name** (string): Nombre público del usuario.
- **email** (string): Correo electrónico (usado para login).
- **avatar** (string): URL de la imagen de perfil.
- **points** (number): Sistema de gamificación (puntos acumulados por reportar/limpiar).

### **2. Zona Sucia (Zone)**

El elemento central del problema. Un punto geográfico reportado por un usuario.

- **id** (string): Identificador único.
- **lat** (number): Latitud geográfica.
- **lng** (number): Longitud geográfica.
- **title** (string): Título corto del reporte (ej. "Vertedero en el parque").
- **description** (string): Explicación detallada del problema.
- **imageUrl** (string): URL de la foto de la zona sucia ("el problema").
- **afterImageUrl** (string - *opcional*): URL de la foto después de limpiar ("la solución").
- **severity** (enum): Nivel de gravedad.
    - BAJA (Amarillo)
    - MEDIA (Naranja)
    - ALTA (Rojo)
- **status** (enum): Estado actual de la zona.
    - REPORTADO (Nadie ha actuado aún).
    - EVENTO_CREADO (Hay una limpieza programada).
    - LIMPIO (Problema resuelto).
- **reporterId** (string): ID del usuario que creó el reporte.
- **createdAt** (string - ISO Date): Fecha de creación.

### **3. Evento de Limpieza (CleanupEvent)**

Una convocatoria organizada para limpiar una Zona específica.

- **id** (string): Identificador único.
- **zoneId** (string): ID de la Zone asociada (Relación 1 a 1 en este MVP).
- **title** (string): Nombre del evento (ej. "Limpieza vecinal domingo").
- **description** (string): Instrucciones para los asistentes (material, punto de encuentro).
- **date** (string): Fecha del evento (YYYY-MM-DD).
- **time** (string): Hora de inicio (HH:MM).
- **attendees** (string[]): Lista (array) de IDs de usuarios (User) que se han apuntado.
- **maxAttendees** (number): Límite de participantes permitidos.

### **4. Punto de Reciclaje (RecyclingPoint)**

Puntos informativos estáticos sobre dónde reciclar.

- **id** (string): Identificador único.
- **lat** (number): Latitud.
- **lng** (number): Longitud.
- **type** (enum): Tipo de residuo que acepta.
    - VIDRIO (Contenedor verde).
    - ENVASES (Contenedor amarillo).
    - PAPEL (Contenedor azul).
    - PILAS (Contenedor específico).
    - PUNTO_LIMPIO (General).
- **address** (string - *opcional*): Dirección postal textual.

---

### **Resumen de Relaciones**

1. **Usuario** -> crea -> **Zonas** (1:N)
2. **Zona** -> tiene -> **Evento** (1:0..1) *(Una zona puede tener un evento activo)*.
3. **Usuario** -> asiste -> **Eventos** (M:N) *(Un usuario va a muchos eventos, un evento tiene muchos usuarios)*.
4. **Puntos de Reciclaje** son entidades independientes (capa informativa).