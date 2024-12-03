const Policy = () => {
  return (
    <section className="bg-white">
      <div className="max-w-4xl mx-auto text-center px-4 py-6 md:py-10">
        <h2 className="text-2xl md:text-4xl font-bold">Bảo mật dữ liệu</h2>
        <p className="md:pt-2 text-sm font-medium text-gray-500">
          An toàn dữ liệu của bạn là ưu tiên hàng đầu của chúng tôi
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4">
          <div className="px-4 py-6">
            <div className="inline-block rounded-full bg-[#1975dc] p-3">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 9C19 10.45 18.57 11.78 17.83 12.89C16.75 14.49 15.04 15.62 13.05 15.91C12.71 15.97 12.36 16 12 16C11.64 16 11.29 15.97 10.95 15.91C8.96 15.62 7.25 14.49 6.17 12.89C5.43 11.78 5 10.45 5 9C5 5.13 8.13 2 12 2C15.87 2 19 5.13 19 9Z"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M21.25 18.4699L19.6 18.8599C19.23 18.9499 18.94 19.2299 18.86 19.5999L18.51 21.0699C18.32 21.8699 17.3 22.1099 16.77 21.4799L12 15.9999L7.22996 21.4899C6.69996 22.1199 5.67996 21.8799 5.48996 21.0799L5.13996 19.6099C5.04996 19.2399 4.75996 18.9499 4.39996 18.8699L2.74996 18.4799C1.98996 18.2999 1.71996 17.3499 2.26996 16.7999L6.16996 12.8999C7.24996 14.4999 8.95996 15.6299 10.95 15.9199C11.29 15.9799 11.64 16.0099 12 16.0099C12.36 16.0099 12.71 15.9799 13.05 15.9199C15.04 15.6299 16.75 14.4999 17.83 12.8999L21.73 16.7999C22.28 17.3399 22.01 18.2899 21.25 18.4699Z"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M12.58 5.98L13.17 7.15999C13.25 7.31999 13.46 7.48 13.65 7.51L14.72 7.68999C15.4 7.79999 15.56 8.3 15.07 8.79L14.24 9.61998C14.1 9.75998 14.02 10.03 14.07 10.23L14.31 11.26C14.5 12.07 14.07 12.39 13.35 11.96L12.35 11.37C12.17 11.26 11.87 11.26 11.69 11.37L10.69 11.96C9.96997 12.38 9.53997 12.07 9.72997 11.26L9.96997 10.23C10.01 10.04 9.93997 9.75998 9.79997 9.61998L8.96997 8.79C8.47997 8.3 8.63997 7.80999 9.31997 7.68999L10.39 7.51C10.57 7.48 10.78 7.31999 10.86 7.15999L11.45 5.98C11.74 5.34 12.26 5.34 12.58 5.98Z"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
            <h3 className="font-medium text-sm leading-4 pt-4">
              Hệ thống bảo mật
              <br />
              đạt chuẩn ISO
            </h3>
          </div>
          <div className="px-4 py-6">
            <div className="inline-block rounded-full bg-[#1975dc] p-3">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.74 17.75H17.66C17.57 17.83 17.48 17.9 17.39 17.98L13.12 21.18C11.71 22.23 9.41001 22.23 7.99001 21.18L3.71001 17.98C2.77001 17.28 2 15.73 2 14.56V7.14998C2 5.92998 2.93001 4.57998 4.07001 4.14998L9.05 2.27999C9.87 1.96999 11.23 1.96999 12.05 2.27999L17.02 4.14998C17.97 4.50998 18.78 5.50999 19.03 6.52999H11.73C11.51 6.52999 11.31 6.54 11.12 6.54C9.27 6.65 8.78999 7.31998 8.78999 9.42998V14.86C8.79999 17.16 9.39001 17.75 11.74 17.75Z"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M8.80005 11.22H22"
                  stroke="white"
                  strokeWidth="1"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M22 9.42001V14.97C21.98 17.19 21.37 17.74 19.06 17.74H11.7401C9.39005 17.74 8.80005 17.15 8.80005 14.84V9.41C8.80005 7.31 9.28005 6.63999 11.1301 6.51999C11.3201 6.51999 11.5201 6.51001 11.7401 6.51001H19.06C21.41 6.52001 22 7.10001 22 9.42001Z"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M11.3201 15.26H12.6501"
                  stroke="white"
                  strokeWidth="1"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M14.75 15.26H18.02"
                  stroke="white"
                  strokeWidth="1"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
            <h3 className="font-medium text-sm leading-4 pt-4">
              Thông tin đặt vé được
              <br />
              bảo mật nghiêm ngặt
            </h3>
          </div>
          <div className="px-4 py-6">
            <div className="inline-block rounded-full bg-[#1975dc] p-3">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.4899 2.23006L5.49991 4.10005C4.34991 4.53005 3.40991 5.89004 3.40991 7.12004V14.55C3.40991 15.73 4.18992 17.28 5.13992 17.99L9.43991 21.2001C10.8499 22.2601 13.1699 22.2601 14.5799 21.2001L18.8799 17.99C19.8299 17.28 20.6099 15.73 20.6099 14.55V7.12004C20.6099 5.89004 19.6699 4.53005 18.5199 4.10005L13.5299 2.23006C12.6799 1.92006 11.3199 1.92006 10.4899 2.23006Z"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M11.9999 10.9199C11.9599 10.9199 11.9099 10.9199 11.8699 10.9199C10.9299 10.8899 10.1799 10.1099 10.1799 9.15991C10.1799 8.18991 10.9699 7.3999 11.9399 7.3999C12.9099 7.3999 13.7 8.18991 13.7 9.15991C13.69 10.1199 12.9399 10.8899 11.9999 10.9199Z"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M10.01 13.7199C9.05004 14.3599 9.05004 15.4099 10.01 16.0498C11.1 16.7799 12.89 16.7799 13.98 16.0498C14.94 15.4099 14.94 14.3599 13.98 13.7199C12.9 12.9899 11.11 12.9899 10.01 13.7199Z"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
            <h3 className="font-medium text-sm leading-4 pt-4">
              Bảo mật
              <br />
              thông tin cá nhân
            </h3>
          </div>
          <div className="px-4 py-6">
            <div className="inline-block rounded-full bg-[#1975dc] p-3">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.5899 10.5501V7.12006C20.5899 5.89006 19.6499 4.53006 18.4999 4.10006L13.5099 2.23006C12.6799 1.92006 11.3199 1.92006 10.4899 2.23006L5.49991 4.11006C4.34991 4.54006 3.40991 5.90006 3.40991 7.12006V14.5501C3.40991 15.7301 4.18991 17.2801 5.13991 17.9901L9.43991 21.2001C10.1399 21.7401 11.0699 22.0001 11.9999 22.0001"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M16 20C18.2091 20 20 18.2091 20 16C20 13.7909 18.2091 12 16 12C13.7909 12 12 13.7909 12 16C12 18.2091 13.7909 20 16 20Z"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M20.9955 21H21.0045"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
            <h3 className="font-medium text-sm leading-4 pt-4">
              Rà soát định kỳ
              <br />
              các hệ thống bảo mật
            </h3>
          </div>
        </div>
        <p className="py-6 text-sm max-w-md mx-auto">
        Với mục tiêu mang đến trải nghiệm an toàn, 
        chúng tôi cam kết thực hiện các biện pháp bảo mật tốt nhất để bảo vệ thông tin cá nhân và lịch sử đặt vé của bạn.
        </p>
      </div>
    </section>
  );
};

export default Policy;
