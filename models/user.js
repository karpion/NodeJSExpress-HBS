"use strict";

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User",
        {
            name: DataTypes.STRING,
            phone: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            is_admin: DataTypes.BOOLEAN,
            business_name: DataTypes.STRING,
            business_city: DataTypes.STRING,
            business_street: DataTypes.STRING,
            business_house_num: DataTypes.STRING,
            business_lng: DataTypes.DOUBLE,
            business_lat: DataTypes.DOUBLE
        });


    return User;
};