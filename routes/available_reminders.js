var express = require('express');
var router = express.Router();
var reminders = require('../views/includes/reminders');

/* GET reminders list page. */
router.get('/', function (req, res, next) {

    if (!req.session.user_id) {
        res.redirect('/');
    } else {
        var page_data = {
            title: 'מערכת ניהול תזכורות',
            page_title: 'תזכורות זמינות',
            reminders: reminders.reminders,
            user: {
                id: req.session.user_id,
                is_admin: req.session.is_admin
            }
        };
        res.render('available_reminders', {page_data: page_data});
        req.session.success = null;
        if (!req.session.user_id) {
            req.session.user_id = null;
        }
    }
    req.session.errors = null;
});

module.exports = router;
