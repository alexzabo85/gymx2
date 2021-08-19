# transaction system V0.0
# hot to run
## $ npm i 
Windows machine:
## $ npm run test.win.create_users
## $ npm run test.win.create_accounts
## $ npm run test.win.create_products

s

## TODO
- validate user parameter when vote using voter filters (see example in 'Other' section)
- store a chain of tx
- create a population database which holds statistical information 
  for example city-A statistics: 
   - residents (absolute value)
   - gender division (percentage) 
   - age distribution (age-gender-pyramid)
## services:
- authentication module
- survey module
- chain module
- account module
- analytics module
- statistics module

## - handler - routes:
- sign in:       POST    /api/auth/signin
- sign out:      GET     /api/auth/signout

- Create User:     POST    /api/user/    
- List Users:      GET     /api/user/  
- Read Profile:    GET     /api/user/:userId    
- Edit Profile:    PUT     /api/user/:userId    
- Remove Profile:  DELETE  /api/user/:userId   

- List Accounts:  GET    /api/account/  
- Create Account: POST   /api/account/create/:userId  
- Read Account:   GET    /api/account/:accId  
- Send TX:        POST   /api/account/:accId  

- Creade Product:  POST    /api/product/  
- List Products:   GET    /api/product/  
- Vote:            POST    /api/product/:prodId  


## initialization phase: 

## NOTES:

### product.ctrl.js
- NOTE[PC01] see https://mongoosejs.com/docs/schematypes.html#mixed for  product.get(`resultsMap.${req.auth._id}`)
- !NOTE[PC02] how to add filter 
  > product.filters.push({
  > locationType: 'country',
  > area: '0000-0000-0000-0001',
  > locationName: 'never ever land',
  > ageGenderConf: new Map([['18-25', { male: 10, female: 11, other: 2 }]])
  > })
 
- NOTE[PC011] store a filter reference for which the voter was accepted. 
  verifyVoter() should return filter _id which will be saved in produc.results array.

