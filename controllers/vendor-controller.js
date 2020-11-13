const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const RequestError = require("../middleware/request-error");
const Vendor = require("../models/vendor")


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
    let existingVendor;
    try {
        existingVendor = await Vendor.findOne({email: email});
    } catch (err) {
        const error = new RequestError("Error querying database", 500, err);
        return next(error);
    }
     console.log(existingVendor)
    if (existingVendor) {
        // console.log("in here")
        const error = new RequestError('Vendor exists already, please login instead.', 422);
        req.flash("error","Vendor exists already, please login instead")
        res.redirect("/login")
        return next(error);
    }

    let hashedPassword;
    console.log({name, phone, city, service, email, password, description})
    const saltRounds = 12
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new RequestError('Could not create Vendor, please try again.', 500, err);
        return next(error);
    }
    
    const createdVendor = new Vendor({
    email,
        // image: 'https://win75.herokuapp.com/' + filePath,
        password: hashedPassword,
        name, 
        phone, 
        city, 
        service, 
        description 
    });

    await createdVendor.save();
    let token;
    try {
        token = jwt.sign(
            {VendorId: createdVendor.id, email: createdVendor.email},
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

exports.reg_vendor = reg_vendor