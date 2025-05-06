import jwt from 'jsonwebtoken';

export const isLoggedIn = async(req, res, next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({success: false, message:"Invalid token or No token provided"})
    }

    const token = authHeader.split(" ")[1]; 
    
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
            if(err){
                return res.status(403).json({success: false, message:"Invalid token"})
            } else {
                req.user = decoded;
                console.log('Decoded JWT Payload:', decoded);
                next();
            } 
        })
    } else{
        res.status(401).json({success: false, message:"You are not authorized"})
    }
}

// export const requirePermissions = (...roles)=>{
//     return (req, res, next)=>{
//         if(!roles.includes(req.user.role)){
//             return res.status(403).json({success: false, message: 'Unauthorized to access this route'})
//         }
//         next()
//     }
// }

/**
 * Middleware to restrict access based on roles.
 * @param {...string} roles - Allowed roles (e.g., "tenant", "landlord").
 * @returns {Function} - Express middleware function.
 */
export const requirePermissions = (...roles) => {
    return (req, res, next) => {
        // Ensure req.user is populated (from JWT auth middleware)
        if (!req.user || !req.user.role) {
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized: No user data found.' 
            });
        }

        // Check if user's role is allowed
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `Unauthorized: ${req.user.role} cannot access this route.` 
            });
        }

        next();
    };
};