const TwitterStrategy = require('passport-twitter').Strategy
const mongoose = require('mongoose')
const { User } = require('../models/User')

module.exports = function (passportTwitter) {
  passportTwitter.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: '/social/twitter/callback',
        passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
      },

      //function(req, token, tokenSecret, profile, done) {

      async (req, accessToken, refreshToken, profile, done) => {
        const newUser = {
          socialId: profile.id + 'twitter',
          email: new Date().getTime() + '@gmail.com',
          name: profile.displayName,
          username: profile.displayName,
          password: profile.id,
          role: 'Twitter',
          image: '/img/avatars/Nghia1.jpg',
        }

        // console.log(profile);
        // console.log(newUser);

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

  passportTwitter.serializeUser((user, done) => {
    done(null, user.id)
  })

  passportTwitter.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
