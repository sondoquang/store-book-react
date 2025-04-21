import axios from "@services/axiosCustomize"

/**
 * API lấy ra tất cả các categories
 * @returns 
 */
export const findAllCategories = () => {
  const url = "/categories";
  return axios.get(url);
}

/**
 * Hàm lấy category theo mã loại
 * @param {*} id 
 * @returns 
 */
export const findById = (id) => {
  const url = `/categories/${id}`;
  return axios.get(url)
}