@echo off
title Iniciar Edugen Panama SaaS
echo ===================================================
echo           Edugen Panama SaaS - Lanzador
echo ===================================================
echo.

:: Verificar si Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado en este sistema.
    echo Por favor, descarga e instala Node.js desde https://nodejs.org/
    echo.
    pause
    exit /b
)

:: Verificar si node_modules existe, si no, ejecutar npm install
if not exist node_modules (
    echo [INFO] Carpeta node_modules no encontrada. Instalando dependencias...
    call npm install
    echo.
)

echo Iniciando el servidor de desarrollo local...
echo Una vez iniciado, abre http://localhost:3000/ en tu navegador (o la direccion de red que se muestre).
echo.
echo Presiona Ctrl + C en esta ventana en cualquier momento para detener el servidor.
echo ---------------------------------------------------
echo.

call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Hubo un problema al iniciar el servidor.
    echo Intenta ejecutar 'npm install' manualmente o verifica que el puerto no este ocupado.
    echo.
    pause
)
