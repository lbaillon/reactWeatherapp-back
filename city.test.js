const request = require('supertest')
const app = require('./app')


global.fetch = jest.fn()

describe('GET/:city', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it ("should return weather", async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        name: "Paris",
        weather: [{main: "Clear", description: "clear sky" }],
        main: { temp_min: 10, temp_max: 20 }
      })
    })

    const res = await request(app).get("/Paris")

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({
      cityName: "Paris",
      main: "Clear",
      description: "clear sky",
      tempMin: 10,
      tempMax: 20
    })
  })

  it("should return 404 city not found", async () => {
    fetch.mockResolvedValueOnce(new Error("City not found"))
    const res = await request(app).get("/UnknownCity")

    expect(res.statusCode).toBe(404)
    expect(res.body).toEqual({reason: "City not found"})
  })
})