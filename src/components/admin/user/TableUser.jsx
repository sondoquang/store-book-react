import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { deleteAccount, fetchAccounts } from "@services/accountService";
import { App, Button, Dropdown, Popconfirm } from "antd";
import { useRef, useState } from "react";
import DetailUser from "./DetailUser";
import ModelCreateUser from "./ModelCreateUser";
import ModelUpdateUser from "./ModelUpdateUser";

const TableUser = () => {
  const actionRef = useRef();

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  const [meta, setMeta] = useState({
    currentPage: 1,
    pageSize: 5,
    totalPages: 0,
    totalElements: 0,
  });

  const [isOpenUserDetail, setIsOpenUserDetail] = useState(false);

  const [isOpenModelCreateUser, setIsOpenModelCreateUser] = useState(false);
  const [dataUserDetail, setDataUserDetail] = useState({});

  const [isOpenModelUpdateUser, setIsOpenModelUpdateUser] = useState(false);
  const [userActive, setUserActive] = useState(null);
  const { message, notification } = App.useApp();

  const confirmDelete = async (username) => {
    const res = await deleteAccount(username);
    if (res.statusCode === 200) {
      message.success("Xóa người dùng thành công");
      refreshTable();
    } else {
      notification.error({
        message: "Xoá người dùng thất bại !",
        description: res.errorMessage,
      });
    }
  };

  const columns = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "ID",
      dataIndex: "ID",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <>
            <a
              onClick={() => {
                setDataUserDetail(entity);
                setIsOpenUserDetail(true);
              }}
              href="#"
            >
              {entity.username}
            </a>
          </>
        );
      },
    },
    {
      title: "FULLNAME",
      dataIndex: "fullname",
    },
    {
      title: "GENDER",
      dataIndex: "gender",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <>
            <p>{entity.gender === true ? "Male" : "Female"}</p>
          </>
        );
      },
    },
    {
      title: "EMAIL",
      dataIndex: "email",
    },
    {
      title: "PHOTO",
      dataIndex: "photo",
      hideInSearch: true,
    },
    {
      title: "CREATE AT",
      dataIndex: "createAt",
      valueType: "date",
      hideInSearch: true,
    },
    {
      title: "ACTION",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <>
            <div style={{ display: "flex", gap: "16px" }}>
              <EditOutlined
                onClick={() => {
                  setIsOpenModelUpdateUser(true);
                  setUserActive(entity);
                }}
                style={{ fontSize: "20px", cursor: "pointer", color: "blue" }}
              />
              <Popconfirm
                title="Xác nhận xóa người dùng"
                description="Bạn muốn xóa người dùng này ?"
                onConfirm={() => confirmDelete(entity?.username)}
                // onCancel={cancel}
                okText="Xác nhận"
                cancelText="Hủy"
              >
                <DeleteOutlined
                  style={{ fontSize: "20px", cursor: "pointer", color: "red" }}
                />
              </Popconfirm>
            </div>
          </>
        );
      },
    },
  ];
  return (
    <>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        rowKey="username"
        cardBordered
        request={async (params, sort, filter) => {
          let query = "";
          if (params) {
            query += `/accounts?pageNo=${params.current}&pageSize=${params.pageSize}`;
            if (params.email) {
              query += `&email=${params.email}`;
            }
            if (params.fullname) {
              query += `&fullname=${params.fullname}`;
            }
          }
          const res = await fetchAccounts(query);
          if (res.data) {
            setMeta(res.data.meta);
          }
          return {
            data: res.data.accounts,
            page: meta?.currentPage,
            success: true,
            total: res?.data?.meta.totalElements,
          };
        }}
        pagination={{
          current: meta?.currentPage,
          pageSize: meta?.pageSize,
          showSizeChanger: true,
          total: meta?.totalElements,
        }}
        headerTitle="Table Users"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              // actionRef.current?.reload();
              setIsOpenModelCreateUser(true);
            }}
            type="primary"
          >
            Create User
          </Button>,
          <Button>
            <EllipsisOutlined />
          </Button>,
        ]}
      ></ProTable>
      <DetailUser
        isOpenUserDetail={isOpenUserDetail}
        setIsOpenUserDetail={setIsOpenUserDetail}
        dataUserDetail={dataUserDetail}
        setDataUserDetail={setDataUserDetail}
      />
      <ModelCreateUser
        refreshTable={refreshTable}
        isOpen={isOpenModelCreateUser}
        setIsOpen={setIsOpenModelCreateUser}
      />
      <ModelUpdateUser
        refreshTable={refreshTable}
        userActive={userActive}
        isOpen={isOpenModelUpdateUser}
        setIsOpen={setIsOpenModelUpdateUser}
      />
    </>
  );
};
export default TableUser;
