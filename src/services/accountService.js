import axios from "@services/axiosCustomize"

/**
 * Function fetch account by refreshToken
 * @returns 
 */
export const fetchAccount = () => {
  const urlFetchAccount = '/auth/account';
  return axios.get(urlFetchAccount);
}

/**
 * Function fetch all account
 * @param {*} query: url and query 
 * @returns 
 */
export const fetchAccounts = (query) => {
  return axios.get(query);
}

/**
 * Function create account
 * @param {*} values: information account 
 * @returns 
 */
export const createAccount = (values) => {
  const urlCreateAccount = "/accounts"
  return axios.post(urlCreateAccount,values )
}

/**
 * Function update information account
 * @param {*} values : Value of account 
 * @param {*} username : username of account
 * @returns 
 */
export const updateAccount = (values, username) => {
  const urlCreateAccount = `/accounts/${username}`
  return axios.put(urlCreateAccount,values )
}

/**
 * Function delete account (field active)
 * @param {*} username : username of account 
 * @returns 
 */
export const deleteAccount = (username) => {
  const urlCreateAccount = `/accounts/${username}`
  return axios.delete(urlCreateAccount )
}

