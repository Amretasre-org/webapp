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

    // User.hasMany(Assignment, {
    //     foreignKey: 'userId', // This is the foreign key in the Assignment table that links to the User table
    //     onDelete: 'CASCADE', // If you delete a user, also delete their assignments
    //     onUpdate: 'CASCADE', // If you update a user's ID, also update their assignments
    //   });

    // User.associate = (models) => {
    //     User.hasMany(models.Assignment, {
    //         foreignKey: 'userId', // The foreign key in the Assignments table
    //         as: 'assignments', // Alias for the association
    //         sourceKey: 'id'
    //     });
    // };

    return User;

}