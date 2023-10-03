const User = require("./userModel");

module.exports = (sequelize, DataTypes) => {

    const Assignment = sequelize.define("assignment", {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        points: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        num_of_attempts: {
            type: DataTypes.STRING,
            allowNull: false
        },
        deadline: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Assignment.associate = (models) => {
        Assignment.belongsTo(models.User, {
            foreignKey: 'userId', // The foreign key in the Assignments table
            as: 'user', // Alias for the association
            targetKey: 'id'
        });
    };

    // Assignment.belongsTo(User, {
    //     foreignKey: 'userId',
    //     onDelete: 'CASCADE',
    //     onUpdate: 'CASCADE',
    //   });

    return Assignment;

}