import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import {
  errorHandle,
  notFoundHandle,
  logErrors
} from './helpers/handle-errors';
import logger from './services/logger';
import mongoose from './services/mongoose';
import api from './api';
import config from './config';

require('./services/passport');

const app = express();
const port = process.env.PORT || 3000;
const rootApi = '/api/v1';
const ROOT_FOLDER = path.join(__dirname, '.');
const SRC_FOLDER = path.join(ROOT_FOLDER, 'src');
// Security
app.use(helmet());
app.use(cors());
// compression
app.use(compression());

// logs http request
app.use(morgan('dev', { stream: logger.stream }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// passport
app.use(passport.initialize());

// database
let dbOptions = {
  user: process.env.MONGO_INITDB_ROOT_USERNAME,
  pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
  useNewUrlParser: true,
  useCreateIndex: true
};
mongoose.connect(config.mongodb.url, dbOptions);

app.use(express.static(path.join(ROOT_FOLDER, 'build'), { index: false }));
app.use('/static', express.static(path.join(SRC_FOLDER, 'public')));
app.use('/media', express.static(path.join(ROOT_FOLDER, 'uploads')));
app.get('/', (req, res) =>
  res.json({ message: 'Welcome to <%=project_slug%> API!' })
);

const swaggerDefinition = {
  // openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
  info: {
    title: '<%=project_slug%>', // Title (required)
    version: '1.0.0' // Version (required)
  },
  basePath: '/api/v1', // Base path (optional)
  schemes: ['http', 'https'],
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header'
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['api/**/*.js'] // <-- not in the definition, but in the options
};

const swaggerSpec = swaggerJSDoc(options);

const swOptions = {
  explorer: true,
  customCss:
    '.swagger-ui .opblock-body pre span {color: #DCD427 !important} .swagger-ui .opblock-body pre {color: #DCD427} .swagger-ui textarea.curl {color: #DCD427} .swagger-ui .response-col_description__inner div.markdown, .swagger-ui .response-col_description__inner div.renderedMarkdown {color: #DCD427}'
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swOptions));

app.use(rootApi, api);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('/admin', (req, res) => {
  res.sendFile(path.join(ROOT_FOLDER, 'build', 'index.html'));
});

app.use(notFoundHandle);
app.use(logErrors);
app.use(errorHandle);

app.listen(port, () => logger.info(`Example app listening on port ${port}!`));

logger.info('Hello world');
logger.warn('Warning message');
logger.debug('Debugging info');
