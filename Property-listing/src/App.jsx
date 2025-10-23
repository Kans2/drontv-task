import React from "react";
import { Layout, Typography } from "antd";
import Home from "./pages/Home";

const { Header, Content } = Layout;
const { Title } = Typography;

export default function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#001529", padding: "12px 24px" }}>
        <Title style={{ color: "#fff", margin: 0, lineHeight: "32px" }} level={4}>
          Property Listings — Demo
        </Title>
      </Header>

      <Content style={{ padding: "24px" }}>
        <Home />
      </Content>
    </Layout>
  );
}
