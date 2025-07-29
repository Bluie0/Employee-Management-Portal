import express from 'express';
import { getAllEmp, addEmp, updateEmp, deleteEmp } from '../controller/UserController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all employee routes with authentication
router.use(authenticateToken);

// Employee management routes
router.get('/getAll', getAllEmp);
router.post('/addEmp', addEmp);
router.put('/emp/:employeeId', updateEmp);
router.delete('/deleteEmp/:employeeId', deleteEmp);

export default router;
