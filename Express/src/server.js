import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = "./data/properties.json";

// ✅ GET all properties
app.get("/api/properties", (req, res) => {
  fs.readFile(DATA_FILE, "utf-8", (err, data) => {
    if (err) return res.status(500).json({ message: "Error reading file" });
    res.json(JSON.parse(data || "[]"));
  });
});

// ✅ POST new property
app.post("/api/properties", (req, res) => {
  const newProperty = req.body;

  fs.readFile(DATA_FILE, "utf-8", (err, data) => {
    if (err) return res.status(500).json({ message: "Error reading file" });

    const properties = JSON.parse(data || "[]");
    newProperty.id = Date.now(); // simple ID
    properties.push(newProperty);

    fs.writeFile(DATA_FILE, JSON.stringify(properties, null, 2), (err) => {
      if (err) return res.status(500).json({ message: "Error writing file" });
      res.status(201).json(newProperty);
    });
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
