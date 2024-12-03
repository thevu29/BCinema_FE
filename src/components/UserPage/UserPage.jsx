// import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

const UserPage = () => {
//   const { token, saveToken } = useAuth();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await getOAuth2Data();

//         if (res.data) {
//           saveToken(res.data);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     if (!token) {
//       fetchUser();
//     }
//   }, [token, saveToken]);

  return (
    <>
      <Header />
      <div id="content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default UserPage;
