@echo off
echo ============================================
echo Installation de SAFOTIME
echo ============================================

echo.
echo Installation des dependances du backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Erreur lors de l'installation du backend
    pause
    exit /b 1
)

echo.
echo Installation des dependances du frontend...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Erreur lors de l'installation du frontend
    pause
    exit /b 1
)

cd ..
echo.
echo ============================================
echo Installation terminee avec succes!
echo ============================================
echo.
echo Prochaines etapes :
echo 1. Configurez votre base de donnees MongoDB Atlas :
echo    - Executez configure-atlas.bat (recommande)
echo    - OU modifiez manuellement backend/.env
echo 2. Initialisez la base avec des donnees d'exemple :
echo    - Executez init-database.bat
echo 3. Demarrez l'application :
echo    - Executez start-backend.bat
echo    - Executez start-frontend.bat
echo 4. Ouvrez http://localhost:3000 dans votre navigateur
echo.
set /p config="Voulez-vous configurer MongoDB Atlas maintenant ? (o/n): "
if /i "%config%"=="o" (
    call configure-atlas.bat
)
echo.
pause
