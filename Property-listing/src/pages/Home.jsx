import React, { useEffect, useState, useMemo } from "react";
import {
  Row,
  Col,
  Input,
  Select,
  Button,
  Space,
  Drawer,
  Typography,
  Skeleton,
  Card,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import toast, { Toaster } from "react-hot-toast";

import { getProperties, addProperty } from "../services/api";
import PropertyCard from "../components/PropertyCard";
import PropertyForm from "../components/PropertyForm";
import PropertyModal from "../components/PropertyModal";

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

export default function PropertyDashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [adding, setAdding] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const fetchProperties = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const res = await getProperties();
      setProperties(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const types = useMemo(() => {
    const set = new Set(properties.map((p) => p.type));
    return ["All", ...Array.from(set)];
  }, [properties]);

  const onSearch = (value) => setSearchText(value);

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
    try {
      setAdding(true);
      await addProperty(values);
      toast.success("Property added successfully!");
      resetForm();
      closeAddDrawer();
      fetchProperties();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add property");
    } finally {
      setAdding(false);
    }
  };

  const handleView = (property) => {
    setSelectedProperty(property);
    setModalVisible(true);
  };

  // Stats summary (example)
  const totalProperties = properties.length;
  const avgPrice =
    properties.length > 0
      ? Math.round(
          properties.reduce((sum, p) => sum + Number(p.price || 0), 0) /
            properties.length
        )
      : 0;

  return (
    <div
      style={{
        padding: 24,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa, #e4ebf5)",
      }}
    >
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header Section */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        <Title
          level={2}
          style={{
            color: "#000",
            fontWeight: 700,
            marginBottom: 12,
            letterSpacing: "1px",
          }}
        >
          🏡 Property Dashboard
        </Title>
        <p style={{ color: "#666" }}>
          Manage, filter, and explore your listed properties with ease.
        </p>
      </div>

      {/* Dashboard Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={cardStyle}>
            <Statistic
              title="Total Properties"
              value={totalProperties}
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={cardStyle}>
            <Statistic
              title="Average Price"
              value={avgPrice}
              prefix={<DollarOutlined />}
              formatter={(v) => `₹${v.toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={cardStyle}>
            <Statistic
              title="Locations Covered"
              value={new Set(properties.map((p) => p.location)).size}
              prefix={<EnvironmentOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Card
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 32,
          boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
          backdropFilter: "blur(6px)",
        }}
        bordered={false}
      >
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} sm={12} md={10}>
            <Search
              placeholder="Search by name or location"
              allowClear
              onSearch={onSearch}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              style={{ width: "100%" }}
            />
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

          <Col
            xs={24}
            sm={4}
            md={8}
            style={{
              textAlign: windowWidth < 768 ? "left" : "right",
            }}
          >
            <Space
              direction={windowWidth < 768 ? "vertical" : "horizontal"}
              size={8}
              style={{ width: windowWidth < 768 ? "100%" : "auto" }}
            >
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchProperties}
                loading={refreshing}
                style={btnStyle}
              >
                Refresh
              </Button>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openAddDrawer}
                loading={adding}
                style={{
                  ...btnStyle,
                  background: "#000",
                  color: "#fff",
                  border: "none",
                }}
              >
                Add Property
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Property Cards */}
      <Row gutter={[16, 16]}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Col xs={24} sm={12} md={8} lg={6} key={i}>
                <Skeleton
                  active
                  paragraph={{ rows: 4 }}
                  style={{
                    borderRadius: 12,
                    padding: 16,
                    background: "#fff",
                  }}
                />
              </Col>
            ))
          : filtered.length === 0
          ? (
            <Col span={24} style={{ textAlign: "center", padding: 60, color: "#999", fontSize: 16 }}>
              No properties found.
            </Col>
          )
          : filtered.map((p) => (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={6}
                key={p.id}
                style={{ animation: "fadeInUp 0.4s ease forwards" }}
              >
                <PropertyCard
                  property={p}
                  onView={() => handleView(p)}
                />
              </Col>
            ))}
      </Row>

      {/* Add Property Drawer */}
      <Drawer
        title="Add New Property"
        placement="right"
        width={windowWidth < 600 ? "90%" : 450}
        onClose={closeAddDrawer}
        visible={drawerVisible}
        destroyOnClose
        bodyStyle={{ padding: 24 }}
      >
        <PropertyForm onSubmit={handleAdd} />
      </Drawer>

      {/* Property Details Modal */}
      <PropertyModal
        visible={modalVisible}
        property={selectedProperty}
        onClose={() => {
          setModalVisible(false);
          setSelectedProperty(null);
        }}
      />

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// Shared styles
const cardStyle = {
  borderRadius: 16,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  background: "#fff",
  textAlign: "center",
};

