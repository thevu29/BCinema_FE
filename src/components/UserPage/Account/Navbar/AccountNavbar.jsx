import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";

const AccountNavbar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="col-span-1 md:col-span-3">
      <div className="bg-white md:rounded-md">
        <ul className="flex overflow-y-auto hide-scroll-bar md:py-4 md:flex-col">
          <li>
            <Link
              className={clsx(
                "block text-sm p-4 hover:bg-slate-50 hover:text-[#1975dc]",
                {
                  "border-l-[4px] border-[#1975dc] bg-slate-50":
                    pathname === "/account/payments",
                }
              )}
              to="/account/payments"
            >
              Lịch sử đặt vé
            </Link>
          </li>
          <li>
            <Link
              className={clsx(
                "block text-sm p-4 hover:bg-slate-50 hover:text-[#1975dc]",
                {
                  "border-l-[4px] border-[#1975dc] bg-slate-50":
                    pathname === "/account/points",
                }
              )}
              to="/account/points"
            >
              Điểm thưởng
            </Link>
          </li>
          <li>
            <Link
              className={clsx(
                "block text-sm p-4 hover:bg-slate-50 hover:text-[#1975dc]",
                {
                  "border-l-[4px] border-[#1975dc] bg-slate-50":
                    pathname === "/account/vouchers",
                }
              )}
              to="/account/vouchers"
            >
              Voucher sử dụng
            </Link>
          </li>
          <li>
            <Link
              className={clsx(
                "block text-sm p-4 hover:bg-slate-50 hover:text-[#1975dc]",
                {
                  "border-l-[4px] border-[#1975dc] bg-slate-50":
                    pathname === "/account/information",
                }
              )}
              to="/account/information"
            >
              Thông tin cá nhân
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AccountNavbar;
