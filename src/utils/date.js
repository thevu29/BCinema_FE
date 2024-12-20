export const formatDate = (date) => {
  return new Date(date).toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const formatDateForApi = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getTime = (date) => {
  const d = new Date(date);
  d.setHours(d.getHours() - 7);
  return d.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
