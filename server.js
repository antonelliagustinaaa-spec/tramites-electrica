const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const uri = process.env.MONGODB_URI;
let db;

async function conectarDB() {
    try {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
            tls: true,
            tlsAllowInvalidCertificates: true
        });

        await client.connect();
        db = client.db('tramites_electricidad');
        console.log("¡Conectado exitosamente a MongoDB Atlas!");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
    }
}

conectarDB();

app.get('/api/datos', async (req, res) => {
    try {
        if (!db) return res.json({ clientes: [], tramites: [] });
        
        const clientesCol = db.collection('clientes');
        const tramitesCol = db.collection('tramites');

        const clientes = await clientesCol.find({}).toArray();
        const tramites = await tramitesCol.find({}).toArray();

        res.json({ clientes, tramites });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

app.post('/api/datos', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: "Base de datos no conectada" });

        const { clientes, tramites } = req.body;
        const clientesCol = db.collection('clientes');
        const tramitesCol = db.collection('tramites');

        await clientesCol.deleteMany({});
        if (clientes && clientes.length > 0) {
            await clientesCol.insertMany(clientes);
        }

        await tramitesCol.deleteMany({});
        if (tramites && tramites.length > 0) {
            await tramitesCol.insertMany(tramites);
        }

        res.json({ success: true, mensaje: "Datos guardados en la nube correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar los datos" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
