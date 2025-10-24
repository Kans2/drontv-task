import React from "react";
import { Card, Button } from "antd";

export default function PropertyCard({ property, onView }) {
  const { name, type, price, location, description } = property;

  return (
    <Card
      hoverable
      style={{
        borderRadius: 16,
        boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
        overflow: "hidden",
        background: "#fff",
        border: "1px solid #f0f0f0",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      bodyStyle={{ padding: "20px" }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <Card.Meta
        title={
          <h3
            style={{
              color: "#000",
              marginBottom: 12,
              fontWeight: 700,
              letterSpacing: "0.5px",
              textTransform: "capitalize",
            }}
          >
            {name}
          </h3>
        }
        description={
          <>
            <div
              style={{
                marginTop: 8,
                lineHeight: 1.8,
                fontSize: 15,
                fontWeight: 500,
                color: "#111",
              }}
            >
              <div>
                <span style={{ color: "#666" }}>🏠 Type:</span>{" "}
                <span style={{ color: "#000" }}>{type}</span>
              </div>
              <div>
                <span style={{ color: "#666" }}>📍 Location:</span>{" "}
                <span style={{ color: "#000" }}>{location}</span>
              </div>
              <div>
                <span style={{ color: "#666" }}>💰 Price:</span>{" "}
                <span style={{ color: "#000", fontWeight: 600 }}>
                  ₹{Number(price).toLocaleString()}
                </span>
              </div>
            </div>

            <p
              style={{
                marginTop: 12,
                color: "#555",
                fontSize: 14,
                lineHeight: 1.6,
                fontStyle: "italic",
              }}
            >
              {description?.slice(0, 80)}
              {description?.length > 80 ? "..." : ""}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 12,
              }}
            >
              <Button
                onClick={onView}
                style={{
                  borderRadius: 8,
                  fontWeight: 600,
                  background: "#000",
                  color: "#fff",
                  border: "none",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.color = "#000";
                  e.currentTarget.style.border = "1px solid #000";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#000";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.border = "none";
                }}
              >
                View Details
              </Button>
            </div>
          </>
        }
      />
    </Card>
  );
}
