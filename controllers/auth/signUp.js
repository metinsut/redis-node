import { User } from '../../models/user';

const validateSignUp = (req, res, next) => {
   req.sanitizeBody('name');
   req.sanitizeBody('email');
   req.sanitizeBody('password');

   // Name is non-null and is 4 to 10 characters
   req.checkBody('name', 'Enter a name').notEmpty();
   req.checkBody('name', 'Name must be between 4 and 10 characters').isLength({
      min: 4,
      max: 10,
   });

   // Email is non-null, valid, and normalized
   req.checkBody('email', 'Enter a valid email')
      .isEmail()
      .normalizeEmail();

   // Password must be non-null, between 4 and 10 characters
   req.checkBody('password', 'Enter a password').notEmpty();
   req.checkBody(
      'password',
      'Password must be between 4 and 10 characters',
   ).isLength({ min: 4, max: 10 });

   const errors = req.validationErrors();
   if (errors) {
      const firstError = errors.map((error) => error)[0];
      return res.status(400).json({
         error: firstError,
         success: null,
      });
   }
   next();
};

const signUp = async (req, res) => {
   const { name, email, password } = req.body;
   const findUser = User.findOne({ email });
   findUser
      .then(async (data) => {
         if (data) {
            res.json({
               error: 'Email is in use',
               success: null,
            });
         } else {
            const user = await new User({
               name,
               email,
               password,
            });
            const saveUser = user.save();
            saveUser
               .then((userData) => {
                  res.status(201).json({
                     error: null,
                     success: {
                        email: userData.email,
                        name: userData.name,
                     },
                  });
               })
               .catch((err) => {
                  res.json({
                     error: err,
                     success: null,
                  });
               });
         }
      })
      .catch((err) => {
         res.json({
            error: err,
            success: null,
         });
      });
};

export { signUp, validateSignUp };
