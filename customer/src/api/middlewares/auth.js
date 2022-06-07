import { validateSignature } from "../../utils/index.js";

export const authToken = async (req, res, next) => {
  const isAuthorized = await validateSignature(req);

  if (isAuthorized) {
    return next();
  }
  return res.status(403).json({ message: "Not Authorized" });
};
