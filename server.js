const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

// Puerto dinámico para la nube o 3000 para tu PC
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DB_FILE = './database.json';

function leerDB() {
    if (!fs.existsSync(DB_FILE)) {
        return { clientes: [], tramites: [] };
    }
    const data = fs.readFileSync(DB_FILE);
    return JSON.parse(data);
}

function escribirDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/datos', (req, res) => {
    const db = leerDB();
    res.json(db);
});

app.post('/api/datos', (req, res) => {
    const { clientes, tramites } = req.body;
    escribirDB({ clientes, tramites });
    res.json({ success: true, message: 'Datos guardados correctamente' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
