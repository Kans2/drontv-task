import React from "react";
import { Modal, Row, Col } from "antd";

export default function PropertyModal({ visible, property, onClose }) {
  if (!property) return null;

  const { name, type, price, location, description, image, latitude, longitude } = property;

  const hasCoordinates =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    !isNaN(latitude) &&
    !isNaN(longitude);

    const mapSrc = hasCoordinates
  ? `https://maps.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`
  : null;


  return (
    <Modal
      open={visible}
      title={name}
      footer={null}
      onCancel={onClose}
      width={800}
      destroyOnClose
    >
      <Row gutter={16}>
        <Col xs={24} md={10}>
          <img
            src={image && image.trim() !== "" ? image : `https://source.unsplash.com/600x400/?house`}
            alt={name}
            style={{
              width: "100%",
              height: 320,
              objectFit: "cover",
              borderRadius: 6,
            }}
          />
        </Col>

        <Col xs={24} md={14}>
          <div style={{ padding: "4px 8px" }}>
            <p><strong>Type:</strong> {type}</p>
            <p><strong>Location:</strong> {location}</p>
            <p><strong>Price:</strong> ₹{Number(price).toLocaleString()}</p>
            <p><strong>Description:</strong></p>
            <p style={{ whiteSpace: "pre-wrap" }}>{description}</p>
          </div>
        </Col>
      </Row>

      {hasCoordinates && (
        <div style={{ marginTop: 20 }}>
          <h4>📍 Property Location</h4>
          <iframe
            title="Property Map"
            width="100%"
            height="300"
            loading="lazy"
            allowFullScreen
            style={{
              border: 0,
              borderRadius: 8,
              marginTop: 8,
            }}
            src={mapSrc}
          ></iframe>
        </div>
      )}
    </Modal>
  );
}
