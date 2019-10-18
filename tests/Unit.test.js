const mongoose = require('mongoose');
const passport = require('passport');

const bcrypt = require('bcryptjs');

const crypto = require('crypto');

const keys = require('../config/keys');

const User = require('../models/User');
const Institution = require('../models/Institution');

const cache = require('../services/cache');
const passport2 = require('../services/passport');




test('sign in user success',async()=>{
    
    const api_token = await prepareLoginData();

    userData = {'email':'nasser@gmail.com','password':'12345678'};

    const response = await  request.post('http://localhost:3000/users/signin',userData)
        .expect(200)
        .expect(res.body.data.api_token).toBe(api_token);
});


test('sign in user faile',async()=>{
    
     
    userData = {'email':'r@gm.com','password':'2343448'};

    const response = await  request.post('http://localhost:3000/users/signin',userData)
        .expect(401);
});




test('create user success',async()=>{

    const api_token = await prepareRegisterData(); 

    userData = {
            'domain':'test',
            'name':'nasser',
            'role':'student',
            'email':'nasser@gmail.com',
            'password':'2343448'};

    const response = await  request.post('http://localhost:3000/users/create',userData)
        .expect(200)
        .expect(res.body.data.api_token)
        .then(response => {

            user = await User.findOne({email:'nasser@gmail.com'});

            assert(response.body.api_token, user.api_token);
        });
});



test('create user faile Domain not exist',async()=>{

    const Institution = mongoose.model('Institution');

    await Institution.delete({email_domain:'test'});

    userData = {
            'domain':'test',
            'name':'nasser',
            'role':'student',
            'email':'nasser@gmail.com',
            'password':'2343448'};

    const response = await  request.post('http://localhost:3000/users/create',userData)
        .expect(400)
        .expect(res.body.message).toBe("Domain does not exist");
       
});
 

test('create user faile user exist',async()=>{

 
    await prepareLoginData();

    userData = {
            'domain':'test',
            'name':'nasser',
            'role':'student',
            'email':'nasser@gmail.com',
            'password':'2343448'};

    const response = await  request.post('http://localhost:3000/users/create',userData)
        .expect(400)
        .expect(res.body.message).toBe("User already exist");
        
});


 

test('books list success',async()=>{

 
    const api_token =  await prepareLoginData();
    await prepareLoginData();
 
    const response = await  request.get('http://localhost:3000/books')
        .get('/api/incidents')
        .set('Authorization', 'bearer ' + api_token)
        .expect(200)
        .expect('Content-Type', /json/);
        
});


test('books list authentication failed',async()=>{

 
 
    const response = await  request.get('http://localhost:3000/books')
        .get('/api/incidents')
        .set('Authorization', 'bearer test'  )
        .expect(200)
        .expect('Content-Type', /json/);
        
});

async function  prepareBooksData() {
    
    const Institution = mongoose.model('Institution');
    institution =await Institution.findOne({ email_domain: req.body.domain }).cache({key: ''});

    const bookInfo = {
        isbn: '12255555',
        title: 'test',
        author : 'test author',
        _institution:institution.id,
      }; 
  
    const Book = mongoose.model('Book'); 
    const newBook = new Book(bookInfo);
    await newBook.save();

}

async function prepareRegisterData() {
    const User = mongoose.model('User');
    await User.delete({email:'nasser@gmail.com'});


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

}

async function prepareLoginData() {
    const User = mongoose.model('User');
      oldUser =await User.findOne({ email : 'nasser@gmail.com' }).cache({key: ''});
 
      if (oldUser)
        {
            return oldUser.api_token; 

        }
        else 
        {


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


            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(req.body.password, salt);
        
            const rand = Math.floor(Math.random() * 100000) + 1; 
            const api_token =crypto.createHash('sha1').update(req.body.password + rand).digest('hex');

      
            const userInfo = {
                name: 'name',
                email : 'nasser@gmail.com',
                role : 'student'  ,
                password: hash, 
                api_token:api_token,
              _institution : institution.id,
              };  
          
            const newUser = new User(userInfo);
            await newUser.save();

            return api_token;

        }

}