var express = require('express');
var router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const localStrategy = require('passport-local');


/* GET home page. */
passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/profile',isLoggedIn,function(req, res) {
  res.render('profile');
});



router.post('/register',function(req,res){
  var userdata = new userModel({
    username: req.body.username,
    secret: req.body.secret
  });
  userModel.register(userdata,req.body.password)
  .then(function(registereduser){
    passport.authenticate("local")(req,res,function(){
      res.render('profile');
    })
  })

  
})

router.post('/login',passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/",
  }),function(req, res) {});
  
  router.get('/logout',function(req,res,next){
  req.logout(function(err){
    if(err) return next(err);
    res.redirect("/");
  })
  })

  function isLoggedIn(req,res,next){
   if(req.isAuthenticated())
   return next();
  res.redirect("/");
  }
/*
router.get('/create',async function(req,res){
  let userdata = await userModel.create({
  username:"harshi",
  nickname:"harshiiiiiiiii",
  description:"Hello everyone",
  categories:['fashion','life','science']
  
    })
    res.send(userdata);
})
/*
in this we can find on basis of particular length of a field in the database.
router.get('/find',async function(req,res){
  
  let user = await userModel.find({
    $expr :{
      $and:[
        {$gte: [{$strLenCP : '$nickname'},13]},
        {$lte: [{$strLenCP : '$nickname'},122]}
      ]
    }
  });
  res.send(user);
})
/*
find if a category exists in schema or not , no matter if it is empty or not , just it needs to exist 
in schema
router.get('/find',async function(req,res){
  
  let user = await userModel.find({categories: {$exists:true } });
  res.send(user);
})
/*
search based on specific range of date
router.get('/find',async function(req,res){
   var date1 = new Date('2024-02-04');
   var date2 = new Date('2024-02-05');
   let user = await userModel.find({datecreated: {$gte:date1 , $lte:date2 } });
   res.send(user);
})
/*
case insensitive search
router.get('/find',async function(req,res){
  var regex = new RegExp("^NiTesh$","i")
  let user = await userModel.find({username:regex } });
  res.send(user);
})
search on basis of array field contains all of a set of values
router.get('/find',async function(req,res){
  
  let user = await userModel.find({categories: {$all :['fashion','life'] } });
  res.send(user);
})
/*
router.get('/failed', function(req, res) {
  req.flash("age",12);
  req.flash("name","mohan");
  res.send("ban gaya bhai");
});
router.get('/check', function(req, res) {
 console.log(req.flash("age"),req.flash("name"));
 res.send("check krlo backend k terminal pr")
});*/
module.exports = router;
