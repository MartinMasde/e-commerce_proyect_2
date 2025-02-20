// import {
//   create,
//   read,
//   update,
//   destroy,
//   readByEmail,
// } from "../dao/mongo/managers/users.manager.js";

// ESTA FORMA ES EN CASO DE NO UTILIZAR LA CAPA REPOSITORY

// import dao from "../dao/index.factory.js";
// const { UsersManager } = dao;

// class UserService {
//     createService = async (data) => await UsersManager.create(data);
//     readService = async () => await UsersManager.read();
//     updateService = async (id, data) => await UsersManager.update(id, data);
//     destroyService = async (id) => await UsersManager.destroy(id);
//     readByEmailService = async (email) => await UsersManager.readByEmail(email);
// }

// ESTA FORMA ES SI UTILIZAMOS LA CAPA REPOSITORY

import { createRepository, readRepository, updateRepository, destroyRepository, readByEmail} from "../repository/users.repository.js";

class UsersService {
  createService = async (data) => await createRepository(data);
  readService = async (user_id) => await readRepository({ user_id });
  updateService = async (id, data) => await updateRepository(id, data);
  destroyService = async (id) => await destroyRepository(id);
  readByEmailService = async (email) => await readByEmail(email);
}

export default UsersService;

const service = new UsersService();
const { createService, readService, updateService, destroyService} = service;
export { createService, readService, updateService, destroyService};


