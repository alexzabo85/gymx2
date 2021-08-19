
// Asynchronous
const crypto = require('crypto');


const random = (bytes) => {
    return new Promise((resolve) => {
        crypto.randomBytes(bytes, (err, buf) => {
            if (err) throw err;
            resolve(buf);
        });

    })

}


random(6).then(buf => {
    console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
})