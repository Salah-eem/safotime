const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  console.log('🔍 Test de connexion MongoDB Atlas...');
  console.log('📍 URI:', process.env.MONGODB_URI ? 'Définie' : 'Non définie');
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI non définie dans le fichier .env');
    console.log('💡 Exécutez configure-atlas.bat pour configurer votre connexion');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connexion réussie à MongoDB Atlas !');
    console.log('📊 Base de données:', mongoose.connection.db.databaseName);
    console.log('🌍 Serveur:', mongoose.connection.host);
    
    // Test d'écriture
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('✅ Test d\'écriture réussi');
    
    // Nettoyage
    await testCollection.deleteOne({ test: true });
    console.log('✅ Test de suppression réussi');
    
    console.log('🎉 Votre configuration MongoDB Atlas fonctionne parfaitement !');
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('💡 Vérifiez votre nom d\'utilisateur et mot de passe');
    } else if (error.message.includes('network')) {
      console.log('💡 Vérifiez votre connexion internet et les accès réseau dans Atlas');
    } else {
      console.log('💡 Vérifiez votre URI de connexion MongoDB Atlas');
    }
    
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
}

testConnection();
