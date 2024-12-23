import {
  create,
  read,
  update,
  destroy,
} from "../dao/mongo/managers/products.manager.js";

async function createService(data) {
  const response = await create(data);
  return response;
}
async function readService() {
  const response = await read();
  return response;
}
async function updateService(id, data) {
  const response = await update(id, data);
  return response;
}
async function destroyService(id) {
  const response = await destroy(id);
  return response;
}

export { createService, readService, updateService, destroyService };
