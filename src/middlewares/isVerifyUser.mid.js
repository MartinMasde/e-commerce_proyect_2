// import User from '../data/mongo/models/user.model.js'
import { readByEmail } from '../data/mongo/managers/users.manager.js'

// Middleware para verificar si ya existe el usuario cuando lo quiero crear
async function isVerifyUser(req, res, next) {
    try {
        const { email } = req.body
        const user = await readByEmail(email) 
        if (user) {
            const error = "USER ALREADY EXISTS"
            error.statusCode = 400
            throw error
        }
        return next() 
    } catch (error) {
        return next(error)
    } 
}

export default isVerifyUser