import axios from "@services/axiosCustomize"
import { findById as findCategory } from "./categoryService";

/**
 * 
 * @param {*} query: url được design bên component
 * @returns 
 */
export const findAllProducts = (query) => {
  return axios.get(query);
}

/**
 * 
 * @param {*} id: id của sản phẩm bạn muốn tìm kiếm
 * @returns 
 */
export const findById = (id) => {
  const url = `/products/${id}`
  return axios.get(url)
}

/**
 * 
 * @param {*} data: dữ liệu của sản phẩm cần tạo mới
 * @returns 
 */
export const create = (data) => {
  const url = '/products';
  return axios.post(url,data)
}

/**
 * 
 * @param {*} id: id của user muốn cập nhật thông tin
 * @param {*} data: dữ liệu cập nhật thông tin cho sản phẩm có id
 * @returns 
 */
export const update = async ({id, data}) => {
  debugger;
  const { data: category } = await findCategory(data?.categoryId);
  let { categoryId , ... newData } = data;
  newData = {...newData,category}
  const url = `/products/${id}`;
  return axios.put(url, newData)
}

/**
 * 
 * @param {*} id : id của sản phẩm cần xóa (Xóa mềm --> trường active = false)
 * @returns 
 */
export const deleteProduct = (id) => {
  const url = `/products/${id}`;
  return axios.delete(url)
}