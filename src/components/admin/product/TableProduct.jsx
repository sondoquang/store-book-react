import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { deleteAccount } from "@services/accountService";
import { App, Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { deleteProduct, findAllProducts } from "@services/productService";
import DetailProduct from "./DetailProduct";
import ModelCreateProduct from "./ModelCreateProduct";
import ModelUpdateProduct from "./ModelUpdateProduct";

const TableProduct = () => {
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

  const [isOpen, setIsOpen] = useState(false);

  const [isOpenModelCreateBook, setIsOpenModelCreateBook] = useState(false);
  const [dataProductDetail, setDataProductDetail] = useState({});

  const [isOpenModelUpdateProduct, setIsOpenModelUpdateProduct] =
    useState(false);
  const [productActive, setProductActive] = useState(null);
  const { message, notification } = App.useApp();

  const confirmDelete = async (id) => {
    const res = await deleteProduct(id);
    if (res.status === 204) {
      message.success("Xóa sách thành công");
      refreshTable();
    } else {
      notification.error({
        message: "Xoá sách thất bại !",
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
      dataIndex: "id",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <>
            <a
              onClick={() => {
                setDataProductDetail(entity);
                setIsOpen(true);
              }}
              href="#"
            >
              {entity?.id}
            </a>
          </>
        );
      },
    },
    {
      title: "NAME",
      dataIndex: "name",
    },
    {
      title: "AUTHOR",
      dataIndex: "author",
    },
    {
      title: "PUBLISHER",
      dataIndex: "publisher",
      hideInSearch: true,
    },
    {
      title: "PRICE",
      dataIndex: "price",
      hideInSearch: true,
    },
    {
      title: "STATUS",
      dataIndex: "available",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <>
            <p>{entity.available ? "Available" : "Unavailable"}</p>
          </>
        );
      },
    },
    {
      title: "CREATE AT",
      dataIndex: "createDate",
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
                  setIsOpenModelUpdateProduct(true);
                  setProductActive(entity);
                }}
                style={{ fontSize: "20px", cursor: "pointer", color: "blue" }}
              />
              <Popconfirm
                title="Xác nhận xóa sách này"
                description="Bạn muốn xóa sách này chứ ?"
                onConfirm={() => confirmDelete(entity?.id)}
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
        rowKey="id"
        cardBordered
        request={async (params, sort, filter) => {
          let query = "/products";
          if (params) {
            query += `?pageNo=${params.current}&pageSize=${params.pageSize}`;
            if (params.name) {
              query += `&name=${params.name}`;
            }
            if (params.author) {
              query += `&author=${params.author}`;
            }
          }
          const res = await findAllProducts(query);
          if (res.data) {
            setMeta(res.data.meta);
          }
          return {
            data: res.data.products,
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
              setIsOpenModelCreateBook(true);
            }}
            type="primary"
          >
            Create Product
          </Button>,
          <Button>
            <EllipsisOutlined />
          </Button>,
        ]}
      ></ProTable>
      <DetailProduct
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        dataProductDetail={dataProductDetail}
        setDataProductDetail={setDataProductDetail}
      />
      <ModelCreateProduct
        isOpen={isOpenModelCreateBook}
        setIsOpen={setIsOpenModelCreateBook}
        refreshTable={refreshTable}
      />
      <ModelUpdateProduct
        isOpen={isOpenModelUpdateProduct}
        setIsOpen={setIsOpenModelUpdateProduct}
        refreshTable={refreshTable}
        initialValues={productActive}
        setProductActive={setProductActive}
      />
    </>
  );
};
export default TableProduct;
