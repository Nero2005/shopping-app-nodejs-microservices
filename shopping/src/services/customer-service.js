import { CustomerRepo } from "../database/index.js";
import {
  formatData,
  generatePassword,
  generateSalt,
  generateSignature,
  validatePassword,
} from "../utils/index.js";
import { APIError, BadRequestError } from "../utils/app-errors.js";

export class CustomerService {
  static async signIn(userInputs) {
    const { email, password } = userInputs;
    try {
      const existingCustomer = await CustomerRepo.findCustomer({ email });
      if (existingCustomer) {
        const validPassword = await validatePassword(
          password,
          existingCustomer.password,
          existingCustomer.salt
        );

        if (validPassword) {
          const token = await generateSignature({
            email: existingCustomer.email,
            _id: existingCustomer._id,
          });
          return formatData({ id: existingCustomer._id, token });
        }
      }
      return formatData(null);
    } catch (err) {
      console.log(err);
      throw new APIError("Data Not found", err);
    }
  }
  static async signUp(userInputs) {
    const { email, password, phone } = userInputs;

    try {
      // create salt
      let salt = await generateSalt();

      let userPassword = await generatePassword(password, salt);

      const existingCustomer = await CustomerRepo.createCustomer({
        email,
        password: userPassword,
        phone,
        salt,
      });

      const token = await generateSignature({
        email: email,
        _id: existingCustomer._id,
      });

      return formatData({ id: existingCustomer._id, token });
    } catch (err) {
      console.log(err);
      throw new APIError("Data Not found", err);
    }
  }

  static async addNewAddress(_id, userInputs) {
    const { street, postalCode, city, country } = userInputs;

    try {
      const addressResult = await CustomerRepo.createAddress({
        _id,
        street,
        postalCode,
        city,
        country,
      });
      return formatData(addressResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  static async getProfile(id) {
    try {
      const existingCustomer = await CustomerRepo.findCustomerById({ id });
      return formatData(existingCustomer);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  static async getShoppingDetails(id) {
    try {
      const existingCustomer = await CustomerRepo.findCustomerById({ id });

      if (existingCustomer) {
        return formatData(existingCustomer);
      }
      return formatData({ msg: "Error" });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  static async getWishList(customerId) {
    try {
      const wishListItems = await CustomerRepo.wishlist(customerId);
      return formatData(wishListItems);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  static async addToWishlist(customerId, product) {
    try {
      const wishlistResult = await CustomerRepo.addWishlistItem(
        customerId,
        product
      );
      return formatData(wishlistResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  static async manageCart(customerId, product, qty, isRemove) {
    try {
      const cartResult = await CustomerRepo.AddCartItem(
        customerId,
        product,
        qty,
        isRemove
      );
      return formatData(cartResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  static async manageOrder(customerId, order) {
    try {
      const orderResult = await CustomerRepo.addOrderToProfile(
        customerId,
        order
      );
      return formatData(orderResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  static async subscribeEvents(payload) {
    const { event, data } = payload;

    const { userId, product, order, qty } = data;

    switch (event) {
      case "ADD_TO_WISHLIST":
      case "REMOVE_FROM_WISHLIST":
        this.addToWishlist(userId, product);
        break;
      case "ADD_TO_CART":
        this.manageCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.manageCart(userId, product, qty, true);
        break;
      case "CREATE_ORDER":
        this.manageOrder(userId, order);
        break;
      default:
        break;
    }
  }
}
