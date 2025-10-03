import request from 'supertest';
import app from '../app.js';
import { Producto } from '../models/index.js';

describe('Producto CRUD', () => {
  let testProductId;

  beforeEach(async () => {
    await Producto.destroy({ where: {} });
  });

  afterAll(async () => {
    await Producto.destroy({ where: {} });
  });

  describe('POST /api/productos', () => {
    it('should create a new product', async () => {
      const productData = {
        nombre: 'Producto Test',
        descripcion: 'Descripción del producto test',
        precio: 99.99,
        cantidadDisponible: 10,
        enStock: true,
        imagen: 'data:image/jpeg;base64,test'
      };

      const response = await request(app)
        .post('/api/productos')
        .send(productData)
        .expect(201);

      expect(response.body).toHaveProperty('idProducto');
      expect(response.body.nombre).toBe(productData.nombre);
      expect(response.body.precio).toBe(productData.precio);
      
      testProductId = response.body.idProducto;
    });

    it('should return 400 for invalid product data', async () => {
      const invalidData = {
        nombre: '',
        precio: -10
      };

      const response = await request(app)
        .post('/api/productos')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/productos', () => {
    beforeEach(async () => {
      const product = await Producto.create({
        nombre: 'Producto Test GET',
        descripcion: 'Descripción test',
        precio: 50.00,
        cantidadDisponible: 5,
        enStock: true
      });
      testProductId = product.idProducto;
    });

    it('should get all products', async () => {
      const response = await request(app)
        .get('/api/productos')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/productos/:id', () => {
    beforeEach(async () => {
      const product = await Producto.create({
        nombre: 'Producto Test GET BY ID',
        descripcion: 'Descripción test',
        precio: 75.00,
        cantidadDisponible: 3,
        enStock: true
      });
      testProductId = product.idProducto;
    });

    it('should get product by id', async () => {
      const response = await request(app)
        .get(`/api/productos/${testProductId}`)
        .expect(200);

      expect(response.body.idProducto).toBe(testProductId);
      expect(response.body.nombre).toBe('Producto Test GET BY ID');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/productos/99999')
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });
});