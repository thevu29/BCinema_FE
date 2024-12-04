import React, { useEffect, useState } from "react";
import { getAllSeatTypesService } from "../../../services/seatTypeService";
import mufasaImage from "../../../assets/title-ticket-image.jpg";
import { LoadingOverlay } from "@mantine/core";

const Ticket = () => {
  const [seatTypes, setSeatTypes] = useState([]);

  useEffect(() => {
    const fetchSeatTypes = async () => {
      try {
        const response = await getAllSeatTypesService();
        setSeatTypes(response.data);
      } catch (error) {
        console.error("Error fetching seat types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeatTypes();
  }, []);

  return (
    <>
      <LoadingOverlay
        zIndex={1000}
        visible={seatTypes.length === 0}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <div className="min-h-[700px] bg-[#e3e6e4] flex items-center justify-center p-2 md:p-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative">
            <img
              src={mufasaImage}
              alt="Seat Types"
              className="w-full h-32 object-cover filter brightness-75"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="md:text-5xl font-bold text-white text-shadow-lg tracking-wide px-4 text-center">
                Bảng Giá Loại Ghế
              </h1>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="py-4 px-6 text-left rounded-tl-lg">STT</th>
                    <th className="py-4 px-6 text-left">Loại Ghế</th>
                    <th className="py-4 px-6 text-left rounded-tr-lg">
                      Giá (VND)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {seatTypes.map((seatType, index) => (
                    <tr
                      key={seatType.id}
                      className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200"
                    >
                      <td className="py-4 px-6 text-gray-700 font-medium">
                        {index + 1}
                      </td>
                      <td className="py-4 px-6 text-gray-800 font-semibold">
                        {seatType.name}
                      </td>
                      <td className="py-4 px-6 text-green-600 font-bold">
                        {seatType.price.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Ticket;
