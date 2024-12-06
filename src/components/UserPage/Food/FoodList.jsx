import { useEffect, useState } from "react";
import { getFoodsService } from "../../../services/foodService";
import { Card, Text, Button, Group } from "@mantine/core";
import PaginationComponent from "../../Pagination/Pagination";
import { useLocation } from "react-router-dom";

const FoodList = () => {
  const location = useLocation();

  const [foods, setFoods] = useState(null);
  const fetchFoods = async (search, page) => {
    try {
      const res = await getFoodsService({
        search,
        page,
      });
      if (res.success) {
        setFoods(res);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    const page = params.get("page")

    fetchFoods(search, page);
  }, [location.search]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danh sách món ăn</h1>
      <div className="grid gap-4">
        {foods &&
          foods.data &&
          foods.data.length > 0 &&
          foods.data.map((food) => (
            <div key={food.id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between">
                <span className="font-medium">{food.name}</span>
                <span className="text-gray-600">{food.price} VND</span>
              </div>
              <div className="text-sm text-gray-500">
                Số lượng: {food.quantity}
              </div>
            </div>
          ))}
      </div>
      <PaginationComponent
        currentPage={
          parseInt(new URLSearchParams(location.search).get("page")) || 1
        }
        totalPages={foods?.totalPages || 1}
      />
    </div>
  );
};

export default FoodList;
