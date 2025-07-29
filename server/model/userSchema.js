import { DataTypes } from 'sequelize';

export const createUserModel = async (sequelize) => {
    const User = sequelize.define(
        'User', // Model name (internal reference)
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                set(value) {
                    this.setDataValue('email', value.toLowerCase());
                },
            },
            designation: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phonenumber: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isNumeric: true,
                    len: [10],
                },
            },
            employeeId: {
                type: DataTypes.STRING,
                autoIncrement: false,
                allowNull: false,
                unique: true,
            },
        },
        {
            timestamps: false,
            tableName: 'users', // Explicitly set the table name to 'users'
        }
    );

    return User;
};