const User = require("./userModel");
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {

    const Assignment = sequelize.define("assignment", {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: () => uuidv4(), 
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