import { Title, Tabs, Group } from "@mantine/core";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import { useState } from "react";
import MovieNowPlayingTable from "./MovieNowPlayingTable";
import MovieUpcomingTable from "./MovieUpcomingTable";
import Search from "../Search/Search";
import { useSearchParams } from "react-router-dom";


const breadcumbData = [
  { title: "Admin", href: "/admin" },
  { title: "Movies", href: "/admin/movies" },
];

const Movie = () => {
  const [selectedTab, setSelectedTab] = useState("nowPlaying");
  const [searchParams, setSearchParams] = useSearchParams();

  const handleTabChange = () => {
    setSearchParams({ page: 1 });
  }

  return (
    <>
      <BreadcumbsComponent items={breadcumbData} />
      <Title>Movies</Title>
      <Tabs defaultValue="nowPlaying" onChange={handleTabChange}>
        <Tabs.List grow justify="center" >
          <Tabs.Tab value="nowPlaying" onClick={() => setSelectedTab("nowPlaying")}>Now playing</Tabs.Tab>
          <Tabs.Tab value="upcoming" onClick={() => setSelectedTab("upcoming")}>Upcoming</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      { selectedTab === "upcoming" ? (<div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search foods" />
        </Group>

        <MovieUpcomingTable/>
      </div>) : (<div className="bg-white p-8 rounded-lg mt-7">
        <Group justify="space-between" mb={24}>
          <Search placeholder="Search foods" />
        </Group>

        <MovieNowPlayingTable />
      </div>) }
    </>
  );
};

export default Movie;
