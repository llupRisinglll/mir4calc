# Project Details

## Technologies Used
1. EJS -
2. ExpressJS - Used for serving requests
3. Webpack - Used for compiling TSX into a usable frontend component
4. Firebase Hosting - Hosting the frontend app
5. App Engine - Hosting the backend API route
6. Compute Engine - Hosts

### Running frontend
```
nodemon index.js
```

### Compiling the frontend JS files
When you are developing the App, use `development` parameter and use `production` before releasing the app
```
npx webpack --watch --mode [development | production]
```