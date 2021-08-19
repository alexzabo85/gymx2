const crypto = require('crypto');

const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'secp256k1'
});

console.log(privateKey.export({ format: 'pem', type: 'sec1' }))
console.log(publicKey.export({ format: 'pem', type: 'spki' }))

const sign = crypto.createSign('SHA256');
sign.update('some data to sign');
sign.end();
const signature = sign.sign(privateKey);

const verify = crypto.createVerify('SHA256');
verify.update('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature));
// Prints: true