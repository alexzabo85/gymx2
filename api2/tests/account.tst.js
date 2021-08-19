#!/usr/bin/env node

const mongoose = require('mongoose');
const supertest = require('supertest')
const config = require('./tests.config');
const app = require('../server/express')
const { Account, TxSchema } = require('../server/modules/account/account.model');
const Clients = require('../server/models/test.clients.model');
var txLib = require('../server/helpers/tx.lib');

// var super7agent = require('superagent');
// let agent = superagent.agent();

const request = supertest(app)
app.set('port', process.env.PORT || '3000');

let uniqueIndex = 0

const getUnique = () => txLib.hash(`${++uniqueIndex}`)

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
    let requests;
    let responses;

    await config.mongooseInit(mongoose, config.mongoUri);

    const clients = await Clients.find().lean()

    // await Account.deleteMany({});
    await Account.syncIndexes();



    console.log('*************************')
    console.log('clients.length: ' + clients.length)

    console.log('*************************')
    console.log('generate Balance:')

    const body = {
        "amount": 0,
        "keyPairs": config.test.keyPairs
    }

    body.amount = 49;  // initialize balance for test

    const SenderQ = mongoose.model(`Q_${txLib.getAddressFromPubKey(body.keyPairs[0].pubKey)}`, TxSchema)
    // await SenderQ.deleteMany({});

    const newSenderAccount =
        await request
            .post(`/api/account/tx/init`)
            .set('Authorization', 'Bearer ' + clients[0].token)

            .send(body)
    // TODO: verify newSenderAccount

    console.log('*************************')
    console.log('try to tx many:')


    // console.log(hrTime[0] * 1000000 + hrTime[1] / 1000)

    let tx = {};

    let genTx = () => {

        tx = {
            receiver: config.test.keyPairs[1].pubKey,
            amount: 0,
            // date: `--`, //`${new Date}`,
            // random: getUnique(),
            data: 'hello world'
        }


        tx.amount = 1 // coins to send

        tx.txString = JSON.stringify(tx)
        tx.txHash = txLib.hash(tx.txString);
        tx.txSign = txLib.sign(tx.txHash, config.test.keyPairs[0].privKey);
        // tx.random = Math.random() * 10000000

        return tx
    }



    // console.log('tx: ', tx)


    const txsTotalCount = 6;

    const txsPacketSize = 3;

    let accept = 0;
    let start = new Date()

    for (let i = 0; i < (txsTotalCount / txsPacketSize); i++) {


        const requests = [];

        for (let j = 0; j < txsPacketSize; j++)

            requests.push(
                request
                    .post(`/api/account/tx`)
                    .set('Authorization', 'Bearer ' + clients[0].token)
                    .send({ tx: genTx() })
            )

        const responses = await Promise.all(requests)


        responses.forEach((response, idx) => {

            if (response.status === 201) {  // or  if(response.body.status === 'Accepted') {
                accept++;
            }
            console.log(`response.body: ${JSON.stringify(response.body)}`)
        })

    }

    let end = new Date() - start;

    console.log(`time: ${end}, accepted Tx: ${accept}/${''}, Packet size: ${txsPacketSize}, `)

}

main()
    .then(() => process.exit())
    .catch((err) => { console.error(err); process.exit(); });

