"use strict";

module.exports = function(sequelize, DataTypes) {
    var Subscriber = sequelize.define("Subscriber",
        {
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            vehicle_number: DataTypes.STRING,
            plate_number: DataTypes.STRING,
            phone: DataTypes.STRING,
            user_id: DataTypes.INTEGER
        });

    return Subscriber;
};