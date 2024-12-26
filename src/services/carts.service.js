import {
  create,
  read,
  update,
  destroy,
} from "../dao/mongo/managers/carts.manager.js";

class CartsService {
  createService = async (data) =>  await create(data); 
  readService = async (user_id) => await read( { user_id });
  updateService = async (id, data) => await update(id, data);
  destroyService = async (id) => await destroy(id);
}

export default CartsService;

const service = new CartsService();
const { createService, readService, updateService, destroyService } = service;

export { createService, readService, updateService, destroyService };

// async function createService(data) {
//   const response = await create(data);
//   return response;
// }

// async function readService(user_id) {
//   const response = await read({ user_id });
//   return response;
// }

// async function updateService(id, data) {
//   const response = await update(id, data);
//   return response;
// }

// async function destroyService(id) {
//   const response = await destroy(id);
//   return response;
// }

// export { createService, readService, updateService, destroyService };
