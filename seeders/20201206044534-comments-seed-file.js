'use strict'
const commentsText = ['好吃', '餐點精緻，但服務態度有待加強', '氣氛很好，適合情侶來', '老闆很好聊，是個親切可愛的大叔', '熱門餐廳，要先訂位喔', '價格合理，物超所值', '衛生環境很糟糕']
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 50 }).map((d, i) =>
        ({
          id: i + 1,
          text: commentsText[Math.floor(Math.random() * 6)],
          UserId: Math.floor(Math.random() * 3) + 1,
          RestaurantId: Math.floor(Math.random() * 50) + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {})
  }
}