const btnStyle = {
  borderRadius: 8,
  fontWeight: 500,
  transition: "0.3s",
};







/*
import React, { useEffect, useState, useMemo } from "react";
import { Row, Col, Input, Select, Button, Space, Drawer, Typography, Skeleton } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import toast, { Toaster } from "react-hot-toast";

import { getProperties, addProperty } from "../services/api";
import PropertyCard from "../components/PropertyCard";
import PropertyForm from "../components/PropertyForm";
import PropertyModal from "../components/PropertyModal";

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [adding, setAdding] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const fetchProperties = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const res = await getProperties();
      setProperties(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Track window resize for responsive buttons
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const types = useMemo(() => {
    const set = new Set(properties.map((p) => p.type));
    return ["All", ...Array.from(set)];
  }, [properties]);

  const onSearch = (value) => setSearchText(value);

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
    try {
      setAdding(true);
      await addProperty(values);
      toast.success("Property added successfully!");
      resetForm();
      closeAddDrawer();
      fetchProperties();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add property");
    } finally {
      setAdding(false);
    }
  };

  const handleView = (property) => {
    setSelectedProperty(property);
    setModalVisible(true);
  };

  return (
    <div style={{ padding: 24, minHeight: "100vh", background: "#f5f7fa" }}>
      <Toaster position="top-right" reverseOrder={false} />

      <Title level={2} style={{ marginBottom: 24, textAlign: "center", color: "#1890ff" }}>
        Property Listings
      </Title>

      {/* Filters and Buttons 
      <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: 24, flexWrap: "wrap" }}>
        <Col xs={24} sm={12} md={10} style={{ marginBottom: 8 }}>
          <Search
            placeholder="Search by name or location"
            allowClear
            onSearch={onSearch}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            style={{ width: "100%", borderRadius: 8 }}
          />
        </Col>

        <Col xs={24} sm={8} md={6} style={{ marginBottom: 8 }}>
          <Select
            value={filterType}
            onChange={(val) => setFilterType(val)}
            style={{ width: "100%", borderRadius: 8 }}
          >
            {types.map((t) => (
              <Option value={t} key={t}>
                {t}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Buttons: horizontal on desktop, vertical on mobile 
        <Col xs={24} sm={4} md={8} style={{ textAlign: windowWidth < 768 ? "left" : "right", marginBottom: 8 }}>
          <Space
            direction={windowWidth < 768 ? "vertical" : "horizontal"}
            size={8}
            style={{ width: windowWidth < 768 ? "100%" : "auto" }}
          >
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchProperties}
              style={{ borderRadius: 8, width: windowWidth < 768 ? "100%" : "auto" }}
              loading={refreshing}
            >
              Refresh
            </Button>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAddDrawer}
              style={{ borderRadius: 8, width: windowWidth < 768 ? "100%" : "auto" }}
              loading={adding}
            >
              Add Property
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Property Cards 
      <Row gutter={[16, 16]}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Col xs={24} sm={12} md={8} lg={6} key={i}>
                <Skeleton
                  active
                  paragraph={{ rows: 4 }}
                  style={{ borderRadius: 12, padding: 16, background: "#fff" }}
                />
              </Col>
            ))
          : filtered.length === 0
          ? (
            <Col span={24} style={{ textAlign: "center", padding: 60, color: "#999", fontSize: 16 }}>
              No properties found.
            </Col>
          )
          : filtered.map((p) => (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={6}
                key={p.id}
                style={{ animation: "fadeInUp 0.4s ease forwards" }}
              >
                <PropertyCard
                  property={p}
                  onView={() => handleView(p)}
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                  }}
                  hoverable
                />
              </Col>
            ))}
      </Row>

      {/* Add Property Drawer 
      <Drawer
        title="Add New Property"
        placement="right"
        width={windowWidth < 600 ? "90%" : 450}
        onClose={closeAddDrawer}
        visible={drawerVisible}
        destroyOnClose
        bodyStyle={{ padding: 24 }}
      >
        <PropertyForm onSubmit={handleAdd} />
      </Drawer>

      {/* Property Details Modal 
      <PropertyModal
        visible={modalVisible}
        property={selectedProperty}
        onClose={() => {
          setModalVisible(false);
          setSelectedProperty(null);
        }}
      />

      {/* Card fade-in animation 
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
*/