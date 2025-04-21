import { Col, Image, Modal, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import "./modelGallery.scss";

const ModelGallery = ({ isOpen, setIsOpen, currentIndex, items, bookName }) => {
  const refGallery = useRef();
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(currentIndex);
    }
  }, [currentIndex, isOpen]);

  return (
    <>
      <Modal
        open={isOpen}
        width="60vw"
        onCancel={() => setIsOpen(false)}
        footer={null}
        closable={null}
        className="ImageGallery"
      >
        <Row gutter={[20]}>
          <Col sm={16}>
            <ImageGallery
              items={items}
              ref={refGallery}
              showPlayButton={false}
              showFullscreenButton={false}
              startIndex={currentIndex}
              onSlide={(i) => setActiveIndex(i)}
              slideDuration={0}
              showThumbnails={false}
            />
          </Col>
          <Col span={8}>
            <h4 style={{ padding: "1rem" }}>{bookName}</h4>
            <div className="list-image-left">
              {items.map((item, index) => {
                return (
                  <Image
                    wrapperClassName={"img-normal"}
                    width={100}
                    height={100}
                    src={item.original}
                    preview={false}
                    onClick={() => {
                      refGallery?.current?.slideToIndex(index);
                    }}
                  />
                );
              })}
            </div>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default ModelGallery;
