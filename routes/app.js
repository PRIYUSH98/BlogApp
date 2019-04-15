 var firebase=require("firebase");
var express = require('express');
var router = express.Router();

var config = {
    apiKey: "AIzaSyBKHani6cvGzioMpsIwxneDJqnou2n86iw",
    authDomain: "blogingapp-b4e82.firebaseapp.com",
    databaseURL: "https://blogingapp-b4e82.firebaseio.com",
    projectId: "blogingapp-b4e82",
    storageBucket: "blogingapp-b4e82.appspot.com",
    messagingSenderId: "1017670379184"
  };
  firebase.initializeApp(config);

  var database=firebase.database();
   var  ref =database.ref('newdata')
router.get('/', function (req, res, next) {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user){
         a=1;
        }

            else
            a=0;

            res.render('index',{a:a});

        
    })

});

router.get('/login', function (req, res, next) {
    res.render('login');
});


router.get('/logout', function (req, res, next) {

    firebase.auth().signOut().then(function() {
        console.log("siccess")
        localStorage.clear();

        // Sign-out successful.
      }).catch(function(error) {
        console.log("fail")

        // An error happened.
      });

    res.redirect('/');
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

        router.get('/blogs', function (req, res, next) {

            // name=req.body.name;
           // image=req.body.image;
           // describe=req.body.describe;
         
           var  ref =database.ref('newdata')
           ref.on('value',gotdata,errdata);
         
           function gotdata(newdata){
             //   console.log(data.val())
             var info = newdata.val()
             var keys = Object.keys(info)
             console.log(keys)
           //   var par={
           //    name=info.name,
           //    image=info.image,
           //    describe=info.describe
           //   }
           var name=[]
           var image=[]
           var describe=[]
           // var kid=[]
             for( var i= 0;i<keys.length;i++)
             {
               var k = keys[i];
               name.push(info[k].name);
                  image.push(info[k].image);
                  describe.push(info[k].describe);
       
             }
             res.render('blogs',{name:name,image:image,describe:describe});
           }
           function errdata(error){
             console.log(error)
         }
       });

    }
    else
    {

        console.log("please login")
        
        router.get('/index2', function (req, res, next) {
            res.render('index2');
        })
    
    }

            
    //     });
    // console.log("please login")
    // }

  })




// router.post('/blogs', function (req, res, next) {
    
// });

router.get('/newblog', function (req, res, next) {
    res.render('newblog');
    
});

router.post('/newblog', function (req, res, next) {
    name=req.body.name;
    image=req.body.image;
    describe=req.body.describe;
  
    var newdata ={
        name:name,
        image:image,
        describe:describe
    }
  
    ref.push(newdata);
    res.render('blogs');
    
});

router.get('/blogs/:id', function (req, res, next) {
   

    var  ref =database.ref('newdata')
    ref.on('value',gotdata,errdata);
  
    function gotdata(newdata){
      //   console.log(data.val())
      var info = newdata.val()
      var keys = Object.keys(info)
      console.log(keys)
    //   var par={
    //    name=info.name,
    //    image=info.image,
    //    describe=info.describe
    //   }
    var name=[]
    var image=[]
    var describe=[]
    // var kid=[]
      for( var i= 0;i<keys.length;i++)
      {
        var k = keys[i];
        name.push(info[k].name);
           image.push(info[k].image);
           describe.push(info[k].describe);

      }
       res.render("info",{id:req.params.id,name:name,image:image,describe:describe});
    }
    function errdata(error){
        console.log(error)
    }
});



router.post('/login', function (req, res, next) {

    username=req.body.username;
    password=req.body.password;
    firebase.auth().signInWithEmailAndPassword(username, password)
    .then(
        // respone => window.location = 'home.ejs'
        respone => res.redirect("/blogs")
    )
    .catch(
        error => res.redirect("/signup")
        // res.redirect("/home")

    )
});

router.get('/signup', function (req, res, next) {
    res.render('signup');
});


router.post('/signup', function (req, res, next) {
    username=req.body.username;
    password=req.body.password;

    firebase.auth().createUserWithEmailAndPassword(username,password).catch(function(error) {
        // Handle Errors here.
         var errorCode = error.code;
         var errorMessage = error.message;
        // ...
        console.log(errorMessage);
      });

    res.render('login');
});



  

// router.get('/message/:msg', function (req, res, next) {
//     res.render('node', {message: req.params.msg});
// });

// router.post('/message', function(req, res, next) {
//     var message = req.body.message;
//     res.redirect('/message/' + message);
// });

module.exports = router;
