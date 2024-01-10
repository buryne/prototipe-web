const express = require('express')
const { getUserById } = require('../controllers/controllers-user-ejs')
const { db } = require('../utils/firebase')

const router = express.Router()

router.get('/my-posts/user/:id', getUserById)
router.get('/my-posts/user/delete/:id', (req, res) => {
  const { id } = req.params

  const userDocRef = db.collection('posts-2').doc(id)

  userDocRef
    .delete()
    .then(() => {
      res.redirect('/profile')
    })
    .catch((error) => {
      res.status(500).json({ error: error.message })
    })
})

module.exports = router
