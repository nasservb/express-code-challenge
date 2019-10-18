/**
 * The book routes.
 * 
 * @aouther : nasser niazy (nasservb@gmail.com)
 * @created : 18 Oct 2019
 * Responds to a book api request.
 */
const mongoose = require('mongoose');
const passport = require('passport');

const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });


const Book = require('../models/Book');  

const checkAuth = require('../middlewares/checkAuth');
const cache = require('../services/cache');
 
const passport2 = require('../services/passport'); 

module.exports = app =>  {
  
  /**
   * get book list 
   * @header bearer token
   * @return json [401| 200]
   */
  app.get('/books', async (req,res)=> {
      passport.authenticate('bearer', { session: false }, async function(err, user, info) {
        
        if (!user){ 
          return  res.status(400).send(
            {
              status : "error",
              message : "Unauthorized" 
            }
          );  
        }
  

    // Once authenticated, responds with a JSON object containing a list of
    // Books that the user has access to via their Institution.
  
 
    const Book = mongoose.model('Book');
    
    var ObjectId = require('mongoose').Types.ObjectId; 
 
    /**
     * add cache parameter for auto cache query use redis
     */
    const books =await Book.find({_institution:new ObjectId(user._institution)}).cache({
      key: user.id
    });

 
    res.status(200).send(
              {
                status : "success",
                data :  books                
              }
            );  
    
  })(req, res);
});

};