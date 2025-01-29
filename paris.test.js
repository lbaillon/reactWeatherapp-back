// test pour vérifier l'affichage de la météo de Paris au lancement de l'application

const request = require('supertest');
const app = require('./app');
const mongoose = require('mongoose')

it ('GET /paris', async () => {
    const res = await request(app).get('/paris')

    expect(res.statusCode).toBe(200)
    expect(res.body.cityName).toEqual('Paris')
})

afterAll(async () => {
    await mongoose.connection.close()
})