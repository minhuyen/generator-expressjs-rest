import express from "express";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import rateLimit from "express-rate-limit";
import {
  errorHandle,
  notFoundHandle,
  logErrors
} from "./helpers/handle-errors";
import { logger, swagger } from "./services";
import api from "./api";
import config from "./config";

require("./services/passport");

const rootApi = "/api/v1";
const ROOT_FOLDER = path.join(__dirname, "..");
const SRC_FOLDER = path.join(ROOT_FOLDER, "src");

const app = express();

app.set("trust proxy", 1); // trust first proxy

// init middlewares

// Security
app.use(helmet());
app.use(cors());
app.disable("x-powered-by");

// compression
app.use(compression());

app.use(cookieParser());
// logs http request
app.use(morgan(process.env.LOG_FORMAT || "dev", { stream: logger.stream }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// session
app.use(
  session({
    secret: config.session.secret,
    resave: true,
    saveUninitialized: true
  })
);

// passport
app.use(passport.initialize());

// rate limit
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// init database
require("./services/mongoose");

app.use(express.static(path.join(ROOT_FOLDER, "build"), { index: false }));
app.use("/static", express.static(path.join(SRC_FOLDER, "public")));
app.use("/media", express.static(path.join(ROOT_FOLDER, "uploads")));
app.get("/", (req, res) =>
  res.json({ message: "Welcome to <%=project_slug%> API!" })
);

app.use("/api-docs", swagger());

app.use(rootApi, api);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("/admin", (req, res) => {
  res.sendFile(path.join(ROOT_FOLDER, "build", "index.html"));
});

app.use(notFoundHandle);
app.use(logErrors);
app.use(errorHandle);

export default app;
