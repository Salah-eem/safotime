@echo off
echo ============================================
echo Configuration MongoDB Atlas pour SAFOTIME
echo ============================================
echo.
echo Pour configurer votre connexion MongoDB Atlas :
echo.
echo 1. Connectez-vous a https://cloud.mongodb.com/
echo 2. Selectionnez votre cluster
echo 3. Cliquez sur "Connect"
echo 4. Choisissez "Connect your application"
echo 5. Selectionnez "Node.js" comme driver
echo 6. Copiez la chaine de connexion
echo.
echo Format attendu :
echo mongodb+srv://username:password@cluster-url/dbname?retryWrites=true^&w=majority
echo.
echo ============================================
echo Configuration du fichier .env
echo ============================================
echo.

set /p mongodb_uri="Collez votre URI MongoDB Atlas : "
set /p jwt_secret="Entrez une cle secrete JWT (ou appuyez sur Entree pour garder celle par defaut) : "

if "%jwt_secret%"=="" set jwt_secret=votre_secret_jwt_key_ici_changez_cette_valeur

echo.
echo Creation du fichier .env...

(
echo PORT=5000
echo MONGODB_URI=%mongodb_uri%
echo JWT_SECRET=%jwt_secret%
echo NODE_ENV=development
) > .env

echo.
echo ============================================
echo Configuration terminee !
echo ============================================
echo.
echo Le fichier .env a ete cree avec votre configuration.
echo Vous pouvez maintenant demarrer l'application avec :
echo.
echo 1. start-backend.bat
echo 2. start-frontend.bat
echo.
echo Pour initialiser la base avec des donnees d'exemple :
echo init-database.bat
echo.
pause
