// https://asecuritysite.com/encryption/js_ecdsa

const { createPrivateKeySync, ecdsaSign } = require("ethereum-cryptography/secp256k1");

const msgHash = Buffer.from(
    "82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28",
    "hex"
);

const privateKey = createPrivateKeySync();

console.log('Buffer.from(ecdsaSign(msgHash, privateKey).signature).toString("hex")');
console.log(Buffer.from(ecdsaSign(msgHash, privateKey).signature).toString("hex"));



const { getRandomBytesSync } = require("ethereum-cryptography/random");

console.log('getRandomBytesSync(32).toString("hex")');
console.log(getRandomBytesSync(32).toString("hex"));