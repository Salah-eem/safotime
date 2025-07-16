@echo off
echo ============================================
echo Test de connexion MongoDB Atlas
echo ============================================
echo.
cd backend
call npm run test-connection
echo.
if %errorlevel% equ 0 (
    echo ============================================
    echo Test reussi ! Votre connexion Atlas fonctionne.
    echo Vous pouvez maintenant demarrer l'application.
    echo ============================================
) else (
    echo ============================================
    echo Test echoue. Verifiez votre configuration.
    echo Executez configure-atlas.bat pour reconfigurer.
    echo ============================================
)
echo.
pause
