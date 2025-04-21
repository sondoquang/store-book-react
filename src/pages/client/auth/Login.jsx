import { App, Button, Checkbox, Form, Input } from "antd";
import "./login.css";
import { loginAPI } from "@services/authService";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@context/AppContext";

const LoginPage = () => {
  const { message, notification } = App.useApp();
  const { setUser, setIsAuthenticated } = useAppContext();
  const navigate = useNavigate();

  // const userInfo = useSelector((state) => state.user);

  const onFinish = async (values) => {
    const res = await loginAPI(values);
    if (res.statusCode === 200) {
      setUser(res.data.userLogin);
      setIsAuthenticated(true);
      localStorage.setItem("accessToken", res.data.accessToken);
      message.success("Đăng nhập thành công");
      navigate("/");
    } else {
      notification.error({
        message: "Đăng nhập thất bại",
        description: "Tên đăng nhập hoặc mật khẩu chưa đúng !",
        duration: 3,
        placement: "topRight",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
    notification.error({
      message: "Đăng nhập thất bại",
      description: "Lỗi đăng nhập",
      duration: 3,
      placement: "topRight",
    });
  };

  return (
    <div className="wrapper-login">
      <div className="login">
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
          <h2 className="login--title">Đăng nhập</h2>
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
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng điền thông tin password!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <div className="login--footer">
            <Form.Item name="remember" valuePropName="checked" label={null}>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item label={null}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default LoginPage;
