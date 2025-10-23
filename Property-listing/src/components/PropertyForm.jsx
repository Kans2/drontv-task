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
