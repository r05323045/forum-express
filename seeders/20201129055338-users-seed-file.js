'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      id: 1,
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: true,
      name: 'root',
      createdAt: new Date(),
      updatedAt: new Date(),
      image: 'https://source.unsplash.com/collection/159213/300x300'
    }, {
      id: 2,
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
      image: 'https://source.unsplash.com/collection/159213/300x300'
    }, {
      id: 3,
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'user2',
      createdAt: new Date(),
      updatedAt: new Date(),
      image: 'https://source.unsplash.com/collection/159213/300x300'
    }], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
