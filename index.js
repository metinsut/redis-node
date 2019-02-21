import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import expressValidator from 'express-validator';
import passport from 'passport';
import database from './config/database';
import optionsCors from './config/cors';
import routes from './controllers/routes';

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const ROOT_URL = dev ? `http://localhost:${port}` : process.env.PRODUCTION_URL;

const app = express();
database();

if (!dev) {
   /* Helmet helps secure our app by setting various HTTP headers */
   app.use(helmet());
   /* Compression gives us gzip compression */
   app.use(compression());
}

if (dev) {
   // Logger middleware
   app.use(morgan('tiny'));
}

// cors helps for our app headers normalize
app.use(cors(optionsCors));

// express middleware for json body parser
app.use(express.json());

// Initialize passport
app.use(passport.initialize());

// express validator Middleware
app.use(expressValidator());

app.use(express.static('public'));

app.use('/api', routes);

app.use((err, req, res, next) => {
   const { status = 500, message } = err;
   res.status(status).json({
      error: {
         message,
         unControl: true,
      },
      success: null,
   });
});

app.listen(port, () => console.log('App is listening on port ' + ROOT_URL));
