import { useAppContext } from "@context/AppContext";
import { changePassword } from "@services/accountService";
import { App, Button, Form, Input, Modal, Radio } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const ChangePassword = ({ isOpen, setIsOpen }) => {
  const [form] = Form.useForm();
  const { user, setUser, setIsAuthenticated } = useAppContext();
  const navigate = useNavigate();

  const { message } = App.useApp();

  useEffect(() => {
    form.setFieldsValue({
      username: user?.username,
    });
  }, [user]);

  const onFinish = async (values) => {
    const res = await changePassword(values);
    if (res && res.data) {
      message.success("Đổi mật khẩu thành công thông tin thành công");
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("accessToken");
      handleCancel();
      navigate("/login");
    } else {
      message.error("Cập nhật thông tin thất bại");
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      style={{ minWidth: "60vw" }}
      open={isOpen}
      title="Change Password"
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            form.submit();
          }}
        >
          Change
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
        <Form.Item label="Username" name="username" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label="Old password"
          name="password"
          rules={[
            {
              required: true,
              message: "Vui lòng điền thông tin mật khẩu cũ!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="New password"
          name="newPassword"
          rules={[
            {
              required: true,
              message: "Vui lòng điền thông tin mật khẩu mới!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Confirm password"
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: "Vui lòng điền thông tin xác nhận mật khẩu mới!",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ChangePassword;
