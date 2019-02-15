import passport from 'passport';
import jtw from 'jwt-simple';

const tokenForUser = (user) => {
   const timestamp = new Date().getTime();
   return jtw.encode({ sub: user.id, iat: timestamp }, process.env.SECRET);
};

const signIn = (req, res, next) => {
   passport.authenticate('local', (err, user, info) => {
      if (err) {
         return res.status(500).json({
            error: err,
            success: null,
         });
      }
      if (!user) {
         return res.status(400).json({
            error: info,
            success: null,
         });
      }
      req.logIn(user, (error) => {
         if (error) {
            return res.status(500).json({
               error,
               success: null,
            });
         }
         res.json({
            error: null,
            success: {
               message: 'Successfully registered.',
               isAuth: true,
               token: tokenForUser(user),
               user,
            },
         });
      });
   })(req, res, next);
};

export { signIn };
