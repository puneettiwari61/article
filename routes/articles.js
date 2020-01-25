var express = require('express');
var router = express.Router();
var Article = require('../models/article')
var Comment = require('../models/comments')
var User = require('../models/user')
var middleware = require('../modules/middleware') 

/* GET users listing. */
router.get('/', function(req, res, next) {
  var msg = req.flash('info')[0] || null;
  Article.find()
  .sort({createdAt: -1})
  .populate('author','username')
  .exec((err,articles) => {
    if(err) return next(err)
    res.render('articles',{articles,msg})
  })
});





router.post('/create',middleware.checkUserLogged, (req,res,next) => {
  req.body.author = req.session.userId
  Article.create(req.body,(err,createdArticle) => {
    if(err) return next(err);
    console.log(createdArticle)
    res.redirect('/articles');
  })
})

// router.get('/:id/read',(req,res,next) => {
//   Article.findById(req.params.id,(err,article) => {
//     if(err) return next(err);
//     Comment.find({article:req.params.id},(err,comment)=>{
//     res.render('read',{article,comment})
//     })
//   })
// })

router.get('/:id/read',(req,res,next) => {
  Article
  .findById(req.params.id)
  .populate('comments','comment')
  .exec((err, article)=>{
    if(err) return next(err);
    // console.log(article)
    res.render('read',{article})    
  })
})


//delete
router.get('/:id/delete',middleware.checkUserLogged,(req,res,next) => {
  Article.findById(req.params.id,(err,article)=>{
    if(err) return next(err);
    if(article.author == req.session.userId){
      article.remove((err,removedArticle) => {
        if(err) return(next(err));
        res.redirect('/articles');
      })
    } else {
      req.flash('info','you cannot delete someone else article');
      res.redirect('/articles');
    }
  })
})

//update

router.get('/:id/edit',middleware.checkUserLogged,(req,res,next)=> {
  Article.findById(req.params.id,(err,article) => {
    if(err) return next(err);
    if(article.author == req.session.userId){
      res.render('edit',{article})
    } else {
      req.flash('info','you cannot edit someone else article');
      res.redirect('/articles');
    }
  })
})

router.post('/:id/edit',(req,res,next)=> {
  Article.findByIdAndUpdate(req.params.id,req.body,(err,article) => {
    if(err) return next(err);
    res.redirect('/articles')
  })
})

//likes

router.get('/:id/likes',middleware.checkUserLogged,(req,res,next) => {
  Article.findOneAndUpdate({_id :req.params.id}, {$inc : {'likes' : 1}},{new: true },(err,updated)=>{
    if(err) return next(err);
    res.redirect('/articles')
  });
})

//comments
router.post('/:id/comments',middleware.checkUserLogged,(req,res,next) => {
  req.body.article = req.params.id
  req.body.author = req.session.userId;
  Comment.create(req.body,(err,createdComment)=>{
    if(err) return next(err);
    Article.findByIdAndUpdate(req.params.id,{$push:{comments:createdComment._id}},(err,updated) => {
      if(err) return next(err);
      res.redirect(`/articles/${req.params.id}/read`)
    })
  });
})


//create 
router.get('/create',middleware.checkUserLogged,(req,res,next) => {
  res.render('create')
})


// register

router.get('/register', (req,res,next) =>{
  res.render('registeration')
})


router.post('/register',(req,res,next) => {
  User.create(req.body,(err,createdUser) => {
    if(err) return next(err)
    res.redirect('/articles')
  })
})

//login

router.get('/login',(req,res,next) => {
  var msg = req.flash('info')[0];
  res.render('login',{msg});
})

router.post('/login',(req,res,next) => {
  console.log(req.session)
  User.findOne({email:req.body.email}, (err,user) => {
    // console.log(user,err)
    if(err) return next(err);
    if(!user) return res.render('login');
    req.session.userId = user.id
    var validation = user.verifyPassword(req.body.password,user.password)
    validation?(res.redirect('/articles')):(res.send('incorrect details'));
  })
})

//logout

router.get('/logout',(req,res,next) => {
  req.session.destroy(function(err){  
    if(err){  
        console.log(err);  
    }  
    else  
    {  
        res.redirect('/articles');  
    } 
})})

module.exports = router;
