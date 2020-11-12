require('dotenv').config();
var express = require("express");
var router = express.Router();
const {check} = require('express-validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const Vendor = require("../models/vendor")
const RequestError = require("../middleware/request-error");
const vendor = require('../models/vendor');

const validationResult = require("express-validator").validationResult;
const signUp = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let params = "";
        errors.array().forEach((e) => {
            params += `${e.param}, `
        });
        params += "triggered the error!!";
        return next(
            new RequestError(params, 422)
        );
    }
    const {email, password} = req.body.user;
    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
    } catch (err) {
        const error = new RequestError("Error querying database", 500, err);
        return next(error);
    }
     console.log(existingUser)
    if (existingUser) {
        // console.log("in here")
        const error = new RequestError('User exists already, please login instead.', 422);
        req.flash("error","User exists already, please login instead")
        res.redirect("/login")
        return next(error);
    }

    let hashedPassword;
     console.log(email)
    console.log(password)
    const saltRounds = 12
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new RequestError('Could not create user, please try again.', 500, err);
        return next(error);
    }
    
    const createdUser = new User({
    email,
        // image: 'https://win75.herokuapp.com/' + filePath,
        password: hashedPassword
    });

    await createdUser.save();
    let token;
    try {
        token = jwt.sign(
            {userId: createdUser.id, email: createdUser.email},
            process.env.Jwt_Key, {
                expiresIn: '2d' // expires in 2d
            }
        );
    } catch (err) {
        const error = new RequestError('Signing up failed, please try again later.', 500, err);
        return next(error);
    }

    await res.status(201);
    await res.redirect("/");
}

const reg_vendor = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let params = "";
        errors.array().forEach((e) => {
            params += `${e.param}, `
        });
        params += "triggered the error!!";
        return next(
            new RequestError(params, 422)
        );
    }
    const {name, phone, city, service, email, password, description} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
    } catch (err) {
        const error = new RequestError("Error querying database", 500, err);
        return next(error);
    }
     console.log(existingUser)
    if (existingUser) {
        // console.log("in here")
        const error = new RequestError('User exists already, please login instead.', 422);
        req.flash("error","User exists already, please login instead")
        res.redirect("/login")
        return next(error);
    }

    let hashedPassword;
    console.log({name, phone, city, service, email, password, description})
    const saltRounds = 12
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new RequestError('Could not create user, please try again.', 500, err);
        return next(error);
    }
    
    const createdUser = new User({
    email,
        // image: 'https://win75.herokuapp.com/' + filePath,
        password: hashedPassword,
        name, 
        phone, 
        city, 
        service, 
        description 
    });

    await createdUser.save();
    let token;
    try {
        token = jwt.sign(
            {userId: createdUser.id, email: createdUser.email},
            process.env.Jwt_Key, {
                expiresIn: '2d' // expires in 2d
            }
        );
    } catch (err) {
        const error = new RequestError('Signing up failed, please try again later.', 500, err);
        return next(error);
    }

    await res.status(201);
    await res.redirect("/");
}

const login = async (req, res, next) => {

    const {email, password} = req.body;
    console.log(req.body)
    console.log({email, password})
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let params = "";
        errors.array().forEach((e) => {
            params += `${e.param}, `
        });
        params += "triggered the error!!";
        return next(
            new RequestError(params, 422)
        );
    }
    let existingUser;

    try {
        existingUser = await User.findOne({email: email});
    } catch (err) {
        const error = new RequestError(
            err.message,
            500
        );
        return next(error);
    }

    if (!existingUser) {
        const error = new RequestError(
            'You are not registered!!!',
            403
        );
        return next(error);
        // res.json(
        //     {error: error, existingUser}
        // );
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new RequestError(
            'Could not log you in, please check your credentials and try again.',
            500
        );
        return next(error);
    }

    if (!isValidPassword) {
        const error = new RequestError(
            'Incorrect password entered.',
            403
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            {userId: existingUser.id, email: existingUser.email,},
            process.env.JWT_KEY,
        );
    } catch (err) {
        const error = new RequestError(
            'Logging in failed, please try again later.',
            500
        );
        return next(error);
    }

    const existingUserObj = existingUser.toObject();
    // Delete password from local existingUser variable to avoid sending it to the User.
    delete existingUserObj.password;
    await res.redirect("/");
};

//HOME
router.get("/", function(req, res){
    res.render("index");
});

//SiGNUP form show - USER
router.get("/signup", function(req, res){
    res.render("signup");
});

//signup user
router.post('/signup',signUp);

//Login form show
router.get("/login", function(req, res)
{
    res.render("login")
});
module.exports = router;

//Login user
router.post('/login', [
    check('email')
        .not()
        .isEmpty(),
    check('password').isLength({min: 6}),

], login);

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

router.get("/show/:vid", function(req, res){
    Vendor.findById(req.params.vid, function(err, vendor){
        if (err){
            console.log(err)
        } else {
            res.render("profile_vendor", {vendor:vendor})
        }
    })
})

router.get("/template", function(req, res){
    res.render("event_template")
})
//Edit Profile
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
    res.render("register_vendor" );
});

//Register the vendor
router.post("/vendorsign", reg_vendor)

//Logout
router.get("/logout", function(req, res){
    res.render("login" );
});