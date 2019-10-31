'use strict';
var bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define(
        'User',
        {
            username: {
                type: DataTypes.STRING,
                unique: true
            },
            password: DataTypes.STRING,
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            insuranceCompany: DataTypes.STRING,
            mechanicShopName: DataTypes.STRING
        },
        {
            hooks: {
                beforeCreate: (user) => {
                    const salt = bcrypt.genSaltSync();
                    user.password = bcrypt.hashSync(user.password, salt);
                },
            }
        }
    );
    User.associate = function (models) {
        // associations can be defined here
        // Post.belongsToMany(Tag, {
        //     through: {
        //       model: ItemTag,
        //       unique: false,
        //       scope: {
        //         taggable: 'post'
        //       }
        //     },
        //     foreignKey: 'taggable_id',
        //     constraints: false
        //   });
        User.hasMany(models.Comment);
        User.belongsToMany(models.Ticket, {
            through: {
                model: 'UserTicket',
                unique: false,
                timestamps: false
                // scope: {
                //     ticketable: 'user'
                // }
            },
            foreignKey: 'ticketId',
            constraints: false
        });
        // User.belongsTo(models.UserType);
    };

    User.prototype.validatePassword = function (password) {
        return bcrypt.compareSync(
            password,
            this.password
        );
    };

    return User;
};

