import { Descriptions, Divider, Drawer, Upload } from "antd";
import { Image } from "antd/lib";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const DetailProduct = ({
  isOpen,
  setIsOpen,
  dataProductDetail,
  setDataProductDetail,
}) => {
  const onClose = () => {
    setIsOpen(false);
    setDataProductDetail(null);
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (dataProductDetail?.image) {
      const listImage = dataProductDetail.image.split(",") || [];
      const imageSlider = listImage.map((image) => ({
        uid: uuidv4(),
        name: image,
        status: "done",
        url: `${import.meta.env.VITE_HOST}/storages/images/${image}`,
      }));
      setFileList(imageSlider);
    }
  }, [dataProductDetail]);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  return (
    <Drawer
      title="Detail Information Product"
      width={"50vw"}
      onClose={onClose}
      open={isOpen}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Id">
          {dataProductDetail?.id}
        </Descriptions.Item>

        <Descriptions.Item label="Title">
          {dataProductDetail?.name}
        </Descriptions.Item>

        <Descriptions.Item label="Author">
          {dataProductDetail?.author}
        </Descriptions.Item>

        <Descriptions.Item label="Price">
          {dataProductDetail?.price}
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          {dataProductDetail?.available ? "Available" : "Unavailable"}
        </Descriptions.Item>

        <Descriptions.Item label="Created at">
          {dataProductDetail?.createDate}
        </Descriptions.Item>

        <Descriptions.Item label="Sold">
          {dataProductDetail?.sold}
        </Descriptions.Item>

        <Descriptions.Item label="Inventory">
          {dataProductDetail?.inventory}
        </Descriptions.Item>
        <Descriptions.Item label="Short description">
          {dataProductDetail?.shortDesc}
        </Descriptions.Item>
        <Descriptions.Item label="Detail description">
          {dataProductDetail?.detailDesc}
        </Descriptions.Item>
      </Descriptions>
      <Divider orientation="left">Image Books</Divider>
      <Upload
        // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        showUploadList={{ showRemoveIcon: false }}
      ></Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </Drawer>
  );
};
export default DetailProduct;
