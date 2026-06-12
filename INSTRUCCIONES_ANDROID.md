# Guía para Compilar la App en Android (Google Play Wrapper)

Esta guía explica cómo empaquetar la aplicación web de **Edugen Panama PRO** como una aplicación nativa para Android utilizando **Capacitor** de Ionic. Esto te permitirá generar un archivo `.apk` o `.aab` para subirlo a la Google Play Store.

---

## Requisitos de tu Sistema

Antes de comenzar, asegúrate de tener instalado en tu computadora:
1. **Node.js** (Ya instalado para el proyecto).
2. **Android Studio** (Descárgalo desde [developer.android.com](https://developer.android.com/studio)).
3. **Android SDK** y herramientas de plataforma (instaladas automáticamente con Android Studio).

---

## Paso 1: Instalar dependencias de Capacitor

Abre tu consola de comandos (CMD), ve al directorio del proyecto y ejecuta los siguientes comandos para instalar Capacitor Core y Capacitor CLI:

```cmd
npm install @capacitor/core @capacitor/cli
```

---

## Paso 2: Inicializar Capacitor

Inicializa Capacitor en el proyecto ejecutando el comando de inicialización:

```cmd
npx cap init "EduGen Panama PRO" "pro.edugen.panama" --web-dir=dist
```
*(Nota: El archivo `capacitor.config.json` ya se ha creado en la raíz del proyecto para ti, con esta configuración básica).*

---

## Paso 3: Compilar la Aplicación Web (Producción)

Antes de pasar el código a Android, debes generar los archivos estáticos de producción:

```cmd
npm run build
```
Esto creará una carpeta llamada `dist/` con todo el código minificado, estilos y assets de React.

---

## Paso 4: Agregar la Plataforma de Android

Instala el paquete de Android para Capacitor y añádelo como plataforma de compilación:

```cmd
npm install @capacitor/android
npx cap add android
```
Esto creará una carpeta nativa de Android (`android/`) dentro del directorio del proyecto.

---

## Paso 5: Sincronizar el Código Web con Android

Cada vez que realices cambios en tu código React y ejecutes `npm run build`, debes sincronizar esos archivos con el proyecto de Android ejecutando:

```cmd
npx cap sync
```

---

## Paso 6: Abrir el Proyecto en Android Studio y Compilar

Para generar el instalador `.apk` o prepararte para subirlo a la Google Play Store, abre el proyecto en Android Studio usando Capacitor:

```cmd
npx cap open android
```

### Dentro de Android Studio:
1. Espera a que Gradle termine de sincronizar y descargar los recursos necesarios.
2. **Para probar en un Emulador o Celular Real**:
   - Conecta tu celular por USB (con la Depuración USB activada en Opciones de Desarrollador).
   - Presiona el botón verde de "Run" (ejecutar) en la barra superior de Android Studio.
3. **Para compilar el APK de Prueba**:
   - Ve al menú superior: **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
   - Una vez finalizado, Android Studio te mostrará un aviso abajo a la derecha con un enlace "Locate" para ver tu archivo `app-debug.apk`.
4. **Para compilar para Google Play Store**:
   - Ve al menú: **Build** > **Generate Signed Bundle / APK**.
   - Elige **Android App Bundle** (obligatorio para Google Play actualmente).
   - Crea una firma digital (.keystore) y compila el paquete en modo **Release**.
