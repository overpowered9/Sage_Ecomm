const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(express.static('./public'));
app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Note: In production, set this to true and use HTTPS
}));

app.set("view engine", "ejs");

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/shoeStore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Connection error', err);
});

//middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(express.json());
app.use(cookieParser());



const userRouter = require('./routes/users');
const homeRouter = require('./routes/home');
const productRouter = require('./routes/product');
const contactAboutRoutes = require('./routes/contactabout'); // Import your routes

app.use('/users', userRouter);
app.use('/', homeRouter);
app.use('/products',productRouter)
app.use('/getin', contactAboutRoutes); // Use your routes with '/getin' prefix





const port = 4000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
