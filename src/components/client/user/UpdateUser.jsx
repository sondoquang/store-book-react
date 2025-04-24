import { UploadOutlined } from "@ant-design/icons";
import { useAppContext } from "@context/AppContext";
import { updateAccount } from "@services/accountService";
import { uploadFile } from "@services/uploadFileService";
import {
  App,
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Radio,
  Row,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
const UpdateUser = ({ isOpen, setIsOpen }) => {
  const [form] = Form.useForm();
  const { user, setUser } = useAppContext();

  const [userAvatar, setUserAvatar] = useState(user?.photo);
  const urlAvatar = `${
    import.meta.env.VITE_HOST
  }/storages/avatar/${userAvatar}`;

  const { message } = App.useApp();

  useEffect(() => {
    form.setFieldsValue({
      email: user?.email,
      fullname: user?.fullName,
      gender: user?.gender,
    });
  }, [isOpen, user]);

  const handleUploadFile = async (options) => {
    const { onSuccess } = options;
    const file = options.file;
    const res = await uploadFile({ file, folder: "avatar" });
    if (res && res.data) {
      const newAvatar = res.data.fileName;
      setUserAvatar(newAvatar);
      if (onSuccess) {
        onSuccess("ok");
      } else {
        message.error(res.errorMessage);
      }
    }
  };
  useEffect(() => {
    console.log(userAvatar);
  }, [userAvatar]);

  const props = {
    maxCount: 1,
    multiple: false,
    showUploadList: false,
    customRequest: handleUploadFile,
    onChange(info) {
      if (info.file.status === "done") {
        message.success("Upload file thành công");
      } else if (info.file.status === "error ") {
        message.error("Upload file thất bại");
      }
    },
  };

  const onFinish = async (values) => {
    const newValue = { ...values, photo: userAvatar };
    debugger;
    const res = await updateAccount({
      values: newValue,
      username: user.username,
    });
    if (res && res.data) {
      message.success("Cập nhật thông tin thành công");
      setUser(res.data);
      handleCancel();
    } else {
      message.error("Cập nhật thông tin thất bại");
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setUserAvatar(user.photo);
    form.resetFields();
  };

  console.log(urlAvatar);

  return (
    <Modal
      style={{ minWidth: "60vw" }}
      open={isOpen}
      title="Update an product"
      onCancel={() => handleCancel()}
      footer={[
        <Button key="back" onClick={() => handleCancel()}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
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
        name="basic"
        layout="vertical"
        labelCol={{ span: 16 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row>
          <Col lg={12} md={12}>
            <Image width={100} height={100} src={urlAvatar} />
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Col>
          <Col lg={12} md={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng điền thông tin email!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="FullName"
              name="fullname"
              rules={[
                {
                  required: true,
                  message: "Vui lòng điền thông tin fullname!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="gender" initialValues="false" label="Giới tính">
              <Radio.Group
                options={[
                  { value: true, label: "Nam" },
                  { value: false, label: "Nữ" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default UpdateUser;
