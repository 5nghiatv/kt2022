const GithubStrategy = require('passport-github').Strategy
const mongoose = require('mongoose')
const { User } = require('../models/User')

module.exports = function (passportGithub) {
  passportGithub.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CLIENT_CALLBACK_URL,
        passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
      },

      //function(req, token, tokenSecret, profile, done) {

      async (req, accessToken, refreshToken, profile, done) => {
        const newUser = {
          socialId: profile.id + 'github',
          email: new Date().getTime() + '@gmail.com',
          name: profile.username,
          username: profile.username,
          password: profile.id,
          role: 'Github',
          image: profile.photos[0].value,
          //image: '/img/avatars/Nghia1.jpg'
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

  passportGithub.serializeUser((user, done) => {
    done(null, user.id)
  })

  passportGithub.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
