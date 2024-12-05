const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
const upload = multer({ dest: "uploads/" });

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected successfully!" });
});

app.post("/api/upload", upload.single("image"), (req, res) => {
  const file = req.file;

  const fileExtension = path.extname(file.originalname); // e.g., ".jpg", ".png"

  const newFileName = `${file.filename}${fileExtension}`;

  const newFilePath = path.join(file.destination, newFileName);

  fs.rename(file.path, newFilePath, (err) => {
    if (err) {
      return res.status(500).json({ error: "Error renaming file." });
    }

    // Construct the image URL with the correct extension
    const imageUrl = `${req.protocol}://${req.get(
      "host"
    )}/uploads/${newFileName}`;

    res.json({ url: imageUrl });
  });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.listen(5000, () => console.log("Server running on port 5000"));
