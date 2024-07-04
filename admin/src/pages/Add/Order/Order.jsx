import { useState, useEffect } from "react";
import "./Order.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../../assets/assets";

const Order = () => {
  const url = "http://localhost:4000";

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllOrder = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    setIsLoading(true);
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: newStatus,
      });
      if (response.data.success) {
        await fetchAllOrder();
        toast.success("Order status updated successfully");
      } else {
        toast.error("Error updating order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrder();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order) => (
          <div key={order._id} className="order-item">
            <img src={assets.parcel_icon} alt="Parcel Icon" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, index) =>
                  index === order.items.length - 1
                    ? `${item.name}x${item.quantity}`
                    : `${item.name}x${item.quantity}, `
                )}
              </p>
              <p className="order-item-name">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.street + ","}</p>
                <p>
                  {order.address.city +
                    ", " +
                    order.address.state +
                    ", " +
                    order.address.country +
                    ", " +
                    order.address.zipcode +
                    ","}
                </p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>${order.amount}</p>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              disabled={isLoading}
            >
              <option value="Food Processing"> Food Processing</option>
              <option value="Out for delivery"> Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
