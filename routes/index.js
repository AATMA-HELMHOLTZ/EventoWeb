require('dotenv').config();
var express = require("express");
var router = express.Router();
const {check} = require('express-validator');
const User = require("../models/user");
const Vendor = require("../models/vendor")

//HOME
router.get("/",function(req, res){
    res.render("index");
});

//SiGNUP form show - USER
router.get("/signup", function(req, res){
    res.render("signup");
});

//signup user
router.post("/signup", function(req, res){
    var name = {name: req.body.name};
    User.register(name, req.body.password, function(err, newUser){
        if(err){
            req.flash("error", err.message)
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Evento " + newUser.username)
            res.redirect("/campgrounds");
        });
    });
});


//Login form show
router.get("/login", function(req, res)
{
    res.render("login")
});


//Login user
router.post('/login', [
    check('email')
        .not()
        .isEmpty(),
    check('password').isLength({min: 6}),

], );

//View Profile
router.get("/profile/:id", function(req, res){
    User.findById(req.params.uid, function(err, foundUser){
        if (err){
            console.log(err)
        } else{
            res.render("profile", {user: foundUser})
        }
    })
});


//Show Vendor Lists
router.get("/list/:vendor", function(req, res){
    Vendor.find({service: req.params.vendor}, function(err, vendors){
        if (err){
            console.log(err)
        } else{
            res.render("vendor_list", {vendors:vendors});
        }
    })
});

//SHOW VENDOR PROFILE
router.get("/show/:vid", function(req, res){
    Vendor.findById(req.params.vid, function(err, vendor){
        if (err){
            console.log(err)
        } else {
            res.render("profile_vendor", {vendor:vendor})
        }
    })
})

//EVENT TEMPLATES
router.get("/template", function(req, res){
    res.render("event_template")
})


//Edit Profile - show form
router.get("/:id/edit",function(req, res){
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
router.post("/vendorsign", vendorController.reg_vendor)

//Logout
router.get("/logout", function(req, res){
    res.render("login" );
});

module.exports = router;