const Assignment = require('./assignmentModel');

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("User", {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false, // Disable timestamps for this model
    });

    // User.associate = (models) => {
    //     User.hasMany(models.Assignment, {
    //         foreignKey: 'userId', // The foreign key in the Assignments table
    //         as: 'assignments', // Alias for the association
    //         sourceKey: 'id'
    //     });
    // };

    return User;

}