// https://blog.logrocket.com/node-js-crypto-module-a-tutorial/

const crypto = require('crypto');

const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'secp256k1' });

// Create
const sign = crypto.createSign('SHA256');
sign.write('some data to sign');
sign.end();
const signature = sign.sign(privateKey, 'hex');
console.log(
    '\nsigned: ',
    '\npublicKey: ' + publicKey)
'\nprivateKey: ' + privateKey,
    '\nsignature:' + signature,
)

const verify = crypto.createVerify('SHA256');
verify.write('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature, 'hex'));
// Prints: true


crypto.generateKeyPairSync('ec', { namedCurve: 'secp256k1' }).publicKey.export({ format: 'pem', type: 'sec1' })
