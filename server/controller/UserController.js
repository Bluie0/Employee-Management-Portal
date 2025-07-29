import { UserModel } from '../postgres/postgres.js';
import { Op } from 'sequelize';

export const getAllEmp = async (req, res) => {  
    try {
        const users = await UserModel.findAll();
        if (users.length === 0) {
            return res.status(200).json({ "message": "No users found" });
        }
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error in getAllEmp:', error);
        return res.status(500).json({ "error": "Internal server error" });
    } 
};

export const addEmp = async (req, res) => {
    try {
        console.log('Request body:', req.body); // Debug log
        
        const { employeeId, username, email, designation, phonenumber } = req.body;

        // Validate required fields
        if (!employeeId || !username || !email || !designation || !phonenumber) {
            return res.status(400).json({ 
                error: "All fields are required: employeeId, username, email, designation, phonenumber" 
            });
        }

        // Additional validation
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ error: "Please provide a valid email address" });
        }

        if (!/^\d{10}$/.test(phonenumber)) {
            return res.status(400).json({ error: "Phone number must be exactly 10 digits" });
        }

        // Check if employee already exists
        const existingEmp = await UserModel.findOne({ where: { employeeId } });
        
        if (existingEmp) {
            return res.status(409).json({ message: "Employee already exists" });
        }

        // Check for duplicate email or phone
        const duplicateCheck = await UserModel.findOne({
            where: {
                [Op.or]: [
                    { email: email.toLowerCase() },
                    { phonenumber }
                ]
            }
        });

        if (duplicateCheck) {
            return res.status(409).json({ 
                error: "Employee with this email or phone number already exists" 
            });
        }

        // Create new employee
        const newEmployee = await UserModel.create({
            employeeId,
            username,
            email: email.toLowerCase(),
            designation,
            phonenumber
        });

        console.log('Employee created successfully:', newEmployee.id); // Debug log

        return res.status(201).json({ 
            message: "Employee created successfully",
            employee: {
                id: newEmployee.id,
                employeeId: newEmployee.employeeId,
                username: newEmployee.username,
                email: newEmployee.email,
                designation: newEmployee.designation,
                phonenumber: newEmployee.phonenumber
            }
        });

    } catch (error) {
        console.error('Detailed error in addEmp:', error);
        
        // Handle specific Sequelize errors
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ 
                error: "Employee with this ID, email, or phone number already exists" 
            });
        }
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                error: "Validation error: " + error.errors.map(e => e.message).join(', ')
            });
        }
        
        return res.status(500).json({ error: "Failed to create employee" });
    }
};

export const updateEmp = async (req, res) => {
    const employeeId = req.params.employeeId;
    const updateData = req.body;

    if (!employeeId) {
        return res.status(400).json({ error: "Employee ID is required" });
    }

    try {
        const emp = await UserModel.findOne({ where: { employeeId } });
        if (!emp) {
            return res.status(404).json({ message: "Employee not found" });
        }
        
        // Remove employeeId from update data to prevent changing it
        delete updateData.employeeId;
        
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "No update data provided" });
        }

        // Validate email if it's being updated
        if (updateData.email && !/\S+@\S+\.\S+/.test(updateData.email)) {
            return res.status(400).json({ error: "Please provide a valid email address" });
        }

        // Validate phone number if it's being updated
        if (updateData.phonenumber && !/^\d{10}$/.test(updateData.phonenumber)) {
            return res.status(400).json({ error: "Phone number must be exactly 10 digits" });
        }

        // Check for duplicate email or phone (excluding current employee)
        if (updateData.email || updateData.phonenumber) {
            const duplicateCheck = await UserModel.findOne({
                where: {
                    [Op.and]: [
                        { employeeId: { [Op.ne]: employeeId } }, // Exclude current employee
                        {
                            [Op.or]: [
                                updateData.email ? { email: updateData.email.toLowerCase() } : null,
                                updateData.phonenumber ? { phonenumber: updateData.phonenumber } : null
                            ].filter(Boolean)
                        }
                    ]
                }
            });

            if (duplicateCheck) {
                return res.status(409).json({ 
                    error: "Another employee with this email or phone number already exists" 
                });
            }
        }

        // Convert email to lowercase if provided
        if (updateData.email) {
            updateData.email = updateData.email.toLowerCase();
        }

        await emp.update(updateData);
        const updatedEmp = await UserModel.findOne({ where: { employeeId } });
        
        return res.status(200).json({ 
            message: "Employee updated successfully", 
            data: updatedEmp 
        });
    } catch (error) {
        console.error('Error in updateEmp:', error);
        
        // Handle specific Sequelize errors
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ 
                error: "Employee with this email or phone number already exists" 
            });
        }
        
        return res.status(500).json({ error: "Failed to update employee" });
    }
};

export const deleteEmp = async (req, res) => {
    const employeeId = req.params.employeeId;

    if (!employeeId) {
        return res.status(400).json({ error: "Employee ID is required" });
    }

    try {
        const emp = await UserModel.findOne({ where: { employeeId } });
        if (!emp) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Store employee data before deletion for logging
        const employeeData = {
            id: emp.id,
            employeeId: emp.employeeId,
            username: emp.username,
            email: emp.email,
            designation: emp.designation
        };

        await emp.destroy();

        console.log('Employee deleted successfully:', employeeData);

        return res.status(200).json({ 
            message: "Employee deleted successfully",
            deletedEmployee: employeeData
        });
    } catch (error) {
        console.error('Error in deleteEmp:', error);
        return res.status(500).json({ error: "Failed to delete employee" });
    }
};

