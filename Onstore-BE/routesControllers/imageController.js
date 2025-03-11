const Product = require("../Model/product");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const uploadImage = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    const image = req.files.image;
    const productId = req.body.productId;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required." });
    }

    const uploadDir = path.join(__dirname, "../images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imageName =
      crypto.randomBytes(20).toString("hex") + path.extname(image.name);
    const imagePath = path.join(uploadDir, imageName);

    image.mv(imagePath, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to upload image." });
      }
      try {
        // Use $push to atomically add the new image name to the array
        const product = await Product.findByIdAndUpdate(
          productId,
          { $push: { images: imageName } },
          { new: true, useFindAndModify: false }
        );

        if (!product) {
          return res
            .status(404)
            .json({ message: "Product not found during update." });
        }

        res.status(201).json({
          product: productId,
          message: "Image uploaded successfully.",
          imageName: imageName,
        }); // Return only the imageName
      } catch (updateError) {
        console.error("Error updating product:", updateError);
        return res
          .status(500)
          .json({
            message: "Failed to update product.",
            error: updateError.message,
          });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

const getImage = (req, res) => {
  const imageNameWithoutExtension = req.params.imageName;
  const imageDir = path.join(__dirname, "../images");

  // Read the directory to find the image with the matching name (without extension)
  fs.readdir(imageDir, (err, files) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Error reading image directory." });
    }

    const imageFile = files.find(
      (file) => path.parse(file).name === imageNameWithoutExtension
    );

    if (!imageFile) {
      return res.status(404).json({ message: "Image not found." });
    }

    const imagePath = path.join(imageDir, imageFile);
    const fileExtension = path.extname(imageFile).toLowerCase();
    let contentType;

    switch (fileExtension) {
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
      default:
        return res.status(400).json({ message: "Unsupported image format." });
    }

    fs.readFile(imagePath, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error reading image file." });
      }
      console.log("Getting image.");
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  });
};

module.exports = { uploadImage, getImage };
