// import {
//   create,
//   read,
//   update,
//   destroy,
// } from "../dao/mongo/managers/products.manager.js";


// SI NO UTILIZAMOS LA CAPA REPOSITORY

// import dao from "../dao/index.factory.js";
// import PductsDTO from "../dto/product.dto.js";
// const { ProductsManager } = dao;

// async function createService(data) {
//   data = new ProductsDTO(data);
//   const response = await ProductsManager.create(data);
//   return response;
// }
// async function readService() {
//   const response = await ProductsManager.read();
//   return response;
// }
// async function updateService(id, data) {
//   const response = await ProductsManager.update(id, data);
//   return response;
// }
// async function destroyService(id) {
//   const response = await ProductsManager.destroy(id);
//   return response;
// }

// export { createService, readService, updateService, destroyService };

// SI UTILIZAMOS LA CAPA REPOSITORY

import { createRepository, readRepository, updateRepository, destroyRepository } from "../repository/products.repository.js";

class ProductsService {
  createService = async (data) => await createRepository(data);
  readService = async (user_id) => await readRepository({ user_id });
  updateService = async (id, data) => await updateRepository(id, data);
  destroyService = async (id) => await destroyRepository(id);
}

const service = new ProductsService();
const { createService, readService, updateService, destroyService } = service;
export { createService, readService, updateService, destroyService }
