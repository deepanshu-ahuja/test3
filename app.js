const express = require("express");
const router = require('./routes/users')
const bodyParser = require('body-parser');

const multer = require('multer');
const path = require('path')
const session = require('express-session');
const User = require('./models/user')
let FileStore = require('session-file-store')(session);
const app = express();
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
   
    cb(null, './images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});


  
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");




app.use(bodyParser.urlencoded({extended: false}));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));   

  app.use(session({
    store: new FileStore({
    path: 'sessionss'
    }),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
    })
);

app.use((req, res, next) => {
    // throw new Error('Sync Dummy');
    if (!req.session.user) {
        console.log("inside if of session")
      return next();
    }
    User.findById(req.session.user.id, user=>{
        console.log("-------")
        if (!user) {
            return next();
          }
          req.user = user;
          
          next();
    })

})


app.use(router)


app.listen(3000);