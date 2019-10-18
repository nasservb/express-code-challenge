

module.exports = (req, res, next) => {

    if (req.user) 
        return res.status(400).json(
            {
                status: 'error',
                message: 'You are already logged in'
            });
  
    next();
  };
  