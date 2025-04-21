import { App, Button, Col, Input, Rate, Row } from "antd";
import { useParams } from "react-router-dom";
import "./book.scss";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { useEffect, useRef, useState } from "react";
import ModelGallery from "@components/client/book/ModelGallery";
import { currencyFormatter } from "@utils/formatCurrency";
import {
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { findById } from "@services/productService";
import { useAppContext } from "@context/AppContext";

const BookPage = () => {
  const { id } = useParams();
  const refGallery = useRef();
  const { setCarts } = useAppContext();
  const { message } = App.useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [product, setProduct] = useState({});
  const [isOpenModelGallery, setIsOpenModelGallery] = useState(false);
  const [listImage, setListImage] = useState([]);
  const [currentQuantity, setCurrentQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await findById(id);

      if (res && res.data) {
        setProduct(res.data);
        renderUrl(res.data.image);
      }
    };
    fetchProduct();
  }, [id]);

  const renderUrl = (imageName) => {
    const imageNames = imageName.split(",");
    let images = [];
    imageNames.map((name) => {
      const item = {
        original: `${import.meta.env.VITE_HOST}/storages/images/${name}`,
        thumbnail: `${import.meta.env.VITE_HOST}/storages/images/${name}`,
        originClass: "origin-image",
        thumbnailClass: "thumbnail-image",
      };
      images = [...images, item];
    });
    setListImage(images);
  };

  const handleOnclickImage = () => {
    setIsOpenModelGallery(true);
  };

  const handleChangeButton = (type) => {
    if (type === "MINUS") {
      if (currentQuantity - 1 !== 0) {
        setCurrentQuantity(currentQuantity - 1);
      }
    }

    if (type === "PLUS") {
      if (currentQuantity + 1 <= product.inventory) {
        setCurrentQuantity(currentQuantity + 1);
      }
    }
  };

  const handleChangeInput = (value) => {
    if (!isNaN(value)) {
      if (product.inventory > Number(value)) {
        setCurrentQuantity(Number(value));
      }
    }
  };

  const handleAddProductToCard = () => {
    /* Lấy giỏ hàng từ localStorage về */
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage && product) {
      /* Giỏ hàng tồn tại nè tiến hành update thôi */
      const carts = JSON.parse(cartStorage);

      let isExistingCard = carts.findIndex((cart) => cart.id === product?.id);
      if (isExistingCard >= 0) {
        carts[isExistingCard].quantity =
          carts[isExistingCard].quantity + currentQuantity;
      } else {
        carts.push({
          id: product.id,
          quantity: currentQuantity,
          detail: product,
        });
      }
      localStorage.setItem("carts", JSON.stringify(carts));
      setCarts(carts);
    } else {
      /* Giỏ hàng chưa tồn tại nè tiến hành create thôi */
      const data = [
        {
          id: product.id,
          quantity: currentQuantity,
          detail: product,
        },
      ];
      localStorage.setItem("carts", JSON.stringify(data));
      setCarts(data);
    }
    message.success("Thêm sản phẩm thành công");
  };

  return (
    <div
      className="container"
      style={{ background: "rgba(160, 160, 160, 0.5)" }}
    >
      <div className="wrapper-row">
        <Row gutter={[0, 20]} className="wrapper">
          <Col md={10} sm={0} xs={0}>
            <div className="detail-book-images">
              <ImageGallery
                style={{ maxHeight: "600px" }}
                items={listImage}
                ref={refGallery}
                showPlayButton={false}
                showFullscreenButton={false}
                renderLeftNav={() => <></>}
                renderRightNav={() => <></>}
                slideOnThumbnailOver={false}
                onSlide={(i) => setCurrentIndex(i)}
                onClick={handleOnclickImage}
              />
            </div>
          </Col>
          <Col md={14} sm={24}>
            <Col md={0} sm={24} xs={0}>
              <div className="detail-book-images">
                <ImageGallery
                  items={listImage}
                  ref={refGallery}
                  showPlayButton={false}
                  showFullscreenButton={false}
                  renderLeftNav={() => <></>}
                  renderRightNav={() => <></>}
                  onSlide={(i) => setCurrentIndex(i)}
                  slideOnThumbnailOver={true}
                />
              </div>
            </Col>
            <Col span={24}>
              <div className="detail-book-content">
                <p>
                  Tác giả:{" "}
                  <span style={{ color: "#1896bc" }}>{product?.author}</span>
                </p>
                <p className="detail-book-content-title">{product?.name}</p>
                <div className="detail-book-content-sold">
                  <Rate
                    style={{ fontSize: "12px" }}
                    disabled
                    defaultValue={4}
                  />
                  <p>Đã bán {product?.sold} sản phẩm</p>
                </div>
                <div className="detail-book-content-price">
                  {currencyFormatter(product.price, "vnd")}
                </div>
                <div className="detail-book-content-delivery">
                  <p className="title">Vận chuyển: </p>
                  <p>Miễn phí vận chuyển</p>
                </div>
                <div className="detail-book-content-number">
                  <p className="title">Số lượng: </p>
                  <div className="count">
                    <Button onClick={() => handleChangeButton("MINUS")}>
                      <MinusOutlined />
                    </Button>
                    <Input
                      className="custom-count"
                      value={currentQuantity}
                      onChange={(e) => handleChangeInput(e.target.value)}
                    />
                    <Button onClick={() => handleChangeButton("PLUS")}>
                      <PlusOutlined />
                    </Button>
                  </div>
                </div>
                <div className="detail-book-content-action">
                  <Button
                    onClick={() => {
                      handleAddProductToCard();
                    }}
                  >
                    <ShoppingCartOutlined />
                    Thêm vào giỏ hàng
                  </Button>
                  <Button className="add">Mua ngay</Button>
                </div>
              </div>
            </Col>
          </Col>
        </Row>
        <ModelGallery
          isOpen={isOpenModelGallery}
          setIsOpen={setIsOpenModelGallery}
          currentIndex={currentIndex}
          items={listImage}
          bookName={product.name}
        />
      </div>
    </div>
  );
};
export default BookPage;
