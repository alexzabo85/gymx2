const express = require('express');
const app = express();


// const ws = require('ws');
// const wsServer = new ws.Server({ port: 9999, noServer: true });
// wsServer.on('connection', socket => {
//     socket.on('message', message => {
//         socket.send('>>' + message)
//         console.log(message)
//     });
//     socket.send('connected!')
// });

// const expressWs = require('express-ws')(app);
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const bodyParser = require('body-parser');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');

const authRouter = require('./modules/auth/auth.rtr');
const userRouter = require('./modules/user/user.rtr');
const accRouter = require('./modules/account/account.rtr');
const prodRouter = require('./modules/product/product.rtr');
const indexRouter = require('./routes/index.rtr');
const ecRouter = require('./routes/ec.rtr');
// const chainRouter = require('./routes/chain.rtr');
// const apiRouter = require('./routes/api.routes');
// import shopRoutes from './routes/shop.routes'
// import orderRoutes from './routes/order.routes'
// import auctionRoutes from './routes/auction.routes'
const CURRENT_WORKING_DIR = process.cwd()

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../build')))
// app.use(express.static(path.join(__dirname, 'public')))
app.use(compress())
app.use(helmet())
app.use(cors())

// mount routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/account', accRouter);
app.use('/api/product', prodRouter)
app.use('/api/ec', ecRouter)
// app.use('/api/chain', chainRouter)
// app.use('/api/index', indexRouter);
// app.use('/', authRoutes)
// app.use('/', shopRoutes)
// app.use('/', orderRoutes)
// app.use('/', auctionRoutes)

app.get('*', (req, res) => {
  res.status(200).send({ status: '*' })
})

// Catch unauthorised errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ "error": err.name + ": " + err.message })
  } else if (err) {
    res.status(400).json({ "error": err.name + ": " + err.message })
    console.log(err)
  }
})



module.exports = app;
