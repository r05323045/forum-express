const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const db = require('../models')
const helpers = require('../_helpers')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const User = db.User
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Comment = db.Comment
const Like = db.Like

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
            image: 'https://i.imgur.com/MaWx0su.png'
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: [Restaurant] }
      ]
    }).then(user => {
      return res.render('profile', {
        user: user.toJSON(),
        permission: Number(helpers.getUser(req).id) === Number(req.params.id),
        comments: user.toJSON().Comments.reduce((acc, cur) => acc.map(item => item.Restaurant.id).includes(cur.Restaurant.id) ? acc : [...acc, cur], []) // remove duplicate restaurants
      })
    })
  },

  editUser: (req, res) => {
    if (Number(helpers.getUser(req).id) !== Number(req.params.id)) {
      req.flash('error_messages', 'Access permission denied')
      return res.redirect('/restaurants')
    }
    return User.findByPk(req.params.id).then(user => {
      return res.render('editprofile', {
        user: user.toJSON()
      })
    })
  },

  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        console.log(err)
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              image: file ? img.data.link : user.image
            })
              .then((restaurant) => {
                req.flash('success_messages', 'Your profile was successfully to update')
                res.redirect(`/users/${req.params.id}`)
              })
          })
      })
    } else {
      return User.findByPk(req.params.id)
        .then((user) => {
          user.update({
            name: req.body.name,
            image: user.image
          })
            .then((restaurant) => {
              req.flash('success_messages', 'Your profile was successfully to update')
              res.redirect(`/users/${req.params.id}`)
            })
        })
    }
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        return res.redirect('back')
      })
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        favorite.destroy()
          .then((restaurant) => {
            return res.redirect('back')
          })
      })
  },
  Like: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        return res.redirect('back')
      })
  },
  unLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((like) => {
        like.destroy()
          .then((restaurant) => {
            return res.redirect('back')
          })
      })
  }
}

module.exports = userController
