const imgur = require('imgur-node-api')
const db = require('../models')
const helpers = require('../_helpers')
const adminService = require('../services/adminService.js')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, req, (data) => {
      return res.render('admin/restaurant', data)
    })
  },

  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/create', {
        categories: categories
      })
    })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      res.redirect('/admin/restaurants')
    })
  },

  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        return res.render('admin/create', {
          categories: categories,
          restaurant: restaurant.toJSON()
        })
      })
        .catch(err => {
          console.log(err)
          req.flash('error_messages', "restaurant didn't exist")
          res.redirect('/admin/restaurants')
        })
    })
  },

  putRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      res.redirect('/admin/restaurants')
    })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data.status === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },

  getUsers: (req, res) => {
    return User.findAll({ raw: true }).then(users => {
      users.forEach(user => { user.isMe = user.id === helpers.getUser(req).id })
      return res.render('admin/users', { users: users })
    })
  },

  putUsers: (req, res) => {
    return User.findByPk(req.params.id)
      .then((user) => {
        if (user.id !== helpers.getUser(req).id) {
          return user.update({
            isAdmin: req.body.isAdmin === '0' ? 0 : 1
          })
        } else {
          req.flash('error_messages', 'permission denied')
          res.redirect('/admin/users')
        }
      })
      .then((user) => {
        req.flash('success_messages', `${user.name} was successfully to update`)
        res.redirect('/admin/users')
      })
      .catch(err => {
        console.log(err)
        req.flash('error_messages', 'Sorry, something went wrong')
        res.redirect('/admin/users')
      })
  }
}

module.exports = adminController
