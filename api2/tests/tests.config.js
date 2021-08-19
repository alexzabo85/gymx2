let config = require('../server/config/config');


const buildUser = (idx, age, address, gender) => {

  const birthDay = new Date()

  birthDay.setFullYear(birthDay.getFullYear() - age)

  return {
    name: "x",
    password: "aaaaaa",
    email: `${idx}a@a.a`,
    birthDay,
    address,
    gender,
  }
}


/**
 * 
 * @param {Array of Numbers} ages of groups to be generated. eacg group has all 3 gender types in ratio 1:3  
 * @param {Number} counter of users in each age group
 * @param {Number} offset of index for the group to be generarted (e.g.  = ages.length * groupSize )
 * @param {String} address of users to be generated
 * 
 * call example: genList([25, 30, 40, 45], 10, 0, '0-0-0')
 */
const genUsersList = async (ages = [], groupSize = 0, offset = 0, address = '0-0-0') => {
  const users = []
  // const b = config.test.users.lengtqh
  for (let i = 0; i < ages.length; i++) {
    for (let j = 0; j < groupSize; j++) {
      users.push({
        profile: buildUser(offset + i * groupSize + j, ages[i], address, (i * groupSize + j) % 2 ? 'male' : 'female'),
      })
    }
  }
  return users;
}

const buildFilterAGL = async (counter = 0, gender = '', ages = [], address, origin, language) => ({
  kind: config.filterTypes.agl,
  counter,
  counterInit: counter,
  minAge: ages[0],
  maxAge: ages[1],
  gender,
  address,
  origin: origin ? origin : 'any',
  language: language ? language : 'any',

})

config.mongoUris.client = `mongodb://${(process.env.IP || 'localhost')}:${(process.env.MONGO_PORT || '27017')}` + `/LINX_USER`


config.test = {

  genUsersList,

  buildFilterAGL,

  users: [],

  requests: [],

  product: {
    question: "hello world?",
    filters: [],
  },

  newVote: {
    "anything": "goes here"
  },

  keyPairs: [
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
  ],

}


module.exports = config
