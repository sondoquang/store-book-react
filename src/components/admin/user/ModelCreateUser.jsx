import { createAccount } from "@services/accountService";
import { App, Button, Form, Input, Modal, Radio } from "antd";
import { useState } from "react";

const ModelCreateUser = ({ isOpen, setIsOpen, refreshTable }) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  const { message, notification } = App.useApp();

  const onFinish = async (values) => {
    const res = await createAccount(values);
    setIsSubmit(true);
    if (res && res.data) {
      message.success("Tạo mới account thành công");
      form.resetFields();
      setIsOpen(false);
      refreshTable();
    } else {
      notification.error({
        message: "Tạo mới thất bại !",
        description: res.errorMessage,
      });
    }
    isSubmit(false);
  };

  const onFinishFailed = () => {};

  return (
    <>
      <Modal
        open={isOpen}
        title="Create an user"
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
            Create
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
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[
              {
                required: true,
                message: "Vui lòng điền thông tin tên đăng nhập!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Họ và tên"
            name="fullname"
            rules={[
              {
                required: true,
                message: "Vui lòng điền thông tin tên đăng nhập!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng điền thông tin password!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng điền thông tin email!" },
              { type: "email", message: "Sai định dạng email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[
              {
                required: true,
                message: "Vui lòng điền thông tin tên đăng nhập!",
              },
            ]}
          >
            <Radio.Group
              name="gender"
              options={[
                { value: true, label: "Nam" },
                { value: false, label: "Nữ" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModelCreateUser;
