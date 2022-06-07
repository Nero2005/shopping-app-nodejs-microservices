import { ProductRepo } from "../database/index.js";
import { formatData } from "../utils/index.js";
import { APIError } from "../utils/app-errors.js";

export class ProductService {
  static async createProduct(productInputs) {
    try {
      const productResult = await ProductRepo.createProduct(productInputs);
      return formatData(productResult);
    } catch (err) {
      console.log(err);
      throw new APIError("Data Not found");
    }
  }

  static async getProducts() {
    try {
      const products = await ProductRepo.products();

      let categories = {};

      products.map(({ type }) => {
        categories[type] = type;
      });

      return formatData({
        products,
        categories: Object.keys(categories),
      });
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  static async getProductDescription(productId) {
    try {
      const product = await ProductRepo.findById(productId);
      return formatData(product);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  static async getProductsByCategory(category) {
    try {
      const products = await ProductRepo.findByCategory(category);
      return formatData(products);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  static async getSelectedProducts(selectedIds) {
    try {
      const products = await ProductRepo.findSelectedProducts(selectedIds);
      return formatData(products);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  static async getProductById(productId) {
    try {
      return await ProductRepo.findById(productId);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  static async getProductPayload(userId, { productId, qty }, event) {
    const product = await ProductRepo.findById(productId);

    if (product) {
      const payload = {
        event,
        data: { userId, product, qty },
      };
      return formatData(payload);
    } else {
      return formatData({ error: "No product available" });
    }
  }
}
