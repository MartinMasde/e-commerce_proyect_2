
import UserService from "./users.service.js";


class SessionService extends UserService {
  constructor() {
    super();
  }

  verifyUser = async (email, verifyCodeFromClient) => {
    // Buscar el usuario por email
    const user = await this.readByEmailService(email);
    try {
      if (!user) {
        console.error("User not found:", email);
        return false; // Usuario no encontrado
      }
      console.log("User found:", user);
      // Comparar códigos de verificación
      const verifyCodeFromDatabase = user.verifyCode;
      if (verifyCodeFromClient === verifyCodeFromDatabase) {
        // Actualizar la base de datos para marcar el email como verificado
        await this.updateService(user._id, {
          // verifyCode: null, // Eliminar el código de verificación
          verify: true, // Marcar el email como verificado
        });
        return true; // Verificación exitosa
      }
      return false; // Códigos no coinciden
    } catch (error) {
      console.error("Error in verification:", error);
      return false;
    }
  };
}

const service = new SessionService();

const { verifyUser } = service;

export { verifyUser };
