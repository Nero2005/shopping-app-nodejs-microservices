import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";

const APP_SECRET = process.env.JWT_SECRET;

// Utility functions

export const generateSalt = async () => {
  return await bcrypt.genSalt();
};

export const generatePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

export const validatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await generatePassword(enteredPassword, salt)) === savedPassword;
};

export const generateSignature = async (payload) => {
  return await jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
};

export const validateSignature = async (req) => {
  const signature = req.get("Authorization");

  console.log(signature);

  if (signature) {
    const payload = await jwt.verify(signature, APP_SECRET);
    req.user = payload;
    return true;
  }
  return false;
};

export const formatData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

export const publishCustomerEvents = async (payload) => {
  axios.post("http://localhost:8000/customer/app-events", {
    payload,
  });
};

export const publishShoppingEvents = async (payload) => {
  axios.post("http://localhost:8000/shopping/app-events", {
    payload,
  });
};
