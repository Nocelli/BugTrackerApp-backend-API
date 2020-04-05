const request = require('supertest')
const app = require('../../app')
const connection = require('../../database/connection')

describe('Users', () => {
    beforeEach(async () => {
        await connection.migrate.rollback()
        await connection.migrate.latest()
    })

    afterAll(async () => {
        await connection.destroy()
    })

    it('Should be able to create a new User', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                name : "Test Dummy",
                email : "test.dummy@gmail.com",
                password : "password2020"
            })

        expect(response.body).toHaveProperty('id')
        expect(response.body.id).toHaveLength(8)
    })
})