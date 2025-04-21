import axios from "@services/axiosCustomize"

/**
 * 
 * @param {*} file: file muốn upload
 * @param {*} folder: folder muốn chứa file
 * @returns 
 */
export const uploadFile = ({file, folder}) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  const url = "/upload/files";
  return axios.post(url, formData)
}