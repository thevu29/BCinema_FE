  import { IconSearch } from "@tabler/icons-react";
  import { TextInput } from "@mantine/core";
  import HeroImage from "../../../../assets/moviewallpaper.jpg";

  const Hero = () => {
    return (
      <div
        className="relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url(${HeroImage})`,
          minHeight: "550px",
        }}
      >
        <div className="relative z-20 max-w-7xl mx-auto px-4 py-16 lg:px-6 flex flex-col justify-center">
          <div className="max-w-4xl w-full mx-auto">
            <div className="flex flex-col justify-center items-center text-center">
              <h1 className="text-white font-bold text-xl md:text-4xl">
                Ứng dụng đặt vé xem phim
              </h1>
              <p className="text-white text-sm md:text-lg mt-2 mb-0">
                Đặt vé nhanh chóng với hơn 100 suất chiếu mỗi ngày trên BCinema. <br />
                Chọn suất chiếu và chỗ ngồi yêu thích ngay bây giờ!
              </p>
            </div>
            <div className="wrapper-search flex flex-col gap-3 pt-6">
              <TextInput
                placeholder="Tìm phim, rạp chiếu,..."
                size="lg"
                radius="xl"
                rightSection={<IconSearch />}
              />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-30 z-10"></div>
      </div>
    );
  };

  export default Hero;
