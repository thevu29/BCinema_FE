import { Select } from "@mantine/core";
import { Controller } from "react-hook-form";
import { useMovieFetcher } from "../../../hooks/movieHook";

const MovieSelect = ({ control, FORM_VALIDATION }) => {
  const { movies, loadMoreMovies, setSearchQuery } = useMovieFetcher();

  return (
    <Controller
      name="movieId"
      control={control}
      rules={FORM_VALIDATION.movieId}
      render={({ field, fieldState: { error } }) => (
        <Select
          {...field}
          error={error?.message}
          label="Movie"
          size="md"
          placeholder="Select movie"
          data={movies}
          searchable
          allowDeselect={false}
          onSearchChange={(query) => {
            setSearchQuery(query);
          }}
          onDropdownClose={() => {
            loadMoreMovies();
          }}
        />
      )}
    />
  );
};

export default MovieSelect;
