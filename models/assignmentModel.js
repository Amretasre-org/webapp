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
            type: DataTypes.DATE,
            allowNull: false
        },
        assignment_created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue:  DataTypes.NOW
        },
        assignment_updated: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue:  DataTypes.NOW
        }
    },
        { tableName: 'assignments', timestamps: false }
    );

    return Assignment;

}