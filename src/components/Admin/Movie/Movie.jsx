import { Title, Group } from "@mantine/core";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import Search from "../Search/Search";
import MovieTable from "./MovieTable";

const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Movies", href: "/admin/movies" },
];

const Movie = () => {
  return (
    <>
      <BreadcumbsComponent items={breadcumbData} />
      <Title order={1} mt={32}>
        Movies
      </Title>

      <div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search movies" />
        </Group>

        <MovieTable />
      </div>
    </>
  );
};

export default Movie;
