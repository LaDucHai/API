let alluser = require('../data/Data/alluser.json')

const getUserById = (id) => {
    return alluser.alluser.find((x) => {return x.id === id})
}

const getUserByUserLogin = (userLogin) => {
    return alluser.alluser.find((x) => {return x.userLogin === userLogin})
}

module.exports = { getUserById, getUserByUserLogin };