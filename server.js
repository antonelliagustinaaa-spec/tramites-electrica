async function conectarDB() {
    try {
        const client = new MongoClient(uri, {
            tls: true,
            tlsAllowInvalidCertificates: true // Fuerza la aceptación del certificado en la nube
        });
        await client.connect();
        db = client.db('tramites_electricidad');
        console.log("¡Conectado exitosamente a MongoDB Atlas!");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
    }
}