- NOTE[PC03] The app should verify each filter conf using the schema of its type using dynamic-ref 
  (see https://mongoosejs.com/docs/populate.html#dynamic-ref)

- NOTE[PC04] Example to add filter in server  
  >const filters = [
  >  { kind: 'AGL', area: '1-2-3' },
  >  {
  >    kind: 'DUMMY',
  >    ageGenderPyramid:
  >    new Map([['18-25', { male: 10, female: 11, other: 2 }]])
  >   },
  > ]

- !NOTE[PC05] the [...] spread operation is used only to recognize 'product.filters' as array type and display the info of forEach(...). 
    It Should be removed for batter performance.

- Example read map value:  product.get(`resultsMap.${_userId}`) ????

- Q: how to link each vote to the filter it was accapted by?

### product.model.js
- NOTE[PM01] filterSchema provide schema functionality to a schema-less array of object  (voters filters). 
    it shouldn't have an _id.
    (see https://stackoverflow.com/questions/17254008/stop-mongoose-from-creating-id-property-for-sub-document-array-items)

- https://thecodebarbarian.com/mongoose-4.12-single-embedded-discriminators.html
- https://masteringjs.io/tutorials/mongoose/schematype
- https://masteringjs.io/tutorials/mongoose/schema
- http://thecodebarbarian.com/2015/07/24/guide-to-mongoose-discriminators 

- NOTE[PM02] type is property of the schema (NOT the special property of Mongoose schemas)  
  (see https://mongoosejs.com/docs/schematypes.html#type-key)


 

## action flows
### voting procedure 
[client side]
    - sign-in
    - get a list of products (may use product filters)
    - enter product dashboard 
    - make a vote:
[server side]
        - receive a vote which located in the request body (req.body)
        - fetch product from db (and integrate it into req.product)
        - validate voter parameters (as defined in the product demographic configurations)
            if OK: 
            - save the vote to product results (req.product.results)



## other
- Israel population distribution by age: https://netunim.wordpress.com/2016/07/10/%D7%94%D7%AA%D7%A4%D7%9C%D7%92%D7%95%D7%99%D7%95%D7%AA-%D7%92%D7%99%D7%9C%D7%99%D7%9D/ 
- Markdown guides:
  https://guides.github.com/features/mastering-markdown/ 
  https://docs.github.com/en/free-pro-team@latest/github/writing-on-github
- filtering voters in product:
  Each product has an array of filters. 
  Voter must fit one of the filters.

- filters examples:
 - statistics database model for city
     total residents: 100K, 
     total gender ratio: 0.51, 
     age-gender population distribution (absolute/relative?)
       > \[age]:\[males,females,others] 
       > [0-4]:[10,10.5,0]
       > [5-10]:[9.9,9.8,0]
       > [10-18]:[9.5,9.4,0.01]
       > [19-25]:[9.2,9.1,0.1]
       > [26-29]:[8.9,8.95,0.2]
       > [30-34]:[8.7,8.8,0.4]
       > [35-39]:[8.4,8.6,0.7]
       > [40-45]:[7.4,7.6,0.6]
       > ...
       > [65-69]:[7.4,7.6,0.50]
       > [70-75]:[5.4,5.6,0.1]
       > ...
       > [80+]:[3.4,3.6,0.05]

   [city-B] 
     total residents: 52K, 
     total gender ratio: 0.48, 
     age-gender distribution




# dev links:

- use async/await in Express API handler
  http://thecodebarbarian.com/80-20-guide-to-async-await-in-node.js.html

# logging API requests and responses

-   https://www.moesif.com/blog/technical/logging/How-we-built-a-Nodejs-Middleware-to-Log-HTTP-API-Requests-and-Responses/


## mongoose links: 
- population statistics in israel 
  https://netunim.wordpress.com/%d7%a1%d7%a4%d7%a8%d7%99%d7%9d/
  https://netunim.files.wordpress.com/2019/02/netunim-book-1-0.pdf

- discriminators
  http://thecodebarbarian.com/2015/07/24/guide-to-mongoose-discriminators

- sub-documents
  https://stackoverflow.com/questions/26156687/mongoose-find-update-subdocument


## cryptography links
- https://www.npmjs.com/package/elliptic
- https://gist.github.com/nakov/1dcbe26988e18f7a4d013b65d8803ffc
- https://cryptobook.nakov.com/crypto-libraries-for-developers/javascript-crypto-libraries



## Jest/Supertest.Superagent
- https://jaketrent.com/post/authenticated-supertest-tests

# TODO list:

- vote API
client vote is saved in a special vote collection specific to the product.
the vote collection will be named after the product id.

- tx API
each tx saved in a collection 'txs'
a tx contain: msg, signature, 

# cryptography 

- sign tx ec.sign(privateKey,dataHash) and ec.verify(publicKey,signature,dataHash)
- https://www.youtube.com/watch?v=VV7x4tMxeoI
 

# TESTS

- product test(generate N new users ,1 product and try to vote)
$ node ./test/product.tst.js

- account test (generate user and account)
$ npm test account 

# issue / solutions

## mongoose wouldn't create index for account owner field
- search on google: mongoose does not create unique index
- https://github.com/Automattic/mongoose/issues/8786
- https://mongoosejs.com/docs/connections.html
- https://dev.to/emmysteven/solved-mongoose-unique-index-not-working-45d5
- https://masteringjs.io/tutorials/mongoose/unique

# tests 

## account.tst.js:

test-1
- total tx: 10000
- packet size: 10
- time: 271.189, accepted Tx: 9990/10000

test-2
- total tx: 1000
- packet size: 100
- time: 15.210, accepted Tx: 1000/1000

test-3
- total tx: 1000
- packet size: 100
- time: 11643, accepted Tx: 1/1000

time: 1503, accepted Tx: 1/100, Packet size: 10,
time: 1977, accepted Tx: 99/100, Packet size: 10, 
time: 3021, accepted Tx: 99/100, Packet size: 10, 
time: 3752, accepted Tx: 99/100, Packet size: 100, 


test-4 [product.tst.js] [commit 'TEST 13-12:05']
time: 218ms, accepted Tx: 7/10,


# procedures

## vote procedure
- create vote in pending-collection _QP_
- search for available filter in the product
- update filter as occupied in the product
- create vote in accept-collection _Q_
- delete pending vote from pending-collection _QP_
