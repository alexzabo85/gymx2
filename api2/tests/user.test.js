#!/usr/bin/env node

// const config = require('../server/config/config');
const config = require('./tests.config');
const app = require('../server/express')
app.set('port', process.env.PORT || '3000');

const supertest = require('supertest')
const request = supertest(app)
const mongoose = require('mongoose');
const { User } = require('../server/modules/user/user.model');


let token;
let _accountId;

describe('Test user APIs', () => {
    beforeAll(async () => {

        await config.mongooseInit(mongoose, config.mongoUri)

        await User.deleteMany({});

        config.test.users = await config.test.genUsersList([25,], 10, 0, '0-0-0')


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

    it('TEST signup', async done => {

        const response =
            await request
                .post('/api/user/')
                .send(config.test.users[0].profile)

        expect(response.status).toBe(201)

        token = response.body.token

        done()
    })

    it('TEST signin', async done => {

        const response =
            await request
                .post('/api/auth/signin')
                .send(config.test.users[0].profile)

        expect(response.status).toBe(200)

        config.test.users[0].token = response.body.token

        done()
    })


    it('TEST secured-loopback after login', async done => {

        const response =
            await request
                .get('/api/user/secured-loopback')
                .set('Authorization', 'Bearer ' + config.test.users[0].token)

        expect(response.status).toBe(200)

        done()
    })


})