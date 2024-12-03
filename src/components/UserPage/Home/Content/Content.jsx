import MovieBooking from "./MovieBooking/MovieBooking";
import Policy from "./Policy/Policy";

const Content = () => {
  return (
    <>
      <div className="container mx-auto text-center my-10">
        <h2 className="text-xl md:text-4xl font-bold mb-4">
          Đặt vé xem phim trực tuyến
        </h2>
        <p className="opacity-80">
          Tìm phim yêu thích - Đặt vé dễ dàng
        </p>
      </div>

      <MovieBooking />
      <Policy />
    </>
  );
};

export default Content;
