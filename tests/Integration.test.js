const mongoose = require('mongoose');
const passport = require('passport');

const bcrypt = require('bcryptjs');

const crypto = require('crypto');

const keys = require('../config/keys');

const User = require('../models/User');
const Institution = require('../models/Institution');

const cache = require('../services/cache');
const passport2 = require('../services/passport');


describe('Athentication API Integration Tests',async  function() {
    describe('#Post /user/signin',async  function() { 
      
        it('when user not exist,expect user creation successfull',async function(done) { 
        
        await  prepareData();
         
        userData = {
            'domain':'test',
            'name':'nasser',
            'role':'student',
            'email':'testuser@gmail.com',
            'password':'2343448'
        };
        const response = await  request.post('http://localhost:3000/users/signin',userData)
            .expect(401);

        request(app).post('user/signin')
          .end(function(err, res) { 
              if (res.status == 400 && res.body. == "User not found")
              {

                request(app).post('user/create',userData)
                    .end(function(err, res) { 
                        expect(res.status).to.equal(200); 
                        .expect(res.body.data.api_token) 
                        done();
                });

              }
            
          }); 
      });


      it('when user alraedy exist,expect user creation failed',async function(done) { 
        
        await  prepareData();
         
        userData = {
            'domain':'test',
            'name':'nasser',
            'role':'student',
            'email':'testuser@gmail.com',
            'password':'2343448'
        };
        const response = await  request.post('http://localhost:3000/users/signin',userData)
            .expect(401);

        request(app).post('user/signin')
          .end(function(err, res) { 
              if (res.status == 200  )
              {

                request(app).post('user/create',userData)
                    .end(function(err, res) { 
                        expect(res.status).to.equal(400); 
                        .expect(res.body.message).to.equal("User already exist") 
                        done();
                });

              }
            
          }); 
      });



    });
  });


  describe('Book API Integration Tests',async  function() {
    describe('#Get /books',async  function() { 
      it('when user not exist,expect books list not unauthorized',async function(done) { 
        
        await User.delete({email:'nasser@gmail.com'});
         
        userData = {
            'domain':'test',
            'name':'nasser',
            'role':'student',
            'email':'testuser@gmail.com',
            'password':'2343448'
        };
        const response = await  request.post('http://localhost:3000/users/signin',userData)
            .expect(401);

        request(app).post('user/signin')
          .end(function(err, res) { 
              if (res.status == 400 && res.body. == "User not found")
              {

                request(app).get('books',userData)
                    .end(function(err, res) { 
                        expect(res.status).to.equal(401); 
                        done();
                });

              }
            
          }); 
      });

  
async function prepareData() {
    
    const Institution = mongoose.model('Institution');
    
    var institution =null; 
    
    institution =await Institution.findOne({ email_domain: req.body.domain }).cache({key: ''});


    if (!institution)
    {
        institution = new Institution({
            name: 'test',
            url: 'test.com',
            email_domain:'test'
            });
        institution.save();
    }
});