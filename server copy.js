const express = require('express');
const app = express();
app.set("view engine","ejs");
// const expressLayouts = require('express-ejs-layouts');
// const { text } = require('stream/consumers');
// app.use(expressLayouts);
// app.use(express.static('./public'));
app.get('/', (req, res) => {
  res.render('pages/home',{text12:'hy'});
});
const userRouter =require('./routes/users');
app.use('/users',userRouter)
const port = 4000;





// app.get('/home', (req, res) => {
//   res.render('homepage');
// });
// app.get('/contact', (req, res) => {
//   res.render('contact_us');
// });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});