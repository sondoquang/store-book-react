import axios from "@services/axiosCustomize";

/**
 * Hàm tạo mới một order
 * @param {*} data 
 * @returns 
 */
export const create = (data) => {
    const url = "/orders";
    return axios.post(url, data)
}

export const getAllOrders = () => {
    const url = "/history";
    return axios.get(url);
}

export const findAllOrders = () => {
    const url = "/orders";
    return axios.get(url);
}