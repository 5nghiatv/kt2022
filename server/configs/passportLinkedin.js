const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy
const mongoose = require('mongoose')
const { User } = require('../models/User')

module.exports = function (passportLinkedin) {
  passportLinkedin.use(
    new LinkedinStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: process.env.LINKEDIN_CLIENT_CALLBACK_URL,
        scope: ['r_emailaddress', 'r_liteprofile'],
      },

      async (token, tokenSecret, profile, done) => {
        const newUser = {
          socialId: profile.id + 'linkedin',
          email: new Date().getTime() + '@gmail.com',
          name: profile.displayName,
          username: profile.emails[0].value,
          password: profile.id,
          role: 'LinkedIn',
          image: profile.photos[0].value,
          //image: '/img/avatars/Nghia1.jpg'
        }

        //console.log(profile);
        //console.log(newUser);

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

  passportLinkedin.serializeUser((user, done) => {
    done(null, user.id)
  })

  passportLinkedin.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
