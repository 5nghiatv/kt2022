const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const { User } = require('../models/User')

module.exports = function (passportStory) {
  passportStory.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/social/google/callback',

        // clientID: process.env.GITHUB_APP_ID,
        // clientSecret: process.env.GITHUB_APP_SECRET,
        // callbackURL: '/social/google/callback',
      },

      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          socialId: profile.id + 'google',
          image: profile.photos[0].value,
          email: new Date().getTime() + '@gmail.com',
          name: profile.displayName,
          username: profile.displayName,
          role: 'Google',
          password: profile.id,
        }

        console.log(newUser)

        try {
          let user = await User.findOne({ socialId: newUser.socialId })

          if (user) {
            global.__user = user //  setup AT ---passport.authenticate------users/logout------
            globalUser = user
            // console.log(globalUser.googleId)
            done(null, user)
          } else {
            user = await User.create(newUser)

            global.__user = user //  setup AT ---passport.authenticate------users/logout------
            globalUser = user
            done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      },
    ),
  )

  passportStory.serializeUser((user, done) => {
    done(null, user.id)
  })

  passportStory.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
