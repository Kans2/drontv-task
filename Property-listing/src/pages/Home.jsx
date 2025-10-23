import React, { useEffect, useState, useMemo } from "react";
import { Row, Col, Input, Select, Button, Space, Drawer, message } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { getProperties, addProperty } from "../services/api";
import PropertyCard from "../components/PropertyCard";
import PropertyForm from "../components/PropertyForm";
import PropertyModal from "../components/PropertyModal";

const { Search } = Input;
const { Option } = Select;

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("All");

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await getProperties();
      setProperties(res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const types = useMemo(() => {
    const set = new Set(properties.map((p) => p.type));
    return ["All", ...Array.from(set)];
  }, [properties]);

  const onSearch = (value) => {
    setSearchText(value);
  };

  const filtered = useMemo(() => {
    const text = searchText.trim().toLowerCase();
    return properties.filter((p) => {
      if (filterType !== "All" && p.type !== filterType) return false;
      if (!text) return true;
      return (
        (p.name || "").toLowerCase().includes(text) ||
        (p.location || "").toLowerCase().includes(text)
      );
    });
  }, [properties, searchText, filterType]);

  const openAddDrawer = () => setDrawerVisible(true);
  const closeAddDrawer = () => setDrawerVisible(false);

  const handleAdd = async (values, resetForm) => {
    // values: { name, type, price, location, description, image }
    try {
      await addProperty(values);
      message.success("Property added");
      resetForm();
      closeAddDrawer();
      fetchProperties();
    } catch (err) {
      console.error(err);
      message.error("Failed to add property");
    }
  };

  const handleView = (property) => {
    setSelectedProperty(property);
    setModalVisible(true);
  };

  return (
    <div>
      <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={10}>
          <Space style={{ width: "100%" }}>
            <Search
              placeholder="Search by name or location"
              allowClear
              onSearch={onSearch}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              style={{ width: "100%" }}
            />
          </Space>
        </Col>

        <Col xs={24} sm={8} md={6}>
          <Select
            value={filterType}
            onChange={(val) => setFilterType(val)}
            style={{ width: "100%" }}
          >
            {types.map((t) => (
              <Option value={t} key={t}>
                {t}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={4} md={8} style={{ textAlign: "right" }}>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchProperties}>
              Refresh
            </Button>

            <Button type="primary" icon={<PlusOutlined />} onClick={openAddDrawer}>
              Add Property
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {filtered.length === 0 && !loading ? (
          <Col span={24} style={{ textAlign: "center", padding: 40, color: "#666" }}>
            No properties found.
          </Col>
        ) : (
          filtered.map((p) => (
            <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
              <PropertyCard property={p} onView={() => handleView(p)} />
            </Col>
          ))
        )}
      </Row>

      <Drawer
        title="Add New Property"
        placement="right"
        width={420}
        onClose={closeAddDrawer}
        visible={drawerVisible}
        destroyOnClose
      >
        <PropertyForm onSubmit={handleAdd} />
      </Drawer>

      <PropertyModal
        visible={modalVisible}
        property={selectedProperty}
        onClose={() => {
          setModalVisible(false);
          setSelectedProperty(null);
        }}
      />
    </div>
  );
}
