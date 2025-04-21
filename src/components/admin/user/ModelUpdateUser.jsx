import { updateAccount } from "@services/accountService";
import { App, Button, Form, Input, Modal, Radio } from "antd";
import { useEffect, useState } from "react";

const ModelUpdateUser = ({ isOpen, setIsOpen, refreshTable, userActive }) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  useEffect(() => {
    const setForm = () => {
      form.setFieldsValue({
        fullname: userActive?.fullname,
        email: userActive?.email,
        gender: userActive?.gender,
      });
    };
    setForm();
  }, [userActive]);

  const { message, notification } = App.useApp();

  const onFinish = async (values) => {
    const res = await updateAccount(values, userActive?.username);
    setIsSubmit(true);
    if (res && res.data) {
      message.success("Cập nhật thông tin tài khoản thành công");
      form.resetFields();
      setIsOpen(false);
      refreshTable();
    } else {
      notification.error({
        message: "Cập thất bại !",
        description: res.errorMessage,
      });
    }
    setIsSubmit(false);
  };

  const onFinishFailed = () => {};

  return (
    <>
      <Modal
        open={isOpen}
        title="Update an user"
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
            label="Họ và tên"
            name="fullname"
            rules={[
              {
                required: true,
                message: "Vui lòng điền thông tin họ và tên!",
              },
            ]}
          >
            <Input />
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
export default ModelUpdateUser;
