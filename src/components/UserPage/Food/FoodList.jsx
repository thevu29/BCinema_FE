import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { NumberInput } from "@mantine/core";
import { getFoodsService } from "../../../services/foodService";
import { formatCurrency } from "../../../utils/currency";
import PaginationComponent from "../../Pagination/Pagination";

const FoodList = ({ selectedFoods, setSelectedFoods }) => {
  const location = useLocation();

  const [foods, setFoods] = useState([]);

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
    const page = params.get("page");

    fetchFoods(search, page);
  }, [location.search]);

  const handleSelectFood = (food, quantity) => {
    if (quantity === 0) {
      setSelectedFoods(selectedFoods.filter((item) => item.id !== food.id));
      return;
    }

    const existingFoodIndex = selectedFoods.findIndex(
      (item) => item.id === food.id
    );

    if (existingFoodIndex !== -1) {
      const updatedFoods = [...selectedFoods];

      updatedFoods[existingFoodIndex] = {
        ...food,
        quantity: Math.min(quantity, food.quantity),
      };

      setSelectedFoods(updatedFoods);
    } else {
      setSelectedFoods([
        ...selectedFoods,
        {
          ...food,
          quantity: Math.min(quantity, food.quantity),
        },
      ]);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danh sách món ăn</h1>
      <div className="grid gap-4">
        {foods &&
          foods.data &&
          foods.data.length > 0 &&
          foods.data.map((food) => {
            const selectedQuantity =
              selectedFoods.find((item) => item.id === food.id)?.quantity || 0;

            const remainingQuantity = food.quantity - selectedQuantity;

            return (
              <div key={food.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img className="size-14" src={food?.image} />
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">{food?.name}</div>
                      <div className="text-gray-600 text-sm">
                        {formatCurrency(food?.price)}đ
                      </div>
                      <div className="text-sm text-gray-500">
                        Số lượng: {remainingQuantity}
                      </div>
                    </div>
                  </div>

                  <div>
                    <NumberInput
                      value={
                        selectedFoods.find((item) => item.id === food.id)
                          ?.quantity || 0
                      }
                      onChange={(value) => handleSelectFood(food, value)}
                      w={60}
                      min={0}
                      max={food?.quantity}
                    />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <PaginationComponent
        currentPage={foods?.page || 1}
        totalPages={foods?.totalPages || 1}
      />
    </div>
  );
};

export default FoodList;
