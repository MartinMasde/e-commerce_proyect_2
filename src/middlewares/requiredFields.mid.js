
// Middleware para validar que los campos requeridos esten presentes en el body
async function requiredFields(req, res, next) {
    try {
        const { email, password } = req.body
        if (email && password) {
            return next()
        }
        const message = "MISSING FIELDS"
        return res.status(400).json({ message })
    } catch (error) {
        return next(error)
    }
}

export default requiredFields