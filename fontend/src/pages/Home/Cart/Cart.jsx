import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../../Context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { food_list, cartItems, removeFromCart, getTotalCartAmount, url } =
    useContext(StoreContext);

  const navigate = useNavigate();

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          const quantity = cartItems[item._id];
          // Checking if the item with that id in cartItems exists and is greater than zero
          // If it exists and the quantity is greater than zero, we are rendering the details of that particular item (filter)
          if (quantity > 0) {
            return (
              <React.Fragment key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={`${url}images/${item.image}`} alt={item.name} />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className="cross">
                    x
                  </p>
                </div>
                <hr />
              </React.Fragment>
            );
          }
          return null; // Return null if the item doesn't meet the condition
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery fee</p>
              <p>${getTotalCartAmount() > 0 ? 2 : 0}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>${getTotalCartAmount() > 0 ? getTotalCartAmount() + 2 : 0}</p>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>
            Proceed To Check Out
          </button>
        </div>
        <div className="cart-promo-code">
          <div>
            <p>If you have a promo code enter it here</p>
            <div className="cart-promo-code-input">
              <input type="text" placeholder="promo code" />
              <button>Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
