var User = require('../models/user')


exports.checkUserLogged = (req,res,next) => {
  if(req.session && req.session.userId) {
    next()
  } else {
    req.flash('info', 'You need to login first');
    res.redirect('/articles/login');
  }
}

exports.loggedUserInfo = (req,res,next) => {
  if(req.session && req.session.userId){
    User.findById(req.session.userId,(err,user)=>{
      if(err) return next(err)
      req.user = user
      res.locals.user = user;
      next()
    })
  } else{
    req.user = null;
    res.locals.user = null;
    next();
  }
}