#!/usr/bin/env node


const supertest = require('supertest')
const mongoose = require('mongoose');
const { User } = require('../server/modules/user/user.model');
const Client = require('../server/models/test.clients.model');
const config = require('./tests.config');
const app = require('../server/express')
const request = supertest(app)

const dropUsers = true

app.set('port', process.env.PORT || '3000');

describe('Test user APIs', () => {
    beforeAll(async () => {

        await config.mongooseInit(mongoose, config.mongoUris[config.mongoNames.user])

        if (dropUsers) {
            await User.deleteMany({});
        }

        config.test.users = await config.test.genUsersList([25], 10, 0, '0-0-0')// (ages = [], groupSize = 0, offset = 0, address = '0-0-0')

    });

    afterAll((done) => {
        mongoose.disconnect();
        server.close(done);
    });

    it('TEST loopback', async done => {

        const response =
            await request
                .get('/api/user/loopback')

        expect(response.status).toBe(200)

        done()
    })

    it('TEST secured-loopback before login', async done => {

        const response = await request.get('/api/user/secured-loopback')

        expect(response.status).toBe(401)

        done()
    })

    it('TEST signup', async () => {

        let requests;

        requests = config.test.users.map(
            user =>
                request
                    .post('/api/user')
                    .send(user.profile)
        )

        responses = await Promise.all(requests)

        responses.forEach(response => {
            expect(response.status).toBe(dropUsers ? 201 : 400)
        })

    })

    it('TEST signin', async () => {

        requests = config.test.users.map(
            user => request
                .post('/api/auth/signin')
                .send(user.profile)
        )

        responses = await Promise.all(requests)

        responses.forEach((res, idx) => {

            expect(res.body.token).toBeTruthy()
            expect(res.body.payload).toBeTruthy()
            expect(res.status).toBe(200)

            config.test.users[idx].token = res.body.token
            config.test.users[idx].payload = res.body.payload
        })
        if (dropUsers) {
            await Client.deleteMany({});
        }
        Client.insertMany(
            responses.map((res, idx) => ({
                profile: config.test.users[idx].profile,
                payload: res.body.payload,
                token: res.body.token,
            }))
        )
    })

    it('TEST secured-loopback after login', async done => {

        const response =
            await request
                .get('/api/account/secured-loopback')
                .set('Authorization', 'Bearer ' + config.test.users[0].token)

        expect(response.status).toBe(200)

        done()
    })


})