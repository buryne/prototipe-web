const express = require('express')
const axios = require('axios')
const {
  getAllPostsView,
  UpdatePostsView,
  getUpdatePostView,
  createPost,
} = require('../controllers/controllers-post-ejs')
const upload = require('../utils/multer')
const { getUserDocByUid } = require('../services/user-action')
require('dotenv').config()

const router = express.Router()

const isLoggedIn = (req, res, next) => {
  if (req.user) {
    // Continue to the next middleware if the user is authenticated
    return next()
  }
  // Render the index page with authentication status
  return res.render('index', { isAuthenticated: false })
}

// ! Create Post
router.get('/create-post', isLoggedIn, (req, res) => {
  if (!req.user) {
    return res.redirect('/ui') // Redirect to login if not logged in
  }
  // Retrieve user information from your authentication system
  const userId = req.user // Assuming you have the userId in the user object
  res.render('create-post', { userId })
})

// ! Create Post
router.post('/create-post', isLoggedIn, upload.single('image'), createPost)

// ! Get All Post
router.get('/allPosts', getAllPostsView)

// ! Get Profile
router.get('/profile', isLoggedIn, async (req, res) => {
  if (!req.user) {
    return res.redirect('/web') // Redirect to login if not logged in
  }

  const username = req.user.displayName
  const photoURL = req.user.photoURL
  const uid = req.user.uid

  try {
    // Menerima dokumen pengguna berdasarkan uid
    const user = await getUserDocByUid(uid)

    res.render('profile', { username, photoURL, uid, user_id: user.id })
  } catch (error) {
    res.status(500).render('error', { message: error.message })
  }
})

// ! Edit Post
router.get('/edit-post/:postId', isLoggedIn, getUpdatePostView)
router.post('/edit-post/:postId', isLoggedIn, upload.single('image'), UpdatePostsView)

// ! Another
router.get('/web', isLoggedIn, async (req, res) => {
  console.log({
    user: req.user ? req.user : 'No user',
  })
  const { photoURL, displayName } = req.user
  console.log(displayName)
  try {
    // If the user is authenticated, render a personalized greeting

    const cityName = req.query.cityName || 'Jakarta'

    const cities = ['Jakarta', 'Semarang', 'Surabaya', 'Bandung', 'Yogyakarta']

    // eslint-disable-next-line max-len
    const apiUrl = `https://model-api-dot-capstone-project-api-ch2-ps352.et.r.appspot.com/janu-recomend/predict?name=${cityName}`

    console.log(apiUrl)

    const response = await axios.get(apiUrl)
    const predictions = response.data

    // console.log(predictions)

    res.render('index', {
      username: displayName,
      photoURL,
      isAuthenticated: true,
      selectedCity: cityName,
      predictions,
      cities,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/recomend-wisata', async (req, res) => {
  try {
    const cityName = req.query.cityName || 'Jakarta'

    // eslint-disable-next-line max-len
    const apiUrl = `https://model-api-dot-capstone-project-api-ch2-ps352.et.r.appspot.com/janu-recomend/predict?name=${cityName}`

    console.log(apiUrl)
    // Make API call
    const response = await axios.get(apiUrl)
    const predictions = response.data
    console.log(predictions)
    // Assuming the API returns an array of predictions
    res.render('recomend-wisata', {
      predictions,
      selectedCity: cityName,
      cities: ['Jakarta', 'Semarang'],
    })

    // Render the EJS template with the predictions and city options
    // res.render('wisata', { predictions, cities: ['Jakarta', 'Semarang'] })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router

module.exports = router
