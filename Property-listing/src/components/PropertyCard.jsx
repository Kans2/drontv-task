import React from "react";
import { Card, Button } from "antd";

export default function PropertyCard({ property, onView }) {
  const { name, type, price, location, description, image } = property;

  return (
    <Card
      hoverable
      cover={
        <div style={{ height: 180, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img
            alt={name}
            src={image || `https://unsplash.com/photos/white-concrete-building-during-daytime-4453DIQWtsQ`}
            style={{ width: "100%", objectFit: "cover", minHeight: "100%" }}
          />
        </div>
      }
    >
      <Card.Meta
        title={name}
        description={
          <>
            <div style={{ marginTop: 8 }}>
              <strong>Type:</strong> {type} <br />
              <strong>Location:</strong> {location} <br />
              <strong>Price:</strong> ₹{Number(price).toLocaleString()} <br />
            </div>
            <p style={{ marginTop: 8 }}>{description?.slice(0, 80)}{description?.length > 80 ? "..." : ""}</p>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <Button type="primary" onClick={onView}>
                View
              </Button>
            </div>
          </>
        }
      />
    </Card>
  );
}
