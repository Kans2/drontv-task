import jsonServer from "json-server";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use("/api", router);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ JSON Server running at http://localhost:${PORT}/api`);
});

