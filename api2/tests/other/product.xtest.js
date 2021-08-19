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

const _USERS_ = (10) * 2

configTest.genUsersList(2, 34, '0-0-0', 'male')
configTest.genUsersList(2, 34, '0-0-0', 'female')


for (i = 0; i < 1; i++) {
    describe('Test product APIs', () => {

        let user = {};
        let _productId = '';

        beforeAll(async () => {

            await config.mongooseInit(mongoose, config.mongoUri);

            // await User.deleteMany({});

            await mongoose.connection.db.dropDatabase();

            // it('new product', async done => {

            // const response = await
            //     request
            //         .post('/api/product/')
            //         .set('Authorization', 'Bearer ' + user.token)
            //         .send(configTest.newProduct)

            // console.log(response.body)
            // expect(response.status).toBe(201)
            // expect(response.body).toHaveProperty('_id');

            // _productId = response.body._id

            // done()
            // it('signup', async done => {
            user.profile = configTest.users[i].profile

            expect(user).toHaveProperty('profile');

            let response =
                await request
                    .post('/api/user')
                    .send(user.profile)

            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty('message', 'Successfully signed up!');

            // done()
            // })

            // it('signin', async () => {


            response =
                await request
                    .post('/api/auth/signin')
                    .send(user.profile)

            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('payload._id');

            user.token = response.body.token;
            user._userId = response.body.payload._id;

            // done()

            // if (!i) {
            response =
                await request
                    .post('/api/product/')
                    .set('Authorization', 'Bearer ' + user.token)
                    .send(configTest.newProduct)

            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty('_id');

            _productId = response.body._id
            // }

            console.log('user: ' + user)
            console.log('i: ' + i)
            console.log('_productId: ' + _productId)
            // console.log()



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

        // it('***prepare*** user_0', async done => {

        //     user.profile = configTest.users[i].profile

        //     expect(user).toHaveProperty('profile');
        //     // expect(user).toHaveProperty('token');
        //     // expect(user).toHaveProperty('_userId');

        //     done()

        // })

        // it('signup', async done => {

        //     const response =
        //         await request
        //             .post('/api/user')
        //             .send(user.profile)

        //     expect(response.status).toBe(201)
        //     expect(response.body).toHaveProperty('message', 'Successfully signed up!');

        //     done()
        // })

        // it('signin', async () => {


        //     const response =
        //         await request
        //             .post('/api/auth/signin')
        //             .send(user.profile)

        //     expect(response.status).toBe(200)
        //     expect(response.body).toHaveProperty('token');
        //     expect(response.body).toHaveProperty('payload._id');

        //     user.token = response.body.token;
        //     user._userId = response.body.payload._id;

        //     // done()


        // })

        it('new product', async () => {
            // if (!i) {
            //     const response =
            //         await request
            //             .post('/api/product/')
            //             .set('Authorization', 'Bearer ' + user.token)
            //             .send(configTest.newProduct)

            //     expect(response.status).toBe(201)
            //     expect(response.body).toHaveProperty('_id');

            //     _productId = response.body._id

            //     console.log('_productId: ' + _productId)
            // }
            // done()
        })

        it('new vote', async done => {

            const response =
                await request
                    .post(`/api/product/${_productId}`)
                    .set('Authorization', 'Bearer ' + user.token)
                    .send(configTest.newVote)

            expect(response.body.payload).toBe('')
            expect(response.body.status).toBe('Accepted')
            expect(response.status).toBe(201)

            done()
        })

        it('Deny existing voter', async done => {

            const response =
                await request
                    .post(`/api/product/${_productId}`)
                    .set('Authorization', 'Bearer ' + user.token)
                    .send(configTest.newVote)

            expect(response.status).toBe(401)
            expect(response.body.status).toBe('Failed')

            done()
        })

        //-----------------------------------------------------------


        //-----------------------------------------------------------


    })
}













// it('TEST signup all', async done => {

//     configTest.users.forEach((user) => {
//         request
//             .post('/api/user')
//             .send(user.profile)
//             .send(user.profile)
//             .then(response => {

//                 expect(response.status).toBe(201)
//                 expect(response.body).toHaveProperty('message', 'Successfully signed up!');

//             });
//     })

//     done()

// })

// it('TEST signin ALL', async done => {

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

// it('print users', done => {


//     // console.log(configTest.users)

//     done()

// })
