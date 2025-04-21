import { Descriptions, Drawer } from "antd";

const DetailUser = ({
  isOpenUserDetail,
  setIsOpenUserDetail,
  dataUserDetail,
  setDataUserDetail,
}) => {
  const onClose = () => {
    setIsOpenUserDetail(false);
    setDataUserDetail(null);
  };

  return (
    <Drawer
      title="Detail Information User"
      width={"50vw"}
      onClose={onClose}
      open={isOpenUserDetail}
    >
      <Descriptions title="Information User" bordered column={1}>
        <Descriptions.Item label="Username">
          {dataUserDetail?.username}
        </Descriptions.Item>

        <Descriptions.Item label="FullName">
          {dataUserDetail?.fullname}
        </Descriptions.Item>

        <Descriptions.Item label="Email">
          {dataUserDetail?.email}
        </Descriptions.Item>

        <Descriptions.Item label="Gender">
          {dataUserDetail?.gender ? "Male" : "Female"}
        </Descriptions.Item>

        <Descriptions.Item label="Roles">
          {dataUserDetail?.roles?.toString()}
        </Descriptions.Item>

        <Descriptions.Item label="Create at">
          {dataUserDetail?.createAt}
        </Descriptions.Item>

        <Descriptions.Item label="Update at">
          {dataUserDetail?.updateAt}
        </Descriptions.Item>

        <Descriptions.Item label="Image">
          {dataUserDetail?.photo}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};
export default DetailUser;
