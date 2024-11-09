import { Pagination } from "@mantine/core";
import { useNavigate, useLocation } from "react-router-dom";

const PaginationComponent = ({ currentPage, totalPages }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    const params = new URLSearchParams(location.search);

    if (page === currentPage) return;

    params.set("page", page);

    if (page === 1) params.delete("page");

    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <Pagination
      withEdges={totalPages > 5}
      boundaries={3}
      siblings={2}
      value={currentPage}
      total={totalPages}
      onChange={handlePageChange}
    />
  );
};

export default PaginationComponent;
