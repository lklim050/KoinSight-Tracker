INTRODUCTION
In this tutorial, we will create a simple Express server that connects to a MongoDB database using Mongoose. We will set up the project structure, install necessary packages, and create a basic server that can handle requests.

TABLE OF CONTENTS

- [INSTALL PACKAGE INITIALIZATION](#install-package-initialization)
- [CHANGE PACKAGE.JSON](#change-packagejson)
- [ENVIRONMENT VARIABLES CREATION](#environment-variables-creation)
- [SRC FOLDER CREATE](#src-folder-create)
  - [DB FOLDER, DB.JS](#db-folder-dbjs)
  - [MODELS FOLDER, SCHEMA.JS](#models-folder-schemajs)
  - [CONTROLLERS FOLDER, CONTROLLER.JS](#controllers-folder-controllerjs)
  - [ROUTER FOLDER, ROUTER.JS](#router-folder-routerjs)
  - [VALIDATORS FOLDER, VALIDATOR.JS](#validators-folder-validatorjs)
  - [MIDDLEWARES FOLDER, MIDDLEWARE.JS](#middlewares-folder-middlewarejs)
- [SERVER.JS](#serverjs)
- [CREATE JWT](#create-jwt)
  - [INSTALL PACKAGES](#install-packages)
  - [ENV VARIABLES](#env-variables)
  - [MODELS FOLDER, USERSCHEMA.JS](#models-folder-userschemajs)
  - [CONTROLLERS FOLDER, AUTHCONTROLLER.JS](#controllers-folder-authcontrollerjs)
  - [BRUNO](#bruno)
  - [MIDDLEWARES FOLDER, AUTHMIDDLEWARE.JS](#middlewares-folder-authmiddlewarejs)
- [SECURING API ENDPOINTS (HARDENING)](#securing-api-endpoints-hardening)
  - [RATE LIMITING](#rate-limiting)
  - [CORS](#cors)
  - [HELMET](#helmet)

## INSTALL PACKAGE INITIALIZATION

Install the following packages

- npm init -y
- npm i express
- npm i -D nodemon
- npm i dotenv
- npm i mongoose

## CHANGE PACKAGE.JSON

Make a few changes to the package.json file:

```js
// add the following
"scripts": {
    "start": "node server",
    "dev": "nodemon server"
  },
// change the following
"type": "module",
"main": "server.js",

```

## ENVIRONMENT VARIABLES CREATION

Create a .env file and add the following code:
note that you need to define PORT and your DATABASE path here:

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/homework
```

## SRC FOLDER CREATE

create a src folder with the following folders (models, routes, controllers, middlewares, db, validators etc) and files (db.js, schema.js, router.js, controller.js, middleware.js, validator.js etc) inside it.

### DB FOLDER, DB.JS

Create db folder with db.js file created and add the following line:

```js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
```

### MODELS FOLDER, SCHEMA.JS

Create models folder with schema.js file created and add the following line:

Below is an example of how to create a schema with an embedded schema:

```js
import mongoose from "mongoose";

const schemaEmbedded = new mongoose.Schema(
  {
    // Define your schema fields here
  },
  { collection: "collectionNameEmbedded" },
);

const schema = new mongoose.Schema(
  {
    // Define your second schema fields here with the embedded schema
    someField: { schemaEmbedded },
  },
  { collection: "collectionName" },
);

export default mongoose.model("ModelName", schema);
```

Here is an example of schema referrencing:

```js
import mongoose from "mongoose";
const schemaReferenced = new mongoose.Schema(
  {
    // Define your schema fields here
  },
  { collection: "collectionNameReferenced" },
);

export default mongoose.model("ModelNameReferenced", schemaReferenced);
```

this is another model that references the above schema:

```js
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    // Define your second schema fields here with the referenced schema
    someField: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ModelNameReferenced",
    },
  },
  { collections: "collectionName" },
);

export default mongoose.model("ModelName", schema);
```

### CONTROLLERS FOLDER, CONTROLLER.JS

Create controllers folder with controller.js file created and add the following line:

```js
import ModelName from "../models/schema.js";

// Define your controller functions here
```

### ROUTER FOLDER, ROUTER.JS

Create router folder with router.js file created and add the following line:

```js
import express from "express";
import * as controllers from "../controllers/controller.js";
const router = express.Router();
// Define your routes here and use the controller functions
router.get("/some-route", controllers.someControllerFunction);
router.post("/some-route", controllers.someOtherControllerFunction);

export default router;
```

### VALIDATORS FOLDER, VALIDATOR.JS

Create validators folder with validator.js file created. Note you may google for more information on how to use express-validator and define your validation rules as you wish (with custom()). Below is an example of how to create a validator:

```js
import {whatever syntax you want to validate e.g. body, param} from "express-validator";

export const someValidator = [
  // Define your validation rules here
  body("someStringField", "someStringField is required").exists()
  param("someParamField", "someParamField must be a number").isInt({min:1, max:100}),
  body("someField", "someField must be a number").optional(),
];

```

Below is an example of how to create a custom validator that checks if the id in the body is a valid MongoDB ObjectId and exists in the database:

```js
export const validateIdInBody = [
  body("id", "id is invalid")
    .exists()
    .isMongoId()
    .custom(async (id) => {
      const idArray = Array.isArray ? [id] : id;
      const valid = await BooksModel.countDocuments({
        _id: { $in: idArray },
      });
      if (valid !== idArray.length) {
        throw new Error("id not found in database");
      } else {
        return true;
      }
    }),
];
```

Next create a validator for validation results:

```js
import { validationResult } from "express-validator";

const checkError = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ status: "error", msg: errors.array() });
  } else {
    next();
  }
};

export default checkError;
```

After which, insert the validator and the checkError function into the route like this:
Example below is insert validator at the router level:

```js
import express from "express";
import { someValidator } from "../validators/validator.js";
import checkError from "../validators/validator.js";

const router = express.Router();

router.post("/some-route", someValidator, checkError, someControllerFunction);
```

### MIDDLEWARES FOLDER, MIDDLEWARE.JS

Create middlewares folder with middleware.js file created.
This is an example of errorhandler.js

```js
// this is to capture json error
export const jsonErrorHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("JSON parsing error:", err.message);
    return res.status(400).json({
      status: 400,
      msg: "invalid JSON format",
    });
  } else if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    err.type === "entity.parse.failed"
  ) {
    console.error("URL-encoded parsing error:", err.message);
    return res.status(400).json({
      status: 400,
      msg: "invalid form data format",
    });
  }

  next(err); // if err, this goes to next error middleware (err) instead the api endpoint
};

// this is to capture server error
export const globalErrorHandler = (err, req, res, next) => {
  console.error("Unhandled error:", err);
  console.error(err.message);
  console.error(err.stack);

  res.status(err.status || 500).json({
    status: "error",
    msg: err.message,
  });
};
```

## SERVER.JS

Create a file named server.js and add the following code with middleware and routes:

```js
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/db/db.js";
import * as controllers from "./src/controllers/controller.js";
import {
  jsonErrorHandler,
  globalErrorHandler,
} from "./src/middlewares/middleware.js";

dotenv.config();
connectDB();
const app = express();
app.use(express.json()); // for body parsing application/json
app.use(express.urlencoded({ extended: false })); // true if data is nested

// Define your middlewares here: JSON error handler (before the routes)
app.use(jsonErrorHandler);

// Define your routes here and use the controller functions
app.get("/", controllers.someControllerFunction);
app.post("/some-route", controllers.someOtherControllerFunction);

// Start the server with the PORT defined in the .env file
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// Define your global error handler middleware here (after the routes)
app.use(globalErrorHandler);
```

## CREATE JWT

### INSTALL PACKAGES

- npm i jsonwebtoken
- npm i bcrypt
- npm i uuid

### ENV VARIABLES

    ```env
    ACCESS_SECRET=your_access_secret_key
    REFRESH_SECRET=your_refresh_secret_key
    ```

### MODELS FOLDER, USERSCHEMA.JS

Add the following code to schema.js file:

```js
import mongoose from "mongoose";
const authSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    hash: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "auths" },
);

export default mongoose.model("Auth", authSchema);
```

### CONTROLLERS FOLDER, AUTHCONTROLLER.JS

Create authController.js file in controllers folder and add the following code:

```js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import UserModel from "../models/userSchema.js";
// Function to register a new user
export const registerUser = async (req, res) => {
  try {
    // 1. Check if the username already exists.
    const auth = await UserModel.findOne({ username: req.body.username });
    if (auth) {
      return res.status(400).json({ msg: "Username already exists" });
    }

    // 2. Hash the password and create the user to the database.
    const hash = await bcrypt.hash(req.body.password, 12);
    await UserModel.create({
      username: req.body.username,
      hash,
    });
    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
// Function to login a user
export const loginUser = async (req, res, next) => {
  try {
    // 1. Check if the username exists.
    const auth = await UserModel.findOne({ username: req.body.username });
    if (!auth) {
      const error = new Error("Username not found");
      error.status = 404;
      return next(error);
    }
    // 2. Compare the password with the hash in the database.
    const isMatch = await bcrypt.compare(req.body.password, auth.hash);
    if (!isMatch) {
      const error = new Error("Incorrect password");
      error.status = 401;
      return next(error);
    }
    // 3. If the password is correct, create an access token and a refresh token.
    const payload = { username: auth.username };
    const access = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: "15m",
      jwtid: uuidv4(),
    });
    const refresh = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
      jwtid: uuidv4(),
    });
    res.json({ access, refresh });
  } catch (error) {
    const error = new Error(error.message);
    error.status = 500;
    return next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    // 1. Verify the refresh token and if it is valid, create a new access token.
    const decoded = jwt.verify(req.body.refresh, process.env.REFRESH_SECRET);
    const payload = { username: decoded.username };
    const access = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: "15m",
      jwtid: uuidv4(),
    });
    res.json({ access });
  } catch (error) {
    const error = new Error("unable to refresh token");
    error.status = 401;
    return next(error);
  }
};
```

#### BRUNO

At bruno, add the following:

1. Define environment variables for ACCESS_SECRET and REFRESH_SECRET.
2. At collection of auth, add bearer token with {{access token}}
3. At post script, add the following code where the generated tokens are stored in the environment variables:

```js
const jsonData = res.getBody();
bru.setEnvVar("access_token", jsonData.access);
bru.setEnvVar("refresh_token", jsonData.refresh);
```

### MIDDLEWARES FOLDER, AUTHMIDDLEWARE.JS

Create authMiddleware.js file in middlewares folder and add the following code:

```js
import jwt from "jsonwebtoken";
export const auth = (req, res, next) => {
  if (!("authorization" in req.headers)) {
    return res.status(400).json({ status: "error", message: "no token found" });
  }
  const token = req.headers["authorization"].replace("Bearer ", ""); // removal of the word "Bearer "
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      req.decoded = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ status: "error", message: "unauthorised" });
    }
  } else {
    return res.status(403).send({ status: "error", message: "missing token" });
  }
};
```

Below is an example of how to create an auth middleware that checks for admin role:

```js
import jwt from "jsonwebtoken";
export const authAdmin = (req, res, next) => {
  if (!("authorization" in req.headers)) {
    return res.status(400).json({ status: "error", msg: "no token found" });
  }
  const token = req.headers["authorization"].replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

      if (decoded.role.toLowerCase() === "admin") {
        req.decoded = decoded;
        next();
      } else {
        console.error("unauthorised");
        return res.status(403).json({ status: "error", msg: "unauthorised" });
      }
    } catch (error) {
      console.error(error.message);
      return res.status(401).json({ status: "error", msg: "unauthorised" });
    }
  } else {
    console.error("missing token");
    return res.status(403).json({ status: "error", msg: "missing token" });
  }
};
```

Then at server.js, add the following code to import the auth middleware and use it in a protected route:

```js
import { auth } from "./middlewares/authMiddleware.js";

// you may put it before the endpoint like this:
app.use(auth);
app.use("/protected", someRouterFunction);
```

OR you can put it in the API endpoint like this:

```js
app.use("/protected", auth, someControllerFunction);
```

or at the router level like this:

```js
router.get("/protected-route", auth, someControllerFunction);
// or for admin only access:
router.put("/protected-route", authAdmin, someControllerFunction);
```

?????

## SECURING API ENDPOINTS (HARDENING)

### RATE LIMITING

Install the package: npm i express-rate-limit

### CORS

Install the package: npm i cors

### HELMET

Install the package: npm i helmet

At server.js, add the following code to import the packages and use them as follows:

```js
import rateLimit from "express-rate-limit";
import cors from "cors";
import helmet from "helmet";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(helmet());
app.use(cors());
```
