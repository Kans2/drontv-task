import React, { useState } from "react";
import { Form, Input, Button, Select, InputNumber, message, Upload, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { TextArea } = Input;
const { Option } = Select;

export default function PropertyForm({ onSubmit }) {
  const [form] = Form.useForm();
  const [coordinates, setCoordinates] = useState({ latitude: "", longitude: "" });
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleFinish = async (values) => {
    try {
      const payload = {
        ...values,
        price: Number(values.price),
        latitude: values.latitude ? Number(values.latitude) : null,
        longitude: values.longitude ? Number(values.longitude) : null,
        image: imageUrl
          ? imageUrl
          : `https://source.unsplash.com/400x300/?${values.type || "house"}`,
      };

      await onSubmit(payload, () => {
        form.resetFields();
        setImageUrl("");
      });
      message.success("Property added successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to add property. Please try again.");
    }
  };

  // Upload image to Cloudinary
  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET); // Replace with your preset
    setUploading(true);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, // Replace YOUR_CLOUD_NAME
        formData
      );
      setImageUrl(res.data.secure_url);
      message.success("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      message.error("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleCoordinateChange = (changedValues) => {
    setCoordinates((prev) => ({ ...prev, ...changedValues }));
  };

  const { latitude, longitude } = coordinates;
  const hasCoordinates = latitude && longitude;
  const mapSrc = hasCoordinates
    ? `https://maps.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`
    : null;

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      autoComplete="off"
      onValuesChange={handleCoordinateChange}
    >
      <Form.Item
        name="name"
        label="Property Name"
        rules={[{ required: true, message: "Please enter property name" }]}
      >
        <Input placeholder="e.g., Modern Apartment" />
      </Form.Item>

      <Form.Item
        name="type"
        label="Type"
        rules={[{ required: true, message: "Select a property type" }]}
      >
        <Select placeholder="Select type">
          <Option value="Apartment">Apartment</Option>
          <Option value="Villa">Villa</Option>
          <Option value="House">House</Option>
          <Option value="Studio">Studio</Option>
          <Option value="Plot">Plot</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="price"
        label="Price (INR)"
        rules={[{ required: true, message: "Enter price" }]}
      >
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          placeholder="e.g., 4500000"
        />
      </Form.Item>

      <Form.Item
        name="location"
        label="Location"
        rules={[{ required: true, message: "Enter location" }]}
      >
        <Input placeholder="City, Area" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Short Description"
        rules={[{ required: true, message: "Please enter a short description" }]}
      >
        <TextArea rows={4} placeholder="Describe the property briefly" />
      </Form.Item>

      {/* 🌟 Cloudinary File Upload */}
      <Form.Item label="Property Image (optional)">
        <Upload
          customRequest={handleUpload}
          showUploadList={false}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />} disabled={uploading}>
            {uploading ? <Spin /> : imageUrl ? "Change Image" : "Upload Image"}
          </Button>
        </Upload>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Property"
            style={{ marginTop: 8, width: "100%", maxHeight: 200, objectFit: "cover" }}
          />
        )}
      </Form.Item>

      {/* Latitude & Longitude */}
      <Form.Item name="latitude" label="Latitude (optional)">
        <Input placeholder="e.g., 12.9716" />
      </Form.Item>

      <Form.Item name="longitude" label="Longitude (optional)">
        <Input placeholder="e.g., 77.5946" />
      </Form.Item>

      {/* Map Preview */}
      {hasCoordinates && (
        <div style={{ marginBottom: 16 }}>
          <iframe
            title="map"
            src={mapSrc}
            width="100%"
            height="250"
            style={{ borderRadius: "8px" }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      )}

      <Form.Item>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={() => form.resetFields()}>Reset</Button>
          <Button type="primary" htmlType="submit" disabled={uploading}>
            Add Property
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}




