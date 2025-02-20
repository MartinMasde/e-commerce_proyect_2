// import {
//   create,
//   read,
//   update,
//   destroy,
// } from "../dao/mongo/managers/carts.manager.js";

// SI NO UTILIZAMOS LA CAPA REPOSITORY

// import dao from "../dao/index.factory.js";
// const { CartsManager } = dao;

// class CartsService {
//   createService = async (data) =>  await CartsManager.create(data); 
//   readService = async (user_id) => await CartsManager.read( { user_id });
//   updateService = async (id, data) => await CartsManager.update(id, data);
//   destroyService = async (id) => await CartsManager.destroy(id);
// }

// export default CartsService;        OJOOOOOOOOOOOOOOOOOO

// SI UTILIZAMOS LA CAPA REPOSITORY

import { createRepository, readRepository, updateRepository, destroyRepository } from "../repository/carts.repository.js";

class CartsService {
  createService = async (data) => await createRepository(data);
  readService = async (user_id) => await readRepository({ user_id });
  updateService = async (id, data) => await updateRepository(id, data);
  destroyService = async (id) => await destroyRepository(id);
}

const service = new CartsService();
const { createService, readService, updateService, destroyService } = service;
export { createService, readService, updateService, destroyService };

// async function createService(data) {
//   const response = await CartsManager.create(data);
//   return response;
// }

// async function readService(user_id) {
//   const response = await CartsManager.read({ user_id });
//   return response;
// }

// async function updateService(id, data) {
//   const response = await CartsManager.update(id, data);
//   return response;
// }

// async function destroyService(id) {
//   const response = await CartsManager.destroy(id);
//   return response;
// }

// export { createService, readService, updateService, destroyService };
