import { response } from "express";
import { createService, readService, updateService, destroyService,} from "../services/products.service.js";

async function createProduct(req, res) {
  const data = req.body;
  const message = "PRODUCT CREATED";
  const response = await createService(data);
  return res.json201(response, message);
}

async function readProducts(req, res) {
  const message = "PRODUCTS FOUND";
  const response = await readService();
  if (response.length > 0) {
    return res.json200(response, message);
  }
  return res.json404();
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const data = req.body;
  const message = "PRODUCT UPDATED";
  const response = await updateService(id, data);
  if (response) {
    return res.json200(response, message);
  }
  return res.json404();
}

async function destroyProduct(req, res) {
  const { id } = req.params;
  const message = "PRODUCT DELETED";
  const response = await destroyService(id);
  if (response) {
    return res.json200(response, message);
  }
  return res.json404();
}

export { createProduct, readProducts, updateProduct, destroyProduct };
