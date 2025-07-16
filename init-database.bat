@echo off
echo ============================================
echo Initialisation de la base de donnees
echo ============================================
echo.
echo Ce script va ajouter des donnees d'exemple
echo dans votre base de donnees MongoDB.
echo.
set /p confirm="Continuer? (o/n): "
if /i not "%confirm%"=="o" (
    echo Operation annulee.
    pause
    exit /b 0
)

echo.
echo Ajout des donnees d'exemple...
cd backend
call npm run seed

echo.
echo ============================================
echo Base de donnees initialisee avec succes!
echo ============================================
echo.
echo Vous pouvez maintenant demarrer l'application
echo avec start-backend.bat et start-frontend.bat
echo.
pause
