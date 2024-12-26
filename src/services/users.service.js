import {
  create,
  read,
  update,
  destroy,
  readByEmail,
} from "../dao/mongo/managers/users.manager.js";

class UserService {
    createService = async (data) => await create(data);
    readService = async () => await read();
    updateService = async (id, data) => await update(id, data);
    destroyService = async (id) => await destroy(id);
    readByEmailService = async (email) => await readByEmail(email);
}

export default UserService;

const service = new UserService();
const { createService, readService, updateService, destroyService, readByEmailService } = service;

export { createService, readService, updateService, destroyService, readByEmailService };


