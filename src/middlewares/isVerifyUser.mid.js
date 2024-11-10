import User from '../data/mongo/models/user.model.js'
// Middleware para verificar si ya existe el usuario cuando lo quiero crear
async function isVerifyUser(req, res, next) {
    try {
        const { email } = req.body
        const user = await User.findOne({ email }) 
        if (user) {
            const message = "USER ALREADY EXISTS"
            return res.status(400).json({ message })
        }
        return next() 
    }
    catch (error) {
        return next(error)
    } 
}

export default isVerifyUser