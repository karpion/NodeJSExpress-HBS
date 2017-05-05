var express = require('express');
var router = express.Router();
var models = require('../models');
var reminders = require('../views/includes/reminders');


/* GET home page. */
router.get('/', function (req, res, next) {
    var page_data = {
        title: 'מערכת ניהול תזכורות',
        reminders: reminders.reminders,
        success: req.session.success,
        user:{
            id: req.session.user_id
        },
        errors: req.session.errors
    };
    res.render('index', {page_data: page_data});
    req.session.success = null;
    if (!req.session.user_id) {
        req.session.user_id = null;
    }
    req.session.errors = null;
});

router.post('/submit', function (req, res, next) {
    // Check validity
    req.check('email', 'דוא"ל לא תקין').isEmail();
    req.check('password', 'סיסמא לא תקינה').isLength({min: 1});//.equals(req.body.confirmPassword);

    var errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
    } else {
        var User = models.User;
        User.findOne({
            where:{
                email: req.body.email
            }
        }).then(function(user){
            if(user){
                if(user.password == req.body.password){
                    req.session.user_id = user.id;
                    req.session.name = user.name;
                    req.session.is_admin = user.is_admin;
                    req.session.errors = null;
                }else{
                    req.session.errors = [{ msg: 'הסיסמא שגויה.'}];
                    req.session.user_id = null;
                }
            }else{
                req.session.errors = [{ msg: 'כתובת הדוא"ל לא נמצאה במערכת.'}];
                req.session.user_id = null;
            }
            res.redirect('/');
        });
    }
});

router.get('/signOut', function (req, res, next) {
    req.session.success = null;
    req.session.errors = null;
    req.session.user_id = null;
    req.session.name = null;
    res.redirect('/');

});

/*
 router.get('/test/:id', function(req, res, next){
 res.render('test', {output: req.params.id});
 });

 router.post('/test/submit/', function(req, res, next){
 var id = req.body.id;
 res.redirect('/test/' + id);
 });
 */
module.exports = router;
