import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../Context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const filteredList = food_list.filter(
    (eachItem) => eachItem.category === category
  );

  return (
    <div className="food-display" id="food-display">
      <h2>Top Dishes near you</h2>
      <div className="food-display-list">
        {(filteredList.length === 0 ? food_list : filteredList).map(
          (eachItem, index) => (
            <FoodItem
              key={index}
              id={eachItem._id}
              name={eachItem.name}
              description={eachItem.description}
              image={eachItem.image}
              price={eachItem.price}
            />
          )
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
