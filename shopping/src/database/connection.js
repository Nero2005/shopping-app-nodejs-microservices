import "dotenv/config";
import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    console.log(process.env.NODE_ENV == "dev");
    if (process.env.NODE_ENV == "dev") {
      console.log(process.env.NODE_ENV);
      await mongoose.connect(process.env.SHOPPING_APP_DB);
    }
    else if (process.env.NODE_ENV == "test") {
      console.log(process.env.NODE_ENV);
      await mongoose.connect(process.env.TESTING_DB);
    }
    console.log("Database connection successful");
  } catch (error) {
    console.log("Error ==========");
    console.log(error);
    process.exit(1);
  }
};
//useNewUrlParser: true,
//useUnifiedTopology: true,
//useCreateIndex: true,   }) 