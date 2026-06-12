# Guía para Ejecutar el Proyecto con la Consola (CMD)

Esta guía te explica paso a paso cómo abrir la consola de comandos de Windows (CMD) y ejecutar la aplicación de **Edugen Panama SaaS**.

---

## Requisitos Previos

Asegúrate de tener instalado **Node.js** en tu computadora. Si no lo tienes:
1. Descárgalo e instálalo desde [nodejs.org](https://nodejs.org/).
2. Se recomienda la versión **LTS** (Long Term Support).

---

## Método 1: Ejecución Manual con CMD (Paso a Paso)

Sigue estos pasos para correr el proyecto manualmente desde la consola:

### Paso 1: Abrir la consola de comandos (CMD)
1. Presiona la tecla `Windows` de tu teclado.
2. Escribe `cmd` y presiona `Enter`.

### Paso 2: Navegar a la carpeta del proyecto
Debes ubicarte en el directorio donde está guardado este proyecto. Copia y pega el siguiente comando en tu consola y presiona `Enter`:

```cmd
cd "c:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas"
```

### Paso 3: Instalar las dependencias (Solo la primera vez)
Si es la primera vez que ejecutas el proyecto en esta computadora o si se agregaron nuevos paquetes, debes descargar las dependencias ejecutando:

```cmd
npm install
```
*(Espera a que termine el proceso de descarga e instalación).*

### Paso 4: Iniciar el servidor de desarrollo
Para encender el servidor local y ver la aplicación web en tu navegador, ejecuta:

```cmd
npm run dev
```

### Paso 5: Abrir la aplicación en el navegador
Una vez que el servidor inicie, la consola negra de CMD te mostrará tus direcciones de acceso reales (escaneará tu red y pondrá tu IP automáticamente), por ejemplo:
```text
  VITE v8.x.x  ready in X ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.15:3000/  <-- (Aquí aparecerá tu IP real)
```
Abre tu navegador de internet (Chrome, Edge, Firefox, etc.) e ingresa a cualquiera de las siguientes direcciones:
* **Local**: **[http://localhost:3000/](http://localhost:3000/)** (Úsala si estás en la misma computadora donde corre el código).
* **Red local (Network)**: Usa la dirección exacta que te muestre la consola al lado de la palabra **Network** (por ejemplo: `http://192.168.1.15:3000/`). Úsala si quieres abrir la app desde tu celular o desde otra computadora conectada al mismo Wi-Fi.

---

## Método 2: Ejecución Rápida (Recomendado 🚀)

Para facilitarte el proceso, hemos creado un archivo directo de inicio llamado `iniciar.bat` en la carpeta raíz del proyecto.

1. Ve a la carpeta del proyecto desde el Explorador de Archivos de Windows: `c:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas`
2. Busca el archivo **`iniciar.bat`**.
3. Haz **doble clic** sobre él.
4. Se abrirá automáticamente una ventana de CMD, instalará/verificará dependencias e iniciará el proyecto.
5. Abre **[http://localhost:3000/](http://localhost:3000/)** en tu navegador.

---

## Comandos Útiles

* **Detener el servidor**: Presiona `Ctrl + C` en la consola de CMD y luego escribe `S` (o `Y` en inglés) y presiona `Enter`.
* **Compilar para producción**: `npm run build` (creará la carpeta `dist` lista para subir al servidor).
