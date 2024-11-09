export const handleSorting = (sortBy, sortOrder, location, pathname, navigate) => {
  const params = new URLSearchParams(location.search);

  params.set("sortBy", sortBy);
  params.set("sortOrder", sortOrder);
  params.delete("page");

  if (!sortBy) params.delete("sortBy");
  if (!sortOrder) params.delete("sortOrder");

  navigate(`${pathname}?${params.toString()}`);
};
