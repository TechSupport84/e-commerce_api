import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import createError from "http-errors";
import productRouter from "./routes/product.js";
import swaggerUi from "swagger-ui-express";
import swaggerRouter from "./routes/swagger.js";
import { connectDb } from "./config/db.js";
import { Strategy as GitHubStrategy } from "passport-github"; 
import passport from "passport";
import { Client } from "./models/user.model.js";
import session from "express-session";
import userAuth from "./routes/user.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, 
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Client.findById(id);
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACKURL,
    },
    async (accessToken, refreshToken, profile, done) => {

        console.log(profile)
      try {
      
        
        let user = await Client.findOne({ githubId: profile.id });

        if (!user) {
          user = new Client({
            username: profile.displayName,
            githubId: profile.id,
          });
          await user.save();
          console.log("User Created Successfully");
        } else {
          console.log("User already exists");
        }

        return done(null, user);
      } catch (err) {
        console.error("Error saving user:", err);
        return done(err, null);
      }
    }
  )
);

const isAuth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/auth/login");
  }
};

app.get("/api/auth/login", (req, res) => {
  res.status(201).json({ success: true, message: "login" });
});

app.get("/api/auth/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/api/auth/login");
  });
});

app.get("/api/auth/github", passport.authenticate("github"));

app.get("/api/auth/github/callback", 
  passport.authenticate("github", { failureRedirect: "/auth/login" }),
  function (req, res) {
    res.redirect("/api/product/products");
  }
);

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const swaggerFilePath = path.resolve("swagger.json");
let swaggerDocument = {};
try {
  swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));
} catch (err) {
  console.error("Error reading swagger.json:", err);
}
app.use("/api/auth",userAuth )
app.use("/api/product", productRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", swaggerRouter);

app.use((req, res, next) => {
  next(createError(404, "Not found"));
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
