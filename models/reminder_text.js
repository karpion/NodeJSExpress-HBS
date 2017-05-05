"use strict";

module.exports = function(sequelize, DataTypes) {
    var Reminder_text = sequelize.define("Reminder_text",
        {
            title: DataTypes.STRING,
            text: DataTypes.TEXT,
            owner_id: DataTypes.INTEGER
        });

    return Reminder_text;
};