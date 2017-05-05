"use strict";

module.exports = function(sequelize, DataTypes) {
    var Reminder = sequelize.define("Reminder",
        {
            phone: DataTypes.STRING,
            user_id: DataTypes.INTEGER,
            subscriber_id: DataTypes.INTEGER,
            reminder_text_id: DataTypes.INTEGER,
            first_reminder_date: DataTypes.DATEONLY,
            interval: DataTypes.INTEGER
        });

    return Reminder;
};