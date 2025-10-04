import request from 'supertest';
import app from '../app.js';

describe('Producto CRUD', () => {
  let id;

  it('should create a product', async () => {
    const res = await request(app).post('/api/productos').send({
      nombre: 'Demo',
      descripcion: 'Demo producto',
      precio: 10,
      cantidadDisponible: 1,
      enStock: true,
      imagen: '',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('idProducto');
    id = res.body.idProducto;
  });

  it('should get all products', async () => {
    const res = await request(app).get('/api/productos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get product by id', async () => {
    const res = await request(app).get(`/api/productos/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('idProducto', id);
  });

  it('should delete product', async () => {
    const res = await request(app).delete(`/api/productos/${id}`);
    expect(res.statusCode).toBe(200);
  }); 
});
