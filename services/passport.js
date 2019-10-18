
/**
 * The Passport service.
 * 
 * @aouther : nasser niazy (nasservb@gmail.com)
 * @created : 18 Oct 2019
 * autehnticate requests.
 */

 const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const redis = require('redis');

const bcrypt = require('bcryptjs');

const util = require('util');
const keys = require('../config/keys');

const User = mongoose.model('User');

passport.serializeUser((_user, done) => { 
  done(null, _user.id);
});

passport.deserializeUser((id, done) => { 
  User.findById(id).then(_user => {
    done(null, _user);
  });
});

passport.use(
  new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password'
    },   (email, password, done) => {
      
      User.findOne({ email: email }, function (err, user) {
 
        if (err) { return done(err); }
        
        if (!user) { return done(null, false); }
 
        if (!bcrypt.compareSync(password, user.password)) { return done(null, false); }
         
        return done(null, user);
      });
          
    })
  );


 passport.use( 
  new BearerStrategy(
      async (accessToken, callBack ) => {
 
        const client = redis.createClient(keys.redisUrl);
        client.hget = util.promisify(client.hget);
  
        const cacheValue = await client.hget('user',accessToken );
 

        var userData = null ; 
        // If we do, return that
 

        if (cacheValue) {
          userData = JSON.parse(cacheValue); 
        }
        else {
          //read from mongos
           
          userData=await User.findOne({ api_token: accessToken});

          client.hset = util.promisify(client.hset);                
                                   
          await client.hset('user', accessToken, JSON.stringify(userData), 'EX', 10);
          
        }

        if (!userData) {
        

          callBack(null, false); 


        }else{  
          return callBack(null, userData);
        }
     
    }
  )
);
