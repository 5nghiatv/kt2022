const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../configs/auth-story')
//const { ensureAuth } = require('../configs/auth')
const passport = require('passport')
const Story = require('../models/story')

//===============================FOR AUTH GOOGLE==================

router.get('/login', (req, res) => {
  res.render('login-google', {
    //  globalUser: { googleId: ''},
  })
})

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))
router.get('/twitter', passport.authenticate('twitter', { scope: ['profile'] }))
//router.get('/facebook', passport.authenticate('facebook', { scope: ['profile'] }))
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['profile', 'email'] }),
)
router.get(
  '/github',
  passport.authenticate('github', {
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.GITHUB_CLIENT_CALLBACK_URL,
    scope: ['profile'],
  }),
)
router.get(
  '/linkedin',
  passport.authenticate('linkedin', {
    scope: ['r_emailaddress', 'r_liteprofile'],
  }),
)

// @desc    Google auth callback
// @route   GET /story/google/callback

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    //res.render('stories/dashboard')
    res.redirect('/social') // Call router.get('/') bên dưới
  },
)

// send to twitter to do the authentication
//  app.get('/twitter', passport.authenticate('twitter', { scope : 'email' }));

router.get(
  '/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  (req, res) => {
    //res.render('stories/dashboard')
    res.redirect('/social') // Call router.get('/') bên dưới
  },
)

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    //res.render('stories/dashboard')
    res.redirect('/social') // Call router.get('/') bên dưới
  },
)

router.get(
  '/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/' }),
  (req, res) => {
    //res.render('stories/dashboard')
    res.redirect('/social') // Call router.get('/') bên dưới
  },
)

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    //res.render('stories/dashboard')
    res.redirect('/social') // Call router.get('/') bên dưới
  },
)

//  app.get('/auth/facebook/callback', passport.authenticate('facebook', {successRedirect : '/profile',
//                 failureRedirect : '/'
//             }));

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res) => {
  req.logout()
  global.__user = '' //  setup AT ---passport.authenticate------users/logout------
  res.redirect('/exp/login')
})

// ========================
router.get('/intro', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.user._id,
      status: 'public',
    })
      .populate('user')
      .lean()
    // const stories = await Story.find({ status: 'public' })
    //   .populate('user')
    //   .sort({ createdAt: 'desc' })
    //   .lean()

    //console.log(stories)
    //console.log(global.__user)
    res.render('stories/intro', {
      stories,
      globalUser: req.user,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

//===============================FOR AUTH GOOGLE==================

// @desc    Show add+ Edit page to UPDATE
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/edit', {
    method: '',
    titleUpAdd: 'Add Story',
    story: {
      _id: '',
      title: '',
      body: '',
      status: '',
    },
    globalUser: req.user,
  })
})

// @desc    Process add form -- CREATE
// @route   POST /stories
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    //console.log(req.body)
    await Story.create(req.body)
    res.redirect('/social') // to Dashboard
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show all stories - Dashboard
// @route   GET /stories
// stories:{ _id: 5efae952145864387c3ece41, status: 'public', title: 'Học Node JS',  body: }

router.get('/', ensureAuth, async (req, res) => {
  try {
    //const stories = await Story.find({ status: 'public' })
    const stories = await Story.find()
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()
    //console.log(stories)
    //console.log(global.__user)

    res.render('stories/dashboard', {
      stories,
      globalUser: req.user,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate('user').lean()
    // const story = await Story.findOne({
    //   _id: req.params.id,
    // }).lean()

    if (!story) {
      return res.render('error/404')
    }

    //console.log(story)

    if (story.user._id != req.user.id) {
      res.redirect('/social')
    } else {
      res.render('stories/show', {
        story,
        globalUser: req.user,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})

// @desc    Show edit page
// @route   GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean()

    //console.log(story)

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/social')
    } else {
      res.render('stories/edit', {
        method: '?_method=PUT',
        titleUpAdd: 'Edit Story',
        story,
        globalUser: req.user,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Update story
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/social')
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/social')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      req.body.user = req.user.id
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/social')
    } else {
      await Story.remove({ _id: req.params.id })
      res.redirect('/social')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean()

    res.render('stories/intro', {
      stories,
      globalUser: req.user,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router
