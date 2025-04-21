import { findAllCategories, findById } from "@services/categoryService";
import {
  App,
  Button,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { MAX_FILE_IMAGE_SIZE } from "@utils/helpep";
import { uploadFile } from "@services/uploadFileService";
import { update } from "@services/productService";
import { v4 as uuidv4 } from "uuid";

const ModelUpdateProduct = ({
  isOpen,
  setIsOpen,
  refreshTable,
  initialValues,
  setProductActive,
}) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [images, setImages] = useState([]);
  const { message, notification } = App.useApp();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState();
  const [listCategory, setListCategory] = useState([
    {
      label: "",
      value: "",
    },
  ]);
  const [form] = Form.useForm();

  /**
   * Get categories
   */
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await findAllCategories();
      if (res && res.data) {
        const objCategory = res.data.map((category) => {
          return { label: category.name, value: category?.id };
        });
        setListCategory(objCategory);
      }
    };
    fetchCategories();
  }, [initialValues]);

  useEffect(() => {
    if (isOpen && initialValues) {
      form.resetFields();
      form.setFieldsValue({
        name: initialValues?.name,
        author: initialValues?.author,
        publisher: initialValues?.publisher,
        inventory: initialValues?.inventory,
        categoryId: initialValues?.category?.id,
        price: initialValues?.price,
        shortDesc: initialValues?.shortDesc,
        detailDesc: initialValues?.detailDesc,
        sold: initialValues?.sold,
        id: initialValues?.id,
      });

      // Set images preview
      const listImage = initialValues.image?.split(",") || [];
      const imageSlider = listImage.map((image) => ({
        uid: uuidv4(),
        name: image,
        status: "done",
        url: `${import.meta.env.VITE_HOST}/storages/images/${image}`,
      }));

      setFileList(imageSlider);
      setImages(imageSlider.map((img) => img.name));
      console.log(form.getFieldValue("image"));
      // form.setFieldValue("image", fileList);
    }
  }, [isOpen, initialValues]);

  /**
   * Hàm đóng model và reset data
   */
  const handleCancel = () => {
    form.resetFields();
    setIsOpen(false);
    setFileList([]);
    setImages([]);
    setProductActive(null);
    refreshTable();
  };

  /**
   * Hàm submit form create product
   * @param {*} values
   */
  const onFinish = async (values) => {
    const newImage = images.join(",");
    const newValues = { ...values, image: newImage };
    const res = await update({ id: initialValues.id, data: newValues });
    setIsSubmit(true);
    if (res && res.data) {
      message.success("Cập nhật sản phẩm thành công");
      refreshTable();
      handleCancel();
    } else {
      notification.error({
        message: "Cập nhật sản phẩm thất bại !",
        description: res.errorMessage,
      });
    }
    setIsSubmit(false);
  };

  const onFinishFailed = () => {};

  /**
   * Phần upload ảnh
   */
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

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  /**
   * Hàm check điều kiện trước khi upload
   * @param {*} file
   * @returns
   */
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < MAX_FILE_IMAGE_SIZE;
    if (!isLt2M) {
      message.error(`Image must smaller than ${MAX_FILE_IMAGE_SIZE}MB!`);
    }
    return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
  };

  /**
   * Hàm remove image (Chỉ thực hiện phía font end)
   * @param {*} file
   */
  const handleRemove = async (file) => {
    const newFileList = fileList.filter((image) => image.uid !== file.uid);
    setFileList(newFileList);
    const newImages = fileList.filter((image) => image.name !== file.name);
    const mapNewImages = newImages.map((image) => {
      return image.name;
    });
    setImages(mapNewImages);
  };

  /**
   * Hàm render button upload image
   */
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {/* {loading ? <LoadingOutlined /> : <PlusOutlined />} */}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  /**
   * Hàm trả về fileList cho formItem
   * @param {*} e
   * @returns
   */
  const normForm = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  /**
   * Hàm upload ảnh lên server
   * @param {*} options
   */
  const handleUploadFile = async (options) => {
    try {
      const { file, onSuccess, onError } = options;
      const res = await uploadFile({ file, folder: "images" });
      if (res && res.data) {
        const fileName = res.data.fileName;
        const fileUrl = `${
          import.meta.env.VITE_HOST
        }/storages/images/${fileName}`;
        const uploadedFile = {
          uid: file.uid,
          name: fileName,
          status: "done",
          url: fileUrl,
        };
        setFileList([uploadedFile]); // ✅ wrap in array
        setImages([...images, fileName]);
        onSuccess && onSuccess("OK");
        message.success("Tải ảnh thành công");
      } else {
        onError && onError("Upload thất bại");
        message.error("Tải file thất bại");
      }
    } catch (error) {
      console.error(error);
      message.error("Tải file thất bại");
    }
  };

  /**
   * Hàm debug upload ảnh lên state list
   */
  useEffect(() => {
    form.setFieldValue("image", fileList);
  }, [fileList]);

  return (
    <>
      <Modal
        style={{ minWidth: "60vw" }}
        open={isOpen}
        title="Update an product"
        onCancel={handleCancel}
        confirmLoading={isSubmit}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isSubmit}
            onClick={() => {
              form.submit();
            }}
          >
            Update
          </Button>,
        ]}
      >
        <Form
          form={form}
          name="createProduct"
          layout="vertical"
          labelCol={{ span: 16 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row>
            <Col>
              <Form.Item
                hidden
                name="id"
                style={{ marginRight: "4px" }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền thông tin tên sản phẩm!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col className="gutter-row" md={8}>
              <Form.Item
                label="Tên sách"
                name="name"
                style={{ marginRight: "4px" }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền thông tin tên sản phẩm!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item
                style={{ marginLeft: "4px" }}
                label="Tác giả"
                name="author"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền thông tin tên tác giả",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item
                style={{ marginLeft: "4px" }}
                label="Nhà xuất bản"
                name="publisher"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền thông tin xuất bản!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Form.Item
                label="Tồn kho"
                name="inventory"
                style={{ marginRight: "4px" }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền thông tin tồn kho!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item
                label="Loại Sách"
                name="categoryId"
                style={{ marginRight: "4px" }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn thông tin loại sách!",
                  },
                ]}
              >
                <Select options={listCategory} />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item
                label="Giá"
                name="price"
                style={{ marginLeft: "4px" }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền thông tin giá sách!",
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  addonAfter=" đ"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Item
                label="Mô tả ngắn gọn"
                name="shortDesc"
                style={{ marginRight: "4px" }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền thông tin sách!",
                  },
                ]}
              >
                <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label="Đã bán"
                name="sold"
                style={{ marginLeft: "4px" }}
                rules={[
                  {
                    transform: Number,
                    message: "Sai định dạng số !",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={24}>
              <Form.Item
                label="Mô tả chi tiết"
                name="detailDesc"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền thông tin sách!",
                  },
                ]}
              >
                <TextArea
                  placeholder=""
                  autoSize={{ minRows: 5, maxRows: 20 }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={24}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Ảnh sản phẩm"
                name="image"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ảnh cho sản phẩm!",
                  },
                ]}
                valuePropName={"fileList"}
                getValueFromEvent={normForm}
              >
                <Upload
                  multiple={false}
                  defaultFileList={fileList}
                  listType="picture-card"
                  customRequest={handleUploadFile}
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  beforeUpload={beforeUpload}
                  onRemove={handleRemove}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{ width: "100%" }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
              {previewImage && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default ModelUpdateProduct;
