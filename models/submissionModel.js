const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {

    const Submission = sequelize.define("submission", {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: () => uuidv4(),
        },
        assignment_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        user_id : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        submission_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        submission_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        submission_updated: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        attempt_no: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        },
    },
        { tableName: 'submission', timestamps: false }
    );

    return Submission;

}