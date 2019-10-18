const express = require('express');
const app = express();


const keys = require('./config/keys');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
  }));
 
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session()); 

  require('./routes/test')(app); 
  require('./routes/auth')(app); 
  require('./routes/book')(app); 
 

app.listen(3000, () => {
    console.log(`Open http://localhost:3000 to see a response.`);
    }
    );