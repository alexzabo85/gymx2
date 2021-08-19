#!/usr/bin/env node

const mongoose = require('mongoose');
const supertest = require('supertest')
// const config = require('../server/config/config');
const config = require('./tests.config');
const Client = require('../server/models/test.clients.model');
const Product = require('../server/modules/product/product.model');
const app = require('../server/express')

// var super7agent = require('superagent');
// let agent = superagent.agent();

const request = supertest(app)
app.set('port', process.env.PORT || '3000');

const _USERS_ = (10) * 2
let user = {};
let _productId = '';
let requests;
let response;
let responses;

/**
 * 
 * clear db
 * generate users list 
 * signup users list 
 * signin users and store token list 
 * create product 
 * vote for all users and save results 
 * 
 */

async function main() {

    // await config.mongooseInit(mongoose, config.mongoUris[config.mongoNames]);
    await config.mongooseInit(mongoose, config.mongoUris[config.mongoNames.product])

    // await Product.deleteMany({});

    // await mongoose.connection.db.dropDatabase();

    // clients = await config.test.genUsersList([25,], 10, 0, '0-0-0')


    const clients = await Client.find({}).lean()



    config.test.product.filters = [
        await config.test.buildFilterAGL(4, config.genderTypes.male, [20, 29], '0-0-0', 'any', 'any'),
        await config.test.buildFilterAGL(4, config.genderTypes.male, [20, 29], '0-0-0', 'any', 'any'),
        // await config.test.buildFilterAGL(4, config.genderTypes.female, [20, 29], '0-0-0'),
        // await config.test.buildFilterAGL(4, config.genderTypes.male, [30, 39], '0-0-0'),
        // await config.test.buildFilterAGL(4, config.genderTypes.female, [30, 39], '0-0-0'),
    ]


    try {
        //-------------------------------------------- load product
        console.log('*************************')
        response = await request
            .get('/api/product/')
            .set('Authorization', 'Bearer ' + clients[0].token)

        if (response.status !== 200) {
            console.log(`Error creating new product ${response.status}` + JSON.stringify(response.body));
            process.exit();
        }

        const products = [...response.body]
        _productId = products[0]._id
    } catch (err) {
        //-------------------------------------------- create product
        console.log('*************************')
        response = await request
            .post('/api/product/')
            .set('Authorization', 'Bearer ' + clients[0].token)
            .send(config.test.product)

        if (response.status !== 201) {
            console.log(`Error creating new product ${response.status}` + JSON.stringify(response.body));
            process.exit();
        }

        _productId = response.body._id

    }

    // console.log(products)

    //-------------------------------------------- vote many
    let start = new Date()

    requests = clients.map(
        user => request
            .post(`/api/product/${_productId}`)
            .set('Authorization', 'Bearer ' + user.token)
            .send(config.test.newVote)
    )

    responses = await Promise.all(requests).catch(err => { console.log(err) })

    let accept = 0

    responses.forEach(res => {
        if (res.status === 201) {
            ++accept;
        }
        // throw (new Error('\nresponse.status !== 201\n', response));
    })

    let end = new Date() - start;


    console.log('***********: ')
    console.log(`time: ${end}ms, accepted Tx: ${accept}/${responses.length}, `)
    console.log('***********: ')


    // process.exit(1)
    // });

}

main()
    .then(() => process.exit())
    .catch((err) => { console.error(err); process.exit(); });

