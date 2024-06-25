import mongoose from "mongoose";

export const conntectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://tarsinterstellar010:ApGojush3u6uIo2c@cluster0.hrod5ba.mongodb.net/food-del"
    )
    .then(() => console.log("DB conntected"));
};
