import mongoose from "mongoose";

//  Make Schemas
const subscriptionSchema = new mongoose.Schema({
  stockId: String,
});
const usersSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  tradingViewUsername: String,
  refferal: String,
  subscribedStocks: [subscriptionSchema],
});

const stocksSchema = new mongoose.Schema({
  stockName: String,
  stockTicker: String,
  description: String,
  averageSwingLength: String,
  averageProfitsLoss: String,
  signalHistory: [
    {
      date: Date,
      signal: String,
      price: String,
    },
  ],
});

// usersSchema.path("email").index({ unique: true });

const Stocks = new mongoose.model("stocks", stocksSchema);
const Users = new mongoose.model("users", usersSchema);

export { Stocks, Users };
