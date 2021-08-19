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

describe('Test product APIs', () => {

    let user;
    let _productId;

    beforeAll(async () => {

        await config.mongooseInit(mongoose, config.mongoUri);

        // await User.deleteMany({});

        await mongoose.connection.db.dropDatabase();



        // configTest.genUsersList(3, 32, '0-0-0', 'male')
        // configTest.genUsersList(3, 33, '0-0-0', 'female')
        // configTest.genUsersList(3, 34, '0-0-0', 'male')
        // configTest.genUsersList(3, 35, '0-0-0', 'female')

        // configTest.users.forEach((user) => {
        //     request
        //         .post('/api/user')
        //         .send(user.profile)
        //         .send(user.profile)
        //         .then(response => {

        //             expect(response.status).toBe(201)
        //             expect(response.body).toHaveProperty('message', 'Successfully signed up!');


        //         });
        // })

        // configTest.users.forEach((user, idx) => {
        //     request
        //         .post('/api/auth/signin')
        //         .send(user.profile)
        //         .then(response => {

        //             expect(response.statusCode).toBe(200);
        //             expect(response.status).toBe(200)
        //             expect(response.body).toHaveProperty('token');
        //             expect(response.body).toHaveProperty('payload._id');

        //             user.token = response.body.token
        //             user._userId = response.body._userId

        //             // console.log(configTest.users[idx])

        //         });
        // })


    });

    afterAll((done) => {
        mongoose.disconnect();
        server.close(done);
    });

    it('TEST finally-catch-all handler', async done => {

        const response =
            await request
                .get('/test')

        expect(response.status).toBe(200)

        expect(response.body.status).toBe('*')

        done()
    })

    it('TEST loopback', async done => {

        const response =
            await request.get('/api/product/loopback')

        expect(response.status).toBe(200)

        done()
    })

    it('TEST deny secured-loopback before login', async done => {

        const response =
            await request.get('/api/product/secured-loopback')

        expect(response.status).toBe(401)

        done()
    })

    it('TEST Generate Users List', async done => {

        configTest.genUsersList(3, 32, '0-0-0', 'male')
        configTest.genUsersList(3, 33, '0-0-0', 'female')
        configTest.genUsersList(3, 34, '0-0-0', 'male')
        configTest.genUsersList(3, 35, '0-0-0', 'female')

        // console.log('generated: ', configTest.users)

        done()

    })

    it('TEST signup and signin all', async done => {

        await Promise.all(configTest.users.forEach((user) =>
            request
                .post('/api/user')
                .send(user.profile)
                .then(response => {

                    expect(response.status).toBe(201)
                    expect(response.body).toHaveProperty('message', 'Successfully signed up!');


                })
        ))


        await Promise.all(configTest.users.forEach((user) =>
            request
                .post('/api/auth/signin')
                .send(user.profile)
                .then(response => {

                    expect(response.status).toBe(201)
                    expect(response.body).toHaveProperty('message', 'Successfully signed up!');


                })
        ))

        done()

    });

    // })

    it('TEST signin ALL', async done => {

        const a = configTest.users.forEach((user) =>
            request
                .post('/api/auth/signin')
                .send(user.profile)
                .then(response => {

                    expect(response.status).toBe(201)
                    expect(response.body).toHaveProperty('message', 'Successfully signed up!');


                })
        )
        Promise.all(a).then((values) => {
            done()
        });

        // configTest.users.forEach((user, idx) => {
        //     request
        //         .post('/api/auth/signin')
        //         .send(user.profile)
        //         .then(response => {

        //             expect(response.statusCode).toBe(200);
        //             expect(response.status).toBe(200)
        //             expect(response.body).toHaveProperty('token');
        //             expect(response.body).toHaveProperty('payload._id');

        //             user.token = response.body.token
        //             user._userId = response.body._userId

        //             // console.log(configTest.users[idx])

        //         });
        // })

        // done()

    })

    it('TEST create new product', async done => {

        const response =
            await request
                .post(`/api/product`)
                .set('Authorization', 'Bearer ' + configTest.users[0].token)
                .send(configTest.newProduct)

        // switch (response.status) {
        //     case 201:
        //         expect(response.status).toBe(201)

        //         break;
        //     default:
        //         expect(response.body).toHaveProperty('error', '');

        // }

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('_id');
        _productId = response.body._id


        done()
    })

    it('TEST create new vote', async done => {

        const response =
            await request
                .post(`/api/product/${_productId}`)
                .set('Authorization', 'Bearer ' + configTest.users[0].token)
                .send(configTest.newVote)

        expect(response.status).toBe(201)
        expect(response.body.status).toBe('Accepted')
        // console.log(response.body)
        done()
    })

    it('TEST vote ALL', done => {

        configTest.users.forEach((user, idx) => {
            request
                .post(`/api/product/${_productId}`)
                .set('Authorization', 'Bearer ' + configTest.users[0].token)
                .send(configTest.newVote)
                .then(response => {

                    expect(response.statusCode).toBe(200);
                    expect(response.status).toBe(200)
                    expect(response.body).toHaveProperty('token');
                    expect(response.body).toHaveProperty('payload._id');

                    user.token = response.body.token
                    user._userId = response.body._userId

                    console.log(configTest.users[idx])

                });
        })

        done()

    })




    it('prepare user_1', async done => {

        user = configTest.users[0]

        expect(user).toHaveProperty('profile');
        expect(user).toHaveProperty('token');
        expect(user).toHaveProperty('_userId');

        done()

    })


    it('TEST create new product', async done => {

        const response =
            await request
                .post('/api/product')
                .set('Authorization', 'Bearer ' + user.token)
                .send(configTest.newProduct)

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('_id');

        _productId = response.body._id

        done()
    })

    it('TEST create new vote', async done => {

        const response =
            await request
                .post(`/api/product/${_productId}`)
                .set('Authorization', 'Bearer ' + user.token)
                .send(configTest.newVote)

        expect(response.status).toBe(201)
        expect(response.body.status).toBe('Accepted')
        // console.log(response.body)
        done()
    })

    it('TEST Deny vote from existing voter', async done => {

        const response =
            await request
                .post(`/api/product/${_productId}`)
                .set('Authorization', 'Bearer ' + user.token)
                .send(configTest.newVote)

        expect(response.status).toBe(401)
        expect(response.body.status).toBe('Failed')

        done()
    })

    it('TEST create new vote', async done => {

        const response =
            await request
                .post(`/api/product/${_productId}`)
                .set('Authorization', 'Bearer ' + user.token)
                .send(configTest.newVote)

        expect(response.status).toBe(201)
        expect(response.body.status).toBe('Accepted')
        // console.log(response.body)
        done()
    })

    it('print users', async done => {

        console.log(configTest.users)

        done()

    })
})

    // it('TEST signup', async done => {

    //     // console.log(user)

    //     const response =
    //         await request
    //             .post('/api/user')
    //             .send(user.profile)

    //     expect(response.status).toBe(201)
    //     expect(response.body).toHaveProperty('message', 'Successfully signed up!');

    //     done()
    // })

    // it('TEST signin', async done => {


    //     const response =
    //         await request
    //             .post('/api/auth/signin')
    //             .send(user.profile)

    //     expect(response.status).toBe(200)
    //     expect(response.body).toHaveProperty('token');
    //     expect(response.body).toHaveProperty('payload._id');

    //     // loggedAgent = agent.saveCookies(response)
    //     // console.log(loggedAgent)

    //     user.token = response.body.token;
    //     user._userId = response.body.payload._id;

    //     // console.log(user)

    //     done()


    // })

    // it('TEST signup', async done => {

    //     // console.log(user)

    //     const response =
    //         await request
    //             .post('/api/user')
    //             .send(user.profile)

    //     expect(response.status).toBe(201)
    //     expect(response.body).toHaveProperty('message', 'Successfully signed up!');

    //     done()
    // })

    // it('TEST signin', async done => {

    //     const response =
    //         await request
    //             .post('/api/auth/signin')
    //             .send(user.profile)

    //     expect(response.status).toBe(200)
    //     expect(response.body).toHaveProperty('token');
    //     expect(response.body).toHaveProperty('payload._id');

    //     user.token = response.body.token;
    //     user._userId = response.body.payload._id;

    //     // console.log(user)

    //     done()


    // })

    // it('TEST create new vote', async done => {

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

    // it('TEST Deny vote from existing voter', async done => {

    //     const response =
    //         await request
    //             .post(`/api/product/${_productId}`)
    //             .set('Authorization', 'Bearer ' + user.token)
    //             .send(configTest.newVote)

    //     expect(response.status).toBe(401)
    //     expect(response.body.status).toBe('Failed')
    //     // expect(response.body.payload).toMatch(/$Vote denied. /)

    //     done()
    // })

    // it('TEST print all users ???', async done => {

    //     console.log('final: '/*, configTest.users*/)
    //     // expect(configTest.users[0]).toBe('Failed')
    //     expect(configTest.users[0]).toHaveProperty('token');
    //     expect(configTest.users[0].token).toMatch(/^[-A-Za-z0-9_+/=.]{3,}$/);

    //     done()
    // })



