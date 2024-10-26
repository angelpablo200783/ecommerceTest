import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

// Create an Express application
const app = express();
const PORT = 3000;

// Use cors with options to explicitly allow your frontend's origin
const corsOptions = {
  origin: 'http://localhost:5173', // Allow requests from this specific origin (replace with your frontend URL)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());


// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678Spring',
  database: 'tienda_en_linea'
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

// Define the GET endpoint to retrieve products
app.get('/api/products', cors(corsOptions), (req, res) => {
  const query = 'SELECT * FROM producto';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving products:', err);
      res.status(500).json({ message: 'Error retrieving products' });
      return;
    }
    res.status(200).json(results);
  });
});

// Define the GET endpoint to retrieve metodo_pago
app.get('/api/metodosDePago', cors(corsOptions), (req, res) => {
  const query = 'SELECT * FROM metodopago';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving metodos de pago:', err);
      res.status(500).json({ message: 'Error retrieving metodos de pago' });
      return;
    }
    res.status(200).json(results);
  });
});

// Define the GET endpoint to retrieve direccion de entrega
app.get('/api/direccionDeEntrega', cors(corsOptions), (req, res) => {
  const query = 'SELECT * FROM direccion';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving direccion:', err);
      res.status(500).json({ message: 'Error retrieving direccion' });
      return;
    }
    res.status(200).json(results);
  });
});

// Define the GET endpoint to retrieve persona
app.get('/api/persona', cors(corsOptions), (req, res) => {
  const query = 'SELECT * FROM persona';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving persona:', err);
      res.status(500).json({ message: 'Error retrieving persona' });
      return;
    }
    res.status(200).json(results);
  });
}); 

// Define the POST endpoint to create a new Pedido
app.post('/api/pedido', (req, res) => {
  console.log('Received request body:', req.body); // Add this log to see what's in the body

  const { idPedido, fechaPedido, idCliente, estadoPedido, total, idMetodoPago, idDireccionEntrega } = req.body;

  if (!idPedido || !fechaPedido || !idCliente || !estadoPedido || !total || !idMetodoPago || !idDireccionEntrega) {
    return res.status(400).json({ message: 'Missing required fields in the request body' });
  }

  // Define the SQL query using placeholders
  const query = `INSERT INTO pedido (idPedido, fechaPedido, idCliente, estadoPedido, total, idMetodoPago, idDireccionEntrega)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

  // Use prepared statements to prevent SQL injection
  db.query(query, [idPedido, fechaPedido, idCliente, estadoPedido, total, idMetodoPago, idDireccionEntrega], (err, results) => {
    if (err) {
      console.error('Error saving pedido:', err);
      res.status(500).json({ message: 'Error saving pedido' });
      return;
    }
    res.status(200).json({ message: 'Pedido created successfully' });
  });
});

// Define the GET endpoint to retrieve pedidos by cliente ID
app.get('/api/pedidosCliente', cors(corsOptions), (req, res) => {
  const { idCliente } = req.query;

  if (!idCliente) {
    return res.status(400).json({ message: 'Missing idCliente query parameter' });
  }

  // Define the SQL query to join pedidos with metodopago and direccion tables
  const query = `
    SELECT 
      pedido.idPedido,
      pedido.fechaPedido,
      pedido.estadoPedido,
      pedido.total,
      metodopago.nombre AS metodoPago,
      CONCAT(direccion.alias, ' - ', direccion.calle, ' - ', direccion.ciudad, ' - ', direccion.estado, ' - ', direccion.pais) AS direccionEntrega
    FROM 
      pedido
    JOIN metodopago ON pedido.idMetodoPago = metodopago.idMetodoPago
    JOIN direccion ON pedido.idDireccionEntrega = direccion.idDireccion
    WHERE 
      pedido.idCliente = ?
  `;

  db.query(query, [idCliente], (err, results) => {
    if (err) {
      console.error('Error retrieving pedidos:', err);
      res.status(500).json({ message: 'Error retrieving pedidos' });
      return;
    }

    res.status(200).json(results);
  });
});

// Define the GET endpoint to retrieve pedidos by cliente ID
app.get('/api/todosLosPedidos', cors(corsOptions), (req, res) => { 

   const query = `
    SELECT 
      pedido.idCliente,
      pedido.idPedido,
      pedido.fechaPedido,
      pedido.estadoPedido,
      pedido.total,
      metodopago.nombre AS metodoPago,
      CONCAT(direccion.alias, ' - ', direccion.calle, ' - ', direccion.ciudad, ' - ', direccion.estado, ' - ', direccion.pais) AS direccionEntrega
    FROM 
      pedido
    JOIN metodopago ON pedido.idMetodoPago = metodopago.idMetodoPago
    JOIN direccion ON pedido.idDireccionEntrega = direccion.idDireccion;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving pedidos:', err);
      res.status(500).json({ message: 'Error retrieving pedidos' });
      return;
    }

    res.status(200).json(results);
  });
});

// Define the PUT endpoint to update the estadoPedido
app.put('/api/actualizarEstadoPedido', cors(corsOptions), (req, res) => {
  const { idPedido, estadoPedido } = req.body;

  if (!idPedido || !estadoPedido) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const query = 'UPDATE pedido SET estadoPedido = ? WHERE idPedido = ?';

  db.query(query, [estadoPedido, idPedido], (err, results) => {
    if (err) {
      console.error('Error updating pedido:', err);
      res.status(500).json({ message: 'Error updating pedido' });
      return;
    }

    res.status(200).json({ message: 'Pedido updated successfully' });
  });
});

// Define the POST endpoint to create a new Devolucion
app.post('/api/devolucion', (req, res) => {
  const { idPedido, idCliente, fechaSolicitud, estadoDevolucion } = req.body;

  // Generate a random ID for idDevolucion if not provided
  const idDevolucion = req.body.idDevolucion || Math.floor(Math.random() * 1000000);

  if (!idPedido || !idCliente || !fechaSolicitud || !estadoDevolucion) {
    return res.status(400).json({ message: 'Missing required fields in the request body' });
  }

  // Define the SQL query using placeholders
  const query = `INSERT INTO devolucion (idDevolucion, idPedido, idCliente, fechaSolicitud, estadoDevolucion)
                 VALUES (?, ?, ?, ?, ?)`;

  // Use prepared statements to prevent SQL injection
  db.query(query, [idDevolucion, idPedido, idCliente, fechaSolicitud, estadoDevolucion], (err, results) => {
    if (err) {
      console.error('Error saving devolucion:', err);
      res.status(500).json({ message: 'Error saving devolucion' });
      return;
    }
    res.status(200).json({ message: 'Devolucion created successfully', idDevolucion });
  });
});

// Define the GET endpoint to retrieve devoluciones by idCliente
app.get('/api/devolucionesCliente', (req, res) => {
  const { idCliente } = req.query;

  if (!idCliente) {
    return res.status(400).json({ message: 'Missing idCliente query parameter' });
  }

  const query = 'SELECT * FROM devolucion WHERE idCliente = ?';

  db.query(query, [idCliente], (err, results) => {
    if (err) {
      console.error('Error retrieving devoluciones:', err);
      return res.status(500).json({ message: 'Error retrieving devoluciones' });
    }

    res.status(200).json(results);
  });
});

// Endpoint para obtener todas las devoluciones
app.get('/api/todasLasDevoluciones', async (req, res) => {
  try {
      const [rows] = await pool.query('SELECT * FROM devoluciones');
      res.json(rows);
  } catch (error) {
      console.error('Error obteniendo devoluciones:', error);
      res.status(500).json({ message: 'Error obteniendo devoluciones' });
  }
});

// Endpoint para actualizar el estado de una devolución
app.put('/api/actualizarEstadoDevolucion', async (req, res) => {
  const { idDevolucion, estadoDevolucion } = req.body;

  if (!idDevolucion || !estadoDevolucion) {
      return res.status(400).json({ message: 'Datos incompletos' });
  }

  try {
      const query = 'UPDATE devoluciones SET estadoDevolucion = ? WHERE idDevolucion = ?';
      const values = [estadoDevolucion, idDevolucion];
      const [result] = await pool.query(query, values);

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Devolución no encontrada' });
      }

      res.json({ message: 'Estado de devolución actualizado correctamente' });
  } catch (error) {
      console.error('Error actualizando estado de devolución:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
