const FacebookStrategy = require('passport-facebook').Strategy
const mongoose = require('mongoose')
const { User } = require('../models/User')

module.exports = function (passportFacebook) {
  passportFacebook.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_APP_CALLBACK_URL, // https://nghiatv.herokuapp.com/social/facebook/callback
        profileURL:
          'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        profileFields: ['id', 'email', 'name'], // For requesting permissions from Facebook API
        passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
      },

      //function(req, token, tokenSecret, profile, done) {
      // https://localhost:8080/social/facebook/callback

      async (req, accessToken, refreshToken, profile, done) => {
        const newUser = {
          socialId: profile.id + 'facebook',
          email: new Date().getTime() + '@gmail.com',
          name: profile.name.givenName + ' ' + profile.name.familyName,
          username: profile.name.givenName + ' ' + profile.name.familyName,
          password: profile.id,
          role: 'Facebook',
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

  passportFacebook.serializeUser((user, done) => {
    done(null, user.id)
  })

  passportFacebook.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
