const express = require('express')
const userController = require('../controllers/users');
const {body} = require('express-validator/check')
const isAuth = require('../middleware/isAuth')
const fs = require('fs')



const router = express.Router()

router.get('/', userController.getSignUp);
router.post('/postSignUp', [
    body('fName', "enter valid name")
        .isLength({min: 3})
        .trim(),
    body('lName')
        .isLength({min: 3})
        .trim()
        .withMessage("please enter last name"),
    body('email', "pleasse enter valid email")
        .isEmail()
        .normalizeEmail(),
    body('password', "password must be of length 5 and alphanumeric")
        .isLength({min: 5})
        .isAlphanumeric()
        .trim(),
    body('cPassword')
        .custom((value, {req})=>{
            if(req.body.password !== value){
                throw new Error("password have to match")
            }
            return true;
        }),
    body('mobile', "enter valid mobile number")
        .isLength({min: 8})
        .isNumeric(),
    body('address', "enter valid address")
        .isLength({min: 5})],
   
        userController.postSignUp);


router.post('/login', [

    body('email')
        .isEmail()
        .normalizeEmail()

], userController.postLogin);

router.get('/login', userController.getLogin)
router.post('/imageUpload', isAuth, userController.postImage)
router.get('/edit/:userId', isAuth, userController.getEditUser)
router.post('/postEditUser', isAuth, [
    body('fName', "enter valid name")
        .isLength({min: 3})
        .trim(),
    body('lName')
        .isLength({min: 3})
        .trim()
        .withMessage("please enter last name"),
    body('email', "pleasse enter valid email")
        .isEmail()
        .normalizeEmail(),
    body('password', "password must be of length 5 and alphanumeric")
        .isLength({min: 5})
        .isAlphanumeric()
        .trim(),
    body('cPassword')
        .custom((value, {req})=>{
            if(req.body.password !== value){
                throw new Error("password have to match")
            }
            return true;
        }),
    body('mobile', "enter valid mobile number")
        .isLength({min: 8})
        .isNumeric(),
    body('address', "enter valid address")
        .isLength({min: 5})], userController.postEditUser)

router.post('/logout', isAuth,  userController.logOut);
router.get("/allUsers", isAuth, userController.allUsers);
router.get("/profile", isAuth, userController.userProfile);
router.post('/delete', isAuth, userController.deleteUser);
router.get("/mail", isAuth, userController.getMail);
router.post("/mail", [
    body('to', "please enter valid email address")
        .isEmail(),
    body('emailBody', "email body should not be empty")
        .not()
        .isEmpty()
], isAuth, userController.postMail);

module.exports = router;