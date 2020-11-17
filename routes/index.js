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
const Template = require("../models/template");
const user = require('../models/user');
const vendor = require('../models/vendor');
var multer = require("multer")
const {storage} = require("../cloudinary/index")
var upload = multer({storage});
var moment = require("moment")

//HOME
router.get("/", isLoggedIn, function(req, res){
    res.render("index");
});

//SiGNUP form show - USER
router.get("/signup", function(req, res){
    res.render("signup");
});

//signup user
router.post("/signup", upload.single("image"),function(req, res){
    var obj = {name: req.body.name, username: req.body.username, mobile: req.body.phone, city: req.body.city, img: req.file.path};
    User.register(obj, req.body.password, function(err, newUser){
        if(err){
            req.flash("error", err.message)
            console.log(err);
            return res.render("signup");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Evento, " + newUser.name)
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
    failureFlash : true ,
    successFlash: "Welcome to Evento"
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
          service: 'FastMail', 
          auth: {
            user: 'evento@fastmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.username,
          from: 'evento@fastmail.com',
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
      console.log('error', 'Password reset token is invalid or has expired.')
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
          console.log('error', 'Password reset token is invalid or has expired.')
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
          console.log('error', 'Password dont match.')
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

//View user Profile
router.get("/profile/:id", isLoggedIn,function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if (err){
            console.log(err)
        } else{
            res.render("user_profile", {user: foundUser})
        }
    })
});

//Edit Profile - show form
router.get("/profile/:id/edit", isLoggedIn,function(req, res){
  User.findById(req.params.id, function(err, user){
      res.render("editprofile", {user:user});
   });
});

//Edit Profile - login and put req
router.put("/profile/:id/edit", function(req, res){
  var obj = {
    name: req.body.name,
    mobile: req.body.mobile,
    city: req.body.city
  }
  User.findOneAndUpdate({_id: req.params.id}, obj, function(err, updated){
      if (err){
          console.log(err);
      } else {
        req.flash("success", "Updated profile")
        res.redirect("/profile/" + req.params.id);
      }
  });
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
router.get("/template/:event", isLoggedIn,async function(req, res){
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
    for (let i = 0; i < arr.length; i++) {
        var service = arr[i];
        var t = await Vendor.find({service:service}).sort({"avgStar": -1});
        console.log(t[0])
        vendors.push(t[0])
    }
    var len = arr.length
    res.render("event_template", {vendors:vendors, len : len})
    });
    
//History
router.get("/history/:id", isLoggedIn,async function(req, res){
    var user = await User.findById(req.params.id)
    var orders = user.orders
    orders = orders.reverse()
    res.render("history", {orders:orders})
})

//SignUp as vendor
router.get("/vendorsign", function(req, res){
    res.render("register_vendor");
});

router.post("/mail/:uid/:vid", async function(req, res){
  var user = await User.findById(req.params.uid)
  var vendor = await Vendor.findById(req.params.vid)
  var arr = user["orders"]
  arr.push({"vendor":vendor, "date": moment().format("MMMM Do YYYY, h:mm a")})
  console.log(user)
  user.save()
  var smtpTransport = await nodemailer.createTransport({
    service: "FastMail", 
    auth: {
      user: 'evento@fastmail.com',
      pass: process.env.GMAILPW
    }
  });
  var mailOptions = {
    to: vendor.email,
    from: 'evento@fastmail.com',
    subject: 'Evento Event Enquiry',
    text: 'You are receiving this because ' + user.name + ' has requested for a callback from the website.\n\n' +
    'Please find the details of the user below:\n\n' +
    'Name: '+ user.name + '\nEmail: ' + user.username + '\nMobile Number: ' + user.mobile +
    '\nThank you for using Evento.',
  };
  await smtpTransport.sendMail(mailOptions, function(err) {
    console.log('mail sent');
    req.flash('success', 'An e-mail has been sent to ' + vendor.name + '.\nPlease wait for them to contact you');
    res.redirect("back")
  }); 
})

router.post("/rate/:uid/:vid", isLoggedIn,async function(req, res){
  let vendor = await Vendor.findById(req.params.vid)
  let user = await User.findById(req.params.uid)
  console.log(req.body.description)
  var obj = {
    "author": user, 
    "desc": req.body.description,   
    "star": req.body.star,
    "date": moment().format("MMMM Do YYYY, h:mm a")
  }
  var sum = 0
  vendor.ratings.push(obj)
  vendor.ratings.forEach(o =>{
    var temp = parseInt(o.star) || 0
    sum += temp
  })
  console.log(sum)
  vendor.avgStar = (sum / vendor.ratings.length).toFixed(1)
  vendor.save()
  console.log(vendor.ratings)
  req.flash("success", "Added rating succesfully")
  res.redirect("back")
})

router.post("/vendorsign", upload.array("images", 3),function(req, res){
    console.log(req.files.map(f => (f.path))) 
    var serv = req.body.service.toLowerCase()
    var newVendor = {
        name: req.body.name,
        number: req.body.phone,
        email: req.body.email, 
        service: serv,
        city: req.body.city,
        images : req.files.map(f => (f.path)),
        description: req.body.desc, 
        minPrice : req.body.minPrice
    }
    Vendor.create(newVendor, function(err, newVend){
        if(err){
            console.log(err)
        }
        else{
            console.log("created" + newVend)
            req.flash("success", "Created vendor.")
            res.redirect("/")
        }
    })
})

router.get("/support", isLoggedIn,function(req, res){
  res.render("support")
})

//LOGOUT
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/login");
});

module.exports = router;