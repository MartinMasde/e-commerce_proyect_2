// import UserService from './users.service.js';

// class SessionService {
//     constructor() {
//         this.service = new UserService();
//     }
//     verify = async (email, verifyCodeFromClient) => {
//         const user = await this.service.readByEmailService(email);
//         const verifyCodeFromDatabase = user.verifyCode;
//         if (verifyCodeFromClient === verifyCodeFromDatabase) {
//             return true;
//         }
//         return false;
//     }
// }

// const service = new SessionService();
// const { verify } = service;

// export { verify };

// import { UserService } from './users.service.js';

// import UserService from './users.service.js';

// class SessionService extends UserService {
//   constructor() {
//     this.service = new UserService();
//   }

//   verify = async (email, verifyCodeFromClient) => {
//     try {
//       // Buscar el usuario por email
//       const user = await this.service.readByEmailService(email);

//       // Si no se encuentra el usuario, devolver false
//       if (!user) {
//         return false;
//       }

//       // Comparar códigos de verificación
//       const verifyCodeFromDatabase = user.verifyCode;
//       if (verifyCodeFromClient === verifyCodeFromDatabase) {
//         // Actualizar la base de datos para marcar el email como verificado
//         await this.service.updateService(user._id, {
//           verifyCode: null, // Eliminar el código de verificación
//           verify: true, // Marcar el email como verificado
//         });
//         return true; // Verificación exitosa
//       }

//       return false; // Códigos no coinciden
//     } catch (error) {
//       console.error("Error in verification:", error);
//       return false;
//     }
//   };
// }

// const service = new SessionService();
// const { verify } = service;

// export { verify };

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
