export const handleSorting = (sortBy, order, location, pathname, navigate) => {
  const params = new URLSearchParams(location.search);

  params.set("sortBy", sortBy);
  params.set("order", order);
  params.delete("page");

  if (!sortBy) params.delete("sortBy");
  if (!order) params.delete("order");

  navigate(`${pathname}?${params.toString()}`);
};
