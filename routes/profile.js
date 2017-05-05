var express = require('express');
var request = require('request');
var router = express.Router();
var cities = require('../views/includes/cities');
var models = require('../models');

/* GET profile page. */
router.get('/', function (req, res, next) {

    var disabled_text = null, page_title = 'הרשמה למערכת';
    var page_data = {
        title: 'מערכת ניהול תזכורות',
        page_title : page_title,
        user: null,
        cities: cities.cities,
        editable: disabled_text,
        errors: req.session.errors
    };

    if (req.session.user_id){

        var User = models.User;
        User.findOne({
            where:{
                id: req.session.user_id
            }
        }).then(function (user) {
            if(user){
                disabled_text = 'disabled="disabled"';
                page_title = 'עריכת פרטים';
                page_data.page_title = page_title;
                page_data.editable = disabled_text;
                page_data.user = user;
                req.session.errors = null;
            }

            res.render('profile', {page_data: page_data});
        });
    }else{
        req.session.user_id = null;
        req.session.errors = null;
        res.render('profile', {page_data: page_data});
    }



});

router.post('/Submit', function (req, res, next) {

    var User = models.User;
    User.findOne({
        where:{
            email: req.body.email
        }
    }).then(function (user) {
        if(user){
            // email found in db, check if user id in db match the user id in the session.
            if(req.session.user_id && req.session.user_id == user.id){
                // User match, edit the details
                // Before creating/editing the user, try to retrieve long and lat from google api
                var paramStr = req.body.street + '+' + req.body.house_number + '+' + req.body.city;
                paramStr = paramStr.replace(/[ \t]/g, '+');

                var request = require('request');
                var propertiesObject = { address: paramStr };

                request({url:'http://maps.google.com/maps/api/geocode/json', qs:propertiesObject}, function(err, response, body) {
                    var lat = '', lng = '';
                    if(err) {
                        console.log(err);
                    }else{
                        var location = JSON.parse(body);
                        lat = location.results[0].geometry.location.lat;
                        lng = location.results[0].geometry.location.lng
                    }

                    user.updateAttributes({
                        name: req.body.name,
                        phone: req.body.phone,
                        email: req.body.email,
                        password: req.body.password,
                        business_name: req.body.business_name,
                        business_city: req.body.city,
                        business_street: req.body.street,
                        business_house_num: req.body.house_number,
                        business_lat: lat,
                        business_lng: lng
                    }).then(function(){
                        req.session.errors = null;
                        res.redirect('/profile');
                    });
                });

            }else{
                // user doesn't match, alert the user.
                req.session.errors = [{ msg: 'הדוא"ל שהזנת קיים כבר במערכת.'}];
                res.redirect('/profile');
            }



        }else{
            // Before creating/editing the user, try to retrieve long and lat from google api
            var paramStr = req.body.street + '+' + req.body.house_number + '+' + req.body.city;
            paramStr = paramStr.replace(/[ \t]/g, '+');

            var request = require('request');
            var propertiesObject = { address: paramStr };

            request({url:'http://maps.google.com/maps/api/geocode/json', qs:propertiesObject}, function(err, response, body) {
                var lat = '', lng = '';
                if(err) {
                    console.log(err);
                }else{
                    var location = JSON.parse(body);
                    lat = location.results[0].geometry.location.lat;
                    lng = location.results[0].geometry.location.lng
                }

                User.create({
                    name: req.body.name,
                    phone: req.body.phone,
                    email: req.body.email,
                    password: req.body.password,
                    business_name: req.body.business_name,
                    business_city: req.body.city,
                    business_street: req.body.street,
                    business_house_num: req.body.house_number,
                    business_lat: lat,
                    business_lng: lng
                }).then(function (user) {
                    req.session.user_id = user.id;
                    req.session.name = user.name;
                    req.session.errors = null;

                    res.redirect('/profile');
                });
            });
        }
    });
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
