/**
 * The test routes.
 * 
 * @aouther : nasser niazy (nasservb@gmail.com)
 * @created : 18 Oct 2019
 * Responds to a test api request.
 * 
 * create test institution
 * /institution/create.
 * 
 * create test book
 * /book/create
 */

const mongoose = require('mongoose');
const passport = require('passport');

const bcrypt = require('bcryptjs');

const crypto = require('crypto');

const keys = require('../config/keys');

const User = require('../models/User');
const Institution = require('../models/Institution');
const Book = require('../models/Book');

const cache = require('../services/cache');
const passport2 = require('../services/passport');



mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });


module.exports = app =>  {
 
  /**
   * craeate test institution
   * @param string name
   * @param string url
   * @param string domain
   * @return json [200]
   */
  app.post('/institution/create',  async (req, res, next) => {
    const Institution = mongoose.model('Institution');
 
    const institution = new Institution({
      name: req.body.name,
      url: req.body.url,
      email_domain:req.body.domain
    });

    cache.clearHash('');

    await institution.save();
    res.status(200).send(
      {
        status : "success",
        data : {
            "institution" : institution.id
        }
      }
    );  
  });

 
  /**
   * craeate test book
   * @param string name
   * @param string url
   * @param string domain
   * @return json [400|200]
   */
  app.post('/book/create',async (req,res)=> {
    

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
 
 
    
    const bookInfo = {
      isbn: req.body.isbn,
      title: req.body.title,
      author : req.body.author,
      _institution:institution.id,
    }; 

    const Book = mongoose.model('Book');
    cache.clearHash('');
    try {

      const newBook = new Book(bookInfo);
      await newBook.save();
    

     res.status(200).send(
         {
           status : "success",
           data : {
               "book" : newBook.id
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