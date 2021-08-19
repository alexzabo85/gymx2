#!/usr/bin/env node

const config = require('../server/config/config');
const config = require('./test.config');
const app = require('../server/express')
app.set('port', process.env.PORT || '3000');
const User = require('../server/models/user.model');
const Account = require('../server/models/account.model');

const supertest = require('supertest')
const request = supertest(app)
const mongoose = require('mongoose');

let token;
let _userId;
let keyPairs = [
    {
        "privKey": "bd11671d20146a52aded3770836f9b26afdc7cecab7dba9e1e33a6b0ffa6f6c6",
        "pubKey": "48787fde963ca03ba758059420a3303b185374ae337c4670ca16ce9affff3c1f44910b0762bdda83061a1cc5cd72c3a17c7f056fe4daebed239e9b0bfac4a7f4",
        "address": "343045810748535c18b7be109079544d1d3c27a9789b6278ed00031c246e2528"
    },
    {
        "privKey": "694b3d2ebfe64f68cdbe92f34e6fc66dd3778691fc121f70a92c96fe180c87ef",
        "pubKey": "de0cf5b3227c9e4fa6dad20a5b8cbbb54acb04ae7b01f0c2e47df60559e66608102df68d962c2d6d06a94823d7c5f7d2091b3b83843858195bdb5aa02f13466d",
        "address": "b073dd6f6f9d2cf48d6494d6eb0b3c8e3237b478427667454245a53be41e27cd"
    }
]
let xit = () => { }
let senderKeyPair = config.test.keyPairs[0];
let receiverKeyPair = config.test.keyPairs[1];
let senderNewTx = {};
let newReceiverTx = {};

describe('Load Test - account APIs', () => {

    beforeAll(async () => {

        await config.mongooseInit(mongoose, config.mongoUri);

        await Account.deleteMany({});
        await Account.syncIndexes();



        // await mongoose.connection.db.dropDatabase();

        // await User.deleteMany({});
        // await Account.deleteMany({});

        config.test.users = await config.test.genUsersList([25,], 10, 0, '0-0-0')
        // config.test.genUsersList(2, 25, '0-0-0', 'male')
        // config.test.genUsersList(2, 30, '0-0-0', 'female')
        // config.test.genUsersList(2, 35, '0-0-0', 'male')
        // config.test.genUsersList(2, 40, '0-0-0', 'female')

    });

    afterAll((done) => {
        mongoose.disconnect();
        server.close(done);
    });

    it('TEST loopback', async () => {

    })


    xit('TEST loopback', async done => {

        const response =
            await request
                .get('/api/account/loopback')

        expect(response.status).toBe(200)

        done()
    })

    xit('TEST secured-loopback before login', async done => {

        const response = await request.get('/api/account/secured-loopback')

        expect(response.status).toBe(401)

        done()
    })

    xit('TEST signup', async done => {

        const response =
            await request
                .post('/api/user/')
                .send(config.test.users[0].profile)

        expect(response.status).toBe(201)

        done()
    })

    xit('TEST signin', async done => {

        const response =
            await request
                .post('/api/auth/signin')
                .send(config.test.users[0].profile)

        expect(response.status).toBe(200)

        config.test.users[0].token = response.body.token;
        config.test.users[0]._userId = response.body.payload._id;
        done()
    })

    xit('TEST secured-loopback after login', async done => {

        const response =
            await request
                .get('/api/account/secured-loopback')
                .set('Authorization', 'Bearer ' + config.test.users[0].token)

        expect(response.status).toBe(200)

        done()
    })

    xit('TEST generate key pair', async done => {

        const response =
            await request
                .get('/api/account/key')
                .set('Authorization', 'Bearer ' + token)

        expect(response.status).toBe(200)
        done()
    })

    xit('TEST create tx', async done => {

        const response =
            await request
                .post('/api/account/tx/' + config.test.users[0]._userId)
                .set('Authorization', 'Bearer ' + config.test.users[0].token)
                .send({
                    keyPairs:
                        [senderKeyPair, receiverKeyPair],
                    amount: 5
                })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('senderNewTx.sender', senderKeyPair.pubKey);
        expect(response.body).toHaveProperty('senderNewTx.receiver', receiverKeyPair.pubKey);
        expect(response.body).toHaveProperty('receiverNewTx.sender', senderKeyPair.pubKey);
        expect(response.body).toHaveProperty('receiverNewTx.receiver', receiverKeyPair.pubKey);
        senderNewTx = response.body.senderNewTx
        receiverNewTx = response.body.receiverNewTx

        done()
    })

    xit('TEST list tx', async done => {

        const response =
            await request
                .get('/api/account/tx/' + _userId)
                .set('Authorization', 'Bearer ' + token)

        expect(response.status).toBe(200)

        done()
    })

})