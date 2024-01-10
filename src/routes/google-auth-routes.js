const express = require('express')
const passport = require('passport')

const router = express.Router()

// Google Authentication Routes
router.get('/auth/google/', passport.authenticate('google', { scope: ['profile', 'email'] }))
// router.get('/web', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google/failure' }),
  (req, res) => {
    try {
      res.redirect('/web')
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
)

router.get('/auth/google/failure', (req, res) => {
  res.status(401).json({ error: 'Failed to authenticate' })
})

module.exports = router
