import axios from "../utils/axiosCustom";

export const getVouchersService = async ({
    search = "",
    page = 1,
    size = 5,
    sortBy,
    sortOrder,
  }) => {
    const params = new URLSearchParams();
    
    if (search) params.append('search', search);
    if (page) params.append('page', page);
    if (size) params.append('size', size);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
  
    const queryString = params.toString();
    const url = `/vouchers${queryString ? `?${queryString}` : ''}`;
    
    const res = await axios.get(url);
    return res;
  };
  
  export const getVoucherByIdService = async (id) => {
    return await axios.get(`/vouchers/${id}`);
  };

  export const getVoucherByCodeService = async (code) => {
    return await axios.get(`/vouchers/code/${code}`);
  };

  export const getUserVouchersService = async (userId) => {
    return await axios.get(`/vouchers/users/${userId}`);
  };

  export const checkVoucherService = async (userId, voucherId) => {
    return await axios.get(`/vouchers/${voucherId}/users/${userId}`);
  };

  export const getUserVouchers = async (userId) => {
    return await axios.get(`/vouchers/users/${userId}`);
  }
  
  export const addVoucherService = async (data) => {
    return await axios.post("/vouchers", data);
  };