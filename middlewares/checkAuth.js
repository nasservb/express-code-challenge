const passport = require('passport');


module.exports = (req, res, next) => {

  if (! passport.authenticate('bearer', { session: false })) {
    return res.status(401).send(
      { 
        status: 'error' ,
        message: 'You must log in!' ,

    });
  }

  next();
};
