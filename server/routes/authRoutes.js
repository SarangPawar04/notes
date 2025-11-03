import express from 'express';
import verifyToken  from '../middleware/authMiddleware.js';
import { signup, login, forgotPassword, resetPassword } from '../controllers/authController.js';
const router = express.Router();



//route for signup 
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);

// Protected route example
router.get("/profile", verifyToken, (req, res) => {
    res.json({
        success : true,
        message : "Protected route accessed successfully",
        user : req.user,
    });
});

export default router;



