# Express Coding Challenge
The premise of this challenge is to see the approach you take to:
- Use an ORM to interact with a simple database model
- Create a basic routing mechanism for HTTP requests
- Authenticate a user’s access to a route
- Respond to a request in a consistent and logical manner
- Test your work with both unit tests and integration tests.

Please clone this repository and send through your completed coding challenge using whatever you feel fit. We'll take a look and then have a chat about the decisions you took and challenges you encountered. Thanks for taking the time.

## Challenge
1. Use [Sequelize](http://docs.sequelizejs.com/manual/installation/getting-started) or [Mongoose](https://mongoosejs.com/) to define:

   1.1. A **`User`** model which should have basic identifying information:
      - Name
      - Email address
      - Role (Acceptable entries: ‘student’, ‘academic’, ‘administrator’)
      - Password.

   1.2. An **`Institution`** model which stores information about a school:
      - Name
      - URL
      - Email domain.
      
   1.3. A **`Book`** model which stores information about books:
      - ISBN
      - Title
      - Author.
      
   1.4. Relationships between **`Users`** and **`Institutions`**, and **`Books`** and **`Institutions`** (Consider #4.3 in the relationships you create).
2. Use [Express](https://expressjs.com/) to respond to requests.
3. Create a test suite which includes code coverage, to unit and integration test the routes you’ve created.
4. Create routes:

    4.1 `POST /users/signin` Use the passport library to authenticate a user and respond with a successful message that uses the [JSend](https://labs.omniti.com/labs/jsend) framework
    
    4.2 `POST /users/create` Creates a user and based on the user’s email domain links them to an institution. Denies creation of a user if their domain does not exist.
    
    4.3 `GET /books` Once authenticated, responds with a JSON object containing a list of Books that the user has access to via their Institution.
5. (Optional) Provide a [Postman](https://www.getpostman.com/) collection which performs some basically functionality on the routes you've created.

## Things to keep in mind
- Security
- Scalability
- Consistency
- Testing.

## Running this application
You can run the application by typing:
`npm install` followed by `npm start` 

## The structure of this repository
The structure of this repository should be relatively self-explanatory. 
Use the appropriate directory for your code. A basic example has been provided for the index route.