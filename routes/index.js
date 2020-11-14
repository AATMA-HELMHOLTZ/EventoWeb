require('dotenv').config();
var express = require("express");
var router = express.Router();
const {check} = require('express-validator');
const User = require("../models/user");
const Vendor = require("../models/vendor")
const passport = require("passport");
const { isLoggedIn } = require('../middleware');

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
    failureFlash : true
}), function(req, res){
});

//View Profile
router.get("/profile/:id", isLoggedIn,function(req, res){
    User.findById(req.params.uid, function(err, foundUser){
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
router.get("/template", isLoggedIn, function(req, res){
    res.render("event_template")
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


//Register the vendor
router.post("/vendorsign", function(req, res){

})

//LOGOUT
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/login");
});


module.exports = router;