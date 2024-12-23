import {
  create,
  read,
  update,
  destroy,
} from "../dao/mongo/managers/users.manager.js";

class UserService {
    createService = async (data) => await create(data);
    readService = async () => await read();
    updateService = async (id, data) => await update(id, data);
    destroyService = async (id) => await destroy(id);
}

const service = new UserService();
const { createService, readService, updateService, destroyService } = service;

export { createService, readService, updateService, destroyService };
