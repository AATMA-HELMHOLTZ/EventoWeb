require('dotenv').config();
var express = require("express");
var router = express.Router();
const {check} = require('express-validator');
const User = require("../models/user");
const Vendor = require("../models/vendor")
const passport = require("passport");
const { isLoggedIn } = require('../middleware');
const async = require("async")
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const Template = require("../models/template")

//HOME
router.get("/", isLoggedIn, function(req, res){
    res.render("index");
});

//SiGNUP form show - USER
router.get("/signup", function(req, res){
    res.render("signup");
});

//signup user
router.post("/signup", function(req, res){
    var obj = {name: req.body.name, username: req.body.username, mobile: req.body.phone, city: req.body.city};
    User.register(obj, req.body.password, function(err, newUser){
        if(err){
            req.flash("error", err.message)
            console.log(err);
            return res.render("signup");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Evento " + newUser.name)
            res.redirect("/");
        });
    });
});


//Login form show
router.get("/login", function(req, res){
    res.render("login")
});


//Login user
router.post("/login", passport.authenticate("local",{
    successRedirect: "/", 
    failureRedirect: "/login",
    // failureFlash : true, 
    // successFlash: "Welcome to Evento"
}), function(req, res){
    
});

// forgot password
router.get('/forgot', function(req, res) {
    res.render('forgot');
  });
  
router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ username: req.body.username }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'webeventohelp@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.username,
          from: 'webeventohelp@gmail.com',
          subject: 'Evento Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.username + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });
  
  router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });
  
  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'learntocodeinfo@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.username,
          from: 'learntocodeinfo@mail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.username + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/');
    });
  });

//View Profile
router.get("/profile/:id", isLoggedIn,function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if (err){
            console.log(err)
        } else{
            res.render("profile", {user: foundUser})
        }
    })
});


//Show Vendor Lists
router.get("/list/:vendor", isLoggedIn, function(req, res){
    Vendor.find({service: req.params.vendor}, function(err, vendors){
        if (err){
            console.log(err)
        } else{
            res.render("vendor_list", {vendors:vendors});
        }
    })
});

//SHOW VENDOR PROFILE
router.get("/show/:vid", isLoggedIn, function(req, res){
    Vendor.findById(req.params.vid, function(err, vendor){
        if (err){
            console.log(err)
        } else {
            res.render("profile_vendor", {vendor:vendor})
        }
    })
})

//EVENT TEMPLATES
router.get("/template/:event", async function(req, res){
    var temp = await Template.find({});
    var event = req.params.event
    // console.log(typeof(e))  
    //console.log(temp[0])
    var vendors = [];
    var reqd = temp[0]
    var arr = []
    if (event == "birthday") {
        arr = reqd["birthday"]
    } else if (event == "anniversary"){
        arr = reqd["anniversary"]
    } else if (event == "farewell"){
        arr = reqd["farewell"]
    } else if (event == "festive"){
        arr = reqd["festive"]
    } else if (event == "tedx"){
        arr = reqd["tedx"]
    }
    console.log(arr)
    arr.forEach(service => {
        var t = Vendor.find({service:service}).sort({"avgStar": -1});
        console.log(t[0])
        vendors.append(t[0])
    });
    res.render("event_template", {})
})


//Edit Profile - show form
router.get("/:id/edit", isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, user){
        res.render("edit", {user : user});
    });
});


//Edit Profile - login and put req
router.put("/:id/edit", function(req, res){
    User.findOneAndUpdate({_id: req.params.id}, req.body.user, function(err, updated){
        if (err){
            console.log(err);
        } else {
            res.redirect("/profile/" + req.params.id);
        }
    });
});


//SignUp as vendor
router.get("/vendorsign", function(req, res){
    res.render("register_vendor");
});


// //Register the vendor
// router.post("/vendorsign", function(req, res){
//     var obj = {name: req.body.};

// })

//LOGOUT
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/login");
});


module.exports = router;