/**
 * The Authentication api routes.
 * 
 * @aouther : nasser niazy (nasservb@gmail.com)
 * @created : 18 Oct 2019
 * Responds to a authentication requests.
 */

const mongoose = require('mongoose');
const passport = require('passport');

const bcrypt = require('bcryptjs');

const crypto = require('crypto');

const keys = require('../config/keys');

const User = require('../models/User');
const Institution = require('../models/Institution');

const cache = require('../services/cache');
const passport2 = require('../services/passport');



mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });


module.exports = app =>  {
  
  /**
   * sign in user api
   * @param string email
   * @param string password
   * @return json [422| 401| 200]
   */
  app.post('/users/signin',  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {

      if (err) { 
        res.status(422).send(
         {
           status : "fail",
           data : null
         }
        );
     
     }

       if (!user) { 
         res.status(401).send(
          {
            status : "error",
            message : "User not found"
          }
         );
      }


      if (user) {
        res.status(200).send(
          {
            status : "success",
            data : {
                "api_token" : user.api_token
            }
          }
        );  
      }

    })(req, res, next);
  });



  /**
   * create user api
   * @param string domain
   * @param string name
   * @param string email
   * @param string role["studen","academic","administrator"]
   * @return json [422| 400| 200]
   */
  app.post('/users/create',async (req,res)=> {
    //Creates a user and based on the user’s 
    //email domain links them to an institution. Denies creation of a user if their domain does not exist.
    

    const Institution = mongoose.model('Institution');
     
    var institution =null; 
    
    institution =await Institution.findOne({ email_domain: req.body.domain }).cache({key: ''});
 
 
    if (!institution)
      {
          return res.status(400).send(
            {
              status : "error",
              message : "Domain does not exist" 
            }
          );  
      }

      const User = mongoose.model('User');
      oldUser =await User.findOne({ email : req.body.email }).cache({key: ''});
 
 
      if (oldUser)
        {
            return res.status(400).send(
              {
                status : "error",
                message : "User already exist" 
              }
            );  
        }
   

    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(req.body.password, salt);

    const rand = Math.floor(Math.random() * 100000) + 1; 
    const api_token =crypto.createHash('sha1').update(req.body.password + rand).digest('hex');

    const userInfo = {
      name: req.body.name,
      email : req.body.email,
      role : req.body.role  ,
      password: hash, 
      api_token:api_token,
    _institution : institution.id,
    }; 


    try {

      const newUser = new User(userInfo);
      await newUser.save();
    

     res.status(200).send(
         {
           status : "success",
           data : {
               "api_token" : api_token
           }
         }
       );  

    } catch (err) {

      res.status(400).send(
        {
          status : "fail",
          data : err.message
        }
       );
          
    
    }

  });

  
 
 
};