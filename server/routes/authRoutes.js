import express from 'express';
import verifyToken  from '../middleware/authMiddleware.js';
import { signup, login } from '../controllers/authController.js';
const router = express.Router();


//route for signup 
router.post('/signup', signup);
router.post('/login', login);

// Protected route example
router.get("/profile", verifyToken, (req, res) => {
    res.json({
        success : true,
        message : "Protected route accessed successfully",
        user : req.user,
    });
});

export default router;



