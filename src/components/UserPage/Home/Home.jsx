// import { useEffect } from "react";
import Content from "./Content/Content";
import Hero from "./Hero/Hero";

const Home = () => {
  // const { token, saveToken } = useAuth();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const res = await getOAuth2Data();

  //       if (res.data) {
  //         saveToken(res.data);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   if (!token) {
  //     fetchUser();
  //   }
  // }, [token, saveToken]);

  return (
    <>
      <Hero />
      <Content />
      <div className="container px-24 mb-24">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6592.090096271172!2d106.6803175038947!3d10.759109735706526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1b7c3ed289%3A0xa06651894598e488!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTw6BpIEfDsm4!5e0!3m2!1svi!2s!4v1732979527831!5m2!1svi!2s"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </>
  );
};

export default Home;
