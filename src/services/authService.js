import axios from "@services/axiosCustomize"

/**
 * function refresh token
 * @returns data
 */
export const  refreshToken = () => {
  const url = "/auth/refreshToken";
  return axios.get(url);
}
/**
 * API login hệ thống
 * @param {*} data 
 * @returns data
 */
export const loginAPI = async (data) => {
  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("password", data.password);
  formData.append("remember", data.remember);
  const urlLogin = "/auth/login"
  return await axios.post(urlLogin, formData,{
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

/**
 * 
 * @param {*} data : object {username, password, email, confirmPassword}
 * @returns 
 */
export const registerAPI = (data) => {
  const urlRegister = "/accounts";
  return axios.post(urlRegister,data)
}

/**
 * function logout hệ thống
 * @returns 
 */
export const logoutApi = () => {
  const urlLogout = '/auth/logout';
  return axios.post(urlLogout)
}