#!/usr/bin/env node

const mongoose = require('mongoose');
const supertest = require('supertest')
const config = require('../server/config/config');
const configTest = require('./test.config');
const User = require('../server/models/user.model');
const app = require('../server/express')

// var super7agent = require('superagent');
// let agent = superagent.agent();

const request = supertest(app)
app.set('port', process.env.PORT || '3000');

const USERS = (5) * 2;

describe('Test product APIs', () => {

    // let user = {};
    let _productId = '';
    let users = new Array(USERS)

    beforeAll(async (done) => {

        await config.mongooseInit(mongoose, config.mongoUri);

        // await User.deleteMany({});

        await mongoose.connection.db.dropDatabase();


        configTest.genUsersList(USERS / 2, 36, '0-0-0', 'male')
        configTest.genUsersList(USERS / 2, 34, '0-0-0', 'female')


        // test('TEST signup all', async done => {

        configTest.users.forEach((user, idx) => {
            request
                .post('/api/user')
                .send(user.profile)
                .then(response => {

                    expect(response.status).toBe(201)
                    expect(response.body).toHaveProperty('message', 'Successfully signed up!');


                });
        })

        configTest.users.forEach((user, idx) => {
            request
                .post('/api/auth/signin')
                .send(user.profile)
                .then(response => {

                    expect(response.statusCode).toBe(200);
                    expect(response.status).toBe(200)
                    expect(response.body).toHaveProperty('token');
                    expect(response.body).toHaveProperty('payload._id');
                    user.token = response.body.token
                    user._userId = response.body._userId

                    users[idx] = {
                        profile: user.profile,
                        token: response.body.token,
                        _userId: response.body._userId
                    }

                });
        })

        expect(configTest.users.length).toBe(USERS);

        done()

    });

    afterAll((done) => {
        mongoose.disconnect();
        server.close(done);
        done()
    });



    test('TEST finally-catch-all handler', async done => {

        const response =
            await request
                .get('/test')

        expect(response.status).toBe(200)

        expect(response.body.status).toBe('*')

        done()
    })

    test('TEST loopback', async done => {

        const response =
            await request.get('/api/product/loopback')

        expect(response.status).toBe(200)

        done()
    })

    test('TEST deny secured-loopback before login', async done => {

        const response =
            await request.get('/api/product/secured-loopback')

        expect(response.status).toBe(401)

        done()
    })

    test('new product', async done => {

        const response =
            await request
                .post('/api/product/')
                .set('Authorization', 'Bearer ' + users[0].token)
                .send(configTest.newProduct)

        expect(response.body).toHaveProperty('_id');
        expect(response.status).toBe(201)

        _productId = response.body._id

        done()
    })

    test('Vote ALL', async () => {
        expect(users.length).toBeGreaterThan(0)
        users.forEach((user, idx) => {
            request
                .post(`/api/product/${_productId}`)
                .set('Authorization', 'Bearer ' + user.token)
                .send(configTest.newVote)
                .then(response => {

                    expect(response.status).toBe(201)
                    expect(response.body.status).toBe('Accepted')

                });
        })
    })

    // test('new vote', async done => {

    //     const response =
    //         await request
    //             .post(`/api/product/${_productId}`)
    //             .set('Authorization', 'Bearer ' + user.token)
    //             .send(configTest.newVote)

    //     expect(response.status).toBe(201)
    //     expect(response.body.status).toBe('Accepted')
    //     // console.log(response.body)
    //     done()
    // })

    test('Deny existing ALL voter', async () => {

        // const response =
        //     await request
        //         .post(`/api/product/${_productId}`)
        //         .set('Authorization', 'Bearer ' + users[0].token)
        //         .send(configTest.newVote)

        // expect(response.status).toBe(401)
        // expect(response.body.status).toBe('Failed')

        // done()

        expect(users.length).toBeGreaterThan(0)
        users.forEach((user, idx) => {
            request
                .post(`/api/product/${_productId}`)
                .set('Authorization', 'Bearer ' + users[0].token)
                .send(configTest.newVote)
                .then(response => {

                    expect(response.status).toBe(401)
                    expect(response.body.status).toBe('Failed')

                });
        })

    })

    //-----------------------------------------------------------
    // test('***prepare*** user_1', async done => {

    //     user = configTest.users[1]

    //     expect(user).toHaveProperty('profile');
    //     expect(user).toHaveProperty('token');
    //     expect(user).toHaveProperty('_userId');

    //     done()

    // })

    // test('signup and signin', async () => {

    //     let response =
    //         await request
    //             .post('/api/user')
    //             .send(user.profile)

    //     expect(response.status).toBe(201)

    //     response =
    //         await request
    //             .post('/api/auth/signin')
    //             .send(user.profile)

    //     expect(response.body).toHaveProperty('token');
    //     expect(response.body).toHaveProperty('payload._id');
    //     expect(response.status).toBe(200)

    //     user.token = response.body.token;
    //     user._userId = response.body.payload._id;

    // })

    // test('new vote', async done => {

    //     const response =
    //         await request
    //             .post(`/api/product/${_productId}`)
    //             .set('Authorization', 'Bearer ' + user.token)
    //             .send(configTest.newVote)

    //     expect(response.status).toBe(201)
    //     expect(response.body.status).toBe('Accepted')
    //     // console.log(response.body)
    //     done()
    // })

    // test('Deny existing voter', async done => {

    //     const response =
    //         await request
    //             .post(`/api/product/${_productId}`)
    //             .set('Authorization', 'Bearer ' + user.token)
    //             .send(configTest.newVote)

    //     expect(response.status).toBe(401)
    //     expect(response.body.status).toBe('Failed')

    //     done()
    // })

    //-----------------------------------------------------------

    // test('signup all', async done => {

    //     configTest.users.forEach((user) => {
    //         request
    //             .post('/api/user')
    //             .send(user.profile)
    //             .then(response => {

    //                 expect(response.status).toBe(201)
    //                 expect(response.body).toHaveProperty('message', 'Successfully signed up!');

    //             });
    //     })

    //     done()

    // })

    // test('TEST signin ALL', async done => {

    //     configTest.users.forEach((user) => {
    //         request
    //             .post('/api/auth/signin')
    //             .send(user.profile)
    //             .then(response => {

    //                 expect(response.statusCode).toBe(200);
    //                 expect(response.status).toBe(200)
    //                 expect(response.body).toHaveProperty('token');
    //                 expect(response.body).toHaveProperty('payload._id');
    //                 user.token = response.body.token
    //                 user._userId = response.body._userId

    //             });
    //     })

    //     done()

    // })

    // test('print users', done => {


    //     console.log(configTest.users)

    //     done()

    // })

})