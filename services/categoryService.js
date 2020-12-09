const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback, next) => {
    return Category.findAll().then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then((category) => {
            return res.render('admin/categories', { categories: categories, category: category })
          })
      } else {
        callback({ categories: categories })
      }
    })
      .catch(err => {
        next(err)
      })
  }
}
module.exports = categoryService
