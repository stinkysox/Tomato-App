import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);

  const url = "http://localhost:4000/";
  const [token, setToken] = useState("");

  const addToCart = async (itemId) => {
    if (cartItems[itemId] === undefined) {
      // If cartItems[itemId] is undefined, item is not in cart
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      // Item is already in cart, increment its quantity
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    if (token) {
      await axios.post(
        url + "api/cart/add",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const removeFromCart = async (itemId) => {
    console.log(itemId);
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    if (token) {
      await axios.post(
        url + "api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const getTotalCartAmount = () => {
    let total = 0;

    // Iterate over cartItems to calculate total
    for (const itemId in cartItems) {
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

  const fetchFoodList = async () => {
    const response = await axios.get(url + "api/food/list");
    setFoodList(response.data.data);
  };

  const loadCartData = async (token) => {
    const response = await axios.post(
      url + "api/cart/get",
      {},
      { headers: { token } }
    );
    setCartItems(response.data.cartData);
  };
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    setToken,
    token,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
