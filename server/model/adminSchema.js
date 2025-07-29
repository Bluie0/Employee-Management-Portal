import { DataTypes } from 'sequelize';

export const createAdminModel = async (sequelize) => {
    const Admin = sequelize.define(
        'Admin',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                set(value) {
                    this.setDataValue('email', value.toLowerCase());
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.STRING,
                defaultValue: 'admin',
                allowNull: false,
            },
        },
        {
            timestamps: true,
            tableName: 'admins',
        }
    );

    return Admin;
};
