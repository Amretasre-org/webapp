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
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        deadline: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    // Assignment.associate = (models) => {
    //     Assignment.belongsTo(models.User, {
    //         foreignKey: 'userId', 
    //         as: 'user', 
    //         targetKey: 'id'
    //     });
    // };

    return Assignment;

}