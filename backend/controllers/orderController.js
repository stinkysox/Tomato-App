import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Function to place an order
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    // Create a new order document based on the orderModel schema
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    // Save the new order document to MongoDB
    await newOrder.save();

    // Clear the user's cart after placing the order
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Prepare line items for Stripe checkout session
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100 * 80, // Adjust this calculation based on your needs
      },
      quantity: item.quantity,
    }));

    // Add delivery charge as a separate line item
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100 * 80, // Adjust this calculation based on your needs
      },
      quantity: 1,
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    // Return the session URL to the frontend
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error placing order:", error);
    res
      .status(500)
      .json({ success: false, message: "Error placing the order." });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log("Error");
    res.json({ success: false, message: "Error" });
  }
};

//user orders for front end

const userOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// listing orders for admin pannel

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error(error); // Use console.error for errors
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching orders",
    });
  }
};

// api for updating order status

const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, listOrders, userOrder, updateStatus };
