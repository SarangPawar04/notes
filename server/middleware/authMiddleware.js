import jwt from 'jsonwebtoken';

//middleware function
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        //const authHeader = req.headers.authorization;

       /* if(!authHeader){
            return res.status(401).json({success : false, message : "No token provided"});
        }*/

        //const token = authHeader.split(" ")[1];

        if(!token){
            return res.status(401).json({success : false, message : "unauthorized access"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }

    catch (error){
        console.error("JWT verification failed:", error);
        return res.status(401).json({success : false, message : "invalid or expired token"});
    }
};

export default verifyToken;