import { createContext, useState } from "react";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItem] = useState({});

  const addToCart = (itemId) => {
    console.log(itemId);
    if (cartItems[itemId] === undefined) {
      // If cartItems[itemId] is undefined, item is not in cart
      setCartItem((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      // Item is already in cart, increment its quantity
      setCartItem((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  const removeFromCart = (itemid) => {
    setCartItem((prev) => ({ ...prev, [itemid]: prev[itemid] - 1 }));
  };

  const getTotalCartAmount = () => {
    let total = 0;

    // Iterate over cartItems to calculate total
    for (const itemId in cartItems) {
      console.log(itemId);
      const quantity = cartItems[itemId];
      if (quantity > 0) {
        const itemInfo = food_list.find((product) => product._id === itemId);
        if (itemInfo) {
          total += itemInfo.price * quantity;
        }
      }
    }

    return total;
  };

  const contextValue = {
    food_list,
    cartItems,
    setCartItem,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
  };

  console.log(cartItems);
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