/*
import React, { useState } from "react";
import { Form, Input, Button, Select, InputNumber, message } from "antd";

const { TextArea } = Input;
const { Option } = Select;

export default function PropertyForm({ onSubmit }) {
  const [form] = Form.useForm();
  const [coordinates, setCoordinates] = useState({ latitude: "", longitude: "" });

  const handleFinish = async (values) => {
    try {
      const payload = {
        ...values,
        price: Number(values.price),
        latitude: values.latitude ? Number(values.latitude) : null,
       longitude: values.longitude ? Number(values.longitude) : null,
        image:
          values.image && values.image.trim() !== ""
            ? values.image
            : `https://source.unsplash.com/400x300/?${values.type || "house"}`,
      };

      await onSubmit(payload, () => form.resetFields());
      message.success("Property added successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to add property. Please try again.");
    }
  };

  const handleCoordinateChange = (changedValues) => {
    setCoordinates((prev) => ({ ...prev, ...changedValues }));
  };

  const { latitude, longitude } = coordinates;
  const hasCoordinates = latitude && longitude;
  const mapSrc = hasCoordinates
    ? `https://maps.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`
    : null;

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      autoComplete="off"
      onValuesChange={handleCoordinateChange}
    >
      <Form.Item
        name="name"
        label="Property Name"
        rules={[{ required: true, message: "Please enter property name" }]}
      >
        <Input placeholder="e.g., Modern Apartment" />
      </Form.Item>

      <Form.Item
        name="type"
        label="Type"
        rules={[{ required: true, message: "Select a property type" }]}
      >
        <Select placeholder="Select type">
          <Option value="Apartment">Apartment</Option>
          <Option value="Villa">Villa</Option>
          <Option value="House">House</Option>
          <Option value="Studio">Studio</Option>
          <Option value="Plot">Plot</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="price"
        label="Price (INR)"
        rules={[{ required: true, message: "Enter price" }]}
      >
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          placeholder="e.g., 4500000"
        />
      </Form.Item>

      <Form.Item
        name="location"
        label="Location"
        rules={[{ required: true, message: "Enter location" }]}
      >
        <Input placeholder="City, Area" />
      </Form.Item>

      <Form.Item name="image" label="Image URL "     rules={[{ required: true, message: "Please enter a valid uri" }]}>
        <Input placeholder="https://example.com/image.jpg" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Short Description"
        rules={[{ required: true, message: "Please enter a short description" }]}
      >
        <TextArea rows={4} placeholder="Describe the property briefly" />
      </Form.Item>

     
      <Form.Item name="latitude" label="Latitude (optional)">
        <Input placeholder="e.g., 12.9716" />
      </Form.Item>

      <Form.Item name="longitude" label="Longitude (optional)">
        <Input placeholder="e.g., 77.5946" />
      </Form.Item>

     
      {hasCoordinates && (
        <div style={{ marginBottom: 16 }}>
          <iframe
            title="map"
            src={mapSrc}
            width="100%"
            height="250"
            style={{ borderRadius: "8px" }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      )}

      <Form.Item>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={() => form.resetFields()}>Reset</Button>
          <Button type="primary" htmlType="submit">
            Add Property
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}

*/
/*
import React from "react";
import { Form, Input, Button, Select, InputNumber, message } from "antd";

const { TextArea } = Input;
const { Option } = Select;

export default function PropertyForm({ onSubmit }) {
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    try {
      const payload = {
        ...values,
        price: Number(values.price),
        image:
          values.image && values.image.trim() !== ""
            ? values.image
            : `https://source.unsplash.com/400x300/?${values.type || "house"}`,
      };

      await onSubmit(payload, () => form.resetFields());

      // ✅ Show success toast
      message.success("Property added successfully!");
    } catch (error) {
      console.error(error);
      // ❌ Show error toast
      message.error("Failed to add property. Please try again.");
    }
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      autoComplete="off"
    >
      <Form.Item
        name="name"
        label="Property Name"
        rules={[{ required: true, message: "Please enter property name" }]}
      >
        <Input placeholder="e.g., Modern Apartment" />
      </Form.Item>

      <Form.Item
        name="type"
        label="Type"
        rules={[{ required: true, message: "Select a property type" }]}
      >
        <Select placeholder="Select type">
          <Option value="Apartment">Apartment</Option>
          <Option value="Villa">Villa</Option>
          <Option value="House">House</Option>
          <Option value="Studio">Studio</Option>
          <Option value="Plot">Plot</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="price"
        label="Price (INR)"
        rules={[{ required: true, message: "Enter price" }]}
      >
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          placeholder="e.g., 4500000"
        />
      </Form.Item>

      <Form.Item
        name="location"
        label="Location"
        rules={[{ required: true, message: "Enter location" }]}
      >
        <Input placeholder="City, Area" />
      </Form.Item>

      <Form.Item name="image" label="Image URL (optional)">
        <Input placeholder="https://example.com/image.jpg" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Short Description"
        rules={[{ required: true, message: "Please enter a short description" }]}
      >
        <TextArea rows={4} placeholder="Describe the property briefly" />
      </Form.Item>

      <Form.Item>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={() => form.resetFields()}>Reset</Button>
          <Button type="primary" htmlType="submit">
            Add Property
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}
*/