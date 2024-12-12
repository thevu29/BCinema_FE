import { useEffect, useState } from "react";
import { Group } from "@mantine/core";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../../context/Auth/authContext";
import {
  getPaymentsHasPointService,
  getTotalPointInYearOfUserService,
} from "../../../../services/paymentService";

import { jwtDecode } from "jwt-decode";
import { getUserByIdService } from "../../../../services/userService";
import { formatDate } from "../../../../utils/date";
import PaginationComponent from "../../../Pagination/Pagination";

const PointBonus = () => {
  const location = useLocation();
  const { token } = useAuth();
  const [totalPointUsed, setTotalPointUsed] = useState([]);
  const [user, setUser] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchTotalPointUsed = async () => {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        const res = await getTotalPointInYearOfUserService(
          userId,
          new Date().getFullYear()
        );
        if (res.success) {
          setTotalPointUsed(res.data);
        }
        // Fetch data here
      } catch (error) {
        console.log(error);
      }
    };

    const fetchUser = async () => {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        const res = await getUserByIdService(userId);
        if (res.success) {
          setUser(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
    fetchTotalPointUsed();
  }, [token]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page")) || 1;
    const fetchPayment = async () => {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const res = await getPaymentsHasPointService({
          userId: userId,
          page: page,
        });
        if (res.success) {
          setPayments(res);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPayment();
  }, [token, location.search]);

  return (
    <>
      <div className="flex items-center justify-between mb-2 p-4 md:px-0">
        <h1 className="text-xl font-bold">Điểm thưởng</h1>
      </div>
      <div className="bg-white">
        <div>
          <span>{`Tổng điểm sử dụng ${new Date().getFullYear()}: `}</span>
          <span>{totalPointUsed} Điểm</span>
        </div>
        <div>
          <span>{`Điểm hiện tại: `}</span>
          <span>{user.point} Điểm</span>
        </div>
      </div>
      <div className="flex items-center justify-between mb-2 p-4 md:px-0">
        <h1 className="text-xl font-bold">Lịch sử điểm</h1>
      </div>
      <div className="bg-white">
        <div className="flex items-center justify-around p-4 md:px-0 border-b md:border-b-0 md:border-r border-gray-200">
          <p>Điểm</p>
          <p>Ngày</p>
        </div>
        {payments.data &&
          payments.data.length > 0 &&
          payments.data.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-around p-4 md:px-0 border-b md:border-b-0 md:border-r border-gray-200"
            >
              <p className="text-red-400">- {payment.point} Điểm</p>
              <p>{formatDate(payment.date)}</p>
            </div>
          ))}
      </div>
      <Group className="h-20" justify="center">
        <PaginationComponent
          currentPage={payments?.page || 1}
          totalPages={payments?.totalPages || 1}
        />
      </Group>
    </>
  );
};

export default PointBonus;
