import { useEffect, useState } from "react";
import { useAuth } from "../../../../context/Auth/authContext";
import { jwtDecode } from "jwt-decode";
import {
  getUserVouchers,
  getVoucherByIdService,
} from "../../../../services/voucherService";
import { formatDate } from "../../../../utils/date";

const VoucherUsed = () => {
  const { token } = useAuth();

  const [vouchersUsed, setVouchersUsed] = useState([]);

  useEffect(() => {
    const fetchVouchersUsed = async () => {
      try {
        const decodedToken = jwtDecode(token);
        const res = await getUserVouchers(decodedToken.id);

        if (res.success) {
          for (let userVoucher of res.data) {
            console.log(userVoucher);

            const voucher = await getVoucherByIdService(userVoucher.voucherId);

            if (voucher.success) {
              userVoucher.voucher = voucher.data;
              delete userVoucher.voucherId;
            }
          }
          console.log(res.data);
          setVouchersUsed(res.data);
          console.log(vouchersUsed);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchVouchersUsed();
  }, [token, vouchersUsed]);

  return (
    <>
      <div className="flex items-center justify-between mb-2 p-4 md:px-0">
        <h1 className="text-xl font-bold">Voucher đã sử dụng</h1>
      </div>
      <div className="bg-white rounded-lg">
        <div>
          <div className="flex items-center. justify-around p-4 md:px-0 border-b md:border-b-0 md:border-r border-gray-200">
            <p>Mã Voucher</p>
            <p>Giảm giá</p>
            <p>Ngày sử dụng</p>
          </div>
        </div>
        {vouchersUsed &&
          vouchersUsed.length > 0 &&
          vouchersUsed.map((voucher) => (
            <div
              key={voucher.id}
              className="flex items-center justify-around p-4 md:px-0 border-b md:border-b-0 md:border-r border-gray-200"
            >
              <p>{voucher.voucher.code}</p>
              <p>{voucher.voucher.discount}%</p>
              <p>{formatDate(voucher.voucher.createAt)}</p>
            </div>
          ))}
      </div>
    </>
  );
};

export default VoucherUsed;
