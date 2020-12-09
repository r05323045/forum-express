const imgur = require('imgur-node-api')
const db = require('../models')
const helpers = require('../_helpers')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const adminService = {
  getRestaurants: (req, res, callback, next) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => {
        callback({ restaurants: restaurants })
      })
      .catch(err => {
        next(err)
      })
  },
  getRestaurant: (req, res, callback, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category]
    })
      .then(restaurant => {
        callback({ restaurant: restaurant })
      })
      .catch(err => {
        next(err)
      })
  }
}

module.exports = adminService
