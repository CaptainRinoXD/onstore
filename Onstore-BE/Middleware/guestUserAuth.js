const { v4: uuidv4 } = require('uuid');
const validateAccessToken = require('./arthorizeToken');

const guestUserAuth = async (req, res, next) => {
    try {
        if (!req.cookies.refreshToken && !req.cookies.guestId) {
            const guestId = uuidv4();
            res.cookie('guestId', guestId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });
            req.guestId = guestId;
        } else if(req.cookies.guestId && !req.cookies.refreshToken){
            req.guestId = req.cookies.guestId;
            //console.log(req.guestId);
        }
        
        next();
    } catch (error) {
        console.error("error in guestUserAuth middleware:");
        res.status(500).json({ message: error});
    }
};

module.exports = guestUserAuth;