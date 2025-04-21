import { App, Button, Checkbox, Form, Input } from "antd";
import "./register.css";
import { registerAPI } from "@services/authService";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    if (values.password === values.confirmPassword) {
      const data = await registerAPI(values);
      if (data.errorMessage) {
        message.error(data.errorMessage);
      } else {
        message.success("Đăng kí thành công");
        navigate("/login");
      }
    } else {
      message.error("Xác nhận mật khẩu không trùng khớp ! ");
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="wrapper-register">
      <div className="register">
        <Form
          name="basic"
          layout="vertical"
          labelCol={{ span: 16 }}
          wrapperCol={{ span: 24 }}
          className="register--form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <h2 className="register--title">Đăng Kí Tài Khoản</h2>
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
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng điền thông tin email!" },
              { type: "email", message: "Email chưa đúng định dạng!" },
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
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Vui lòng điền thông tin confirm password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <div className="register--footer">
            <Form.Item name="remember" valuePropName="checked" label={null}>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item label={null}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Đăng kí
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default RegisterPage;
