import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import LocalStrategy from 'passport-local';
import { User } from '../../models/user';

const passportService = () => {

   const jwtOptions = {
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      secretOrKey: process.env.SECRET,
   };

   const jtwLogin = new Strategy(jwtOptions, (payload, done) => {
      const matchUser = User.findById(payload.sub);
      matchUser
         .then((user) => {
            if (user) {
               done(null, user);
            } else {
               done(null, false);
            }
         })
         .catch((err) => {
            done(err, false);
         });
   });

   const localOptions = {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
   };

   const localLogin = new LocalStrategy.Strategy(
      localOptions,
      (username, password, done) => {
         const findUser = User.findOne({ email: username });
         findUser
            .select('id name email avatar about')
            .then((user) => {
               if (!user) {
                  return done(null, false, {
                     message: 'invalid e-mail address or password',
                  });
               } else {
                  return done(null, user);
               }
            })
            .catch((err) => {
               return done(null, err);
            });
      },
   );

   passport.serializeUser((user, done) => {
      done(undefined, user);
   });

   passport.deserializeUser((userData, done) => {
      User.findById(userData, (err, user) => {
         done(err, user);
      });
   });

   passport.use(localLogin);
   passport.use(jtwLogin);
};

export default passportService;
