const Product = require("../Model/product");
const Collection = require("../Model/collection");
const ProductType = require("../Model/productType");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const uploadImage = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    const { productId, collectionId, productTypeId } = req.body;
    let modelName = null;
    let modelId = null;

    if (productId) {
      modelName = "Product";
      modelId = productId;
    } else if (collectionId) {
      modelName = "Collection";
      modelId = collectionId;
    } else if (productTypeId) {
      modelName = "ProductType";
      modelId = productTypeId;
    } else {
      return res
        .status(400)
        .json({ message: "Model ID (productId, collectionId or productTypeId) is required." });
    }

    const files = req.files.image; // Access files correctly

    if (!files) {
      return res.status(400).json({ message: "No image files found." });
    }

    // Ensure files is always an array (even if only one file was uploaded)
    const imageArray = Array.isArray(files) ? files : [files];

    const uploadDir = path.join(__dirname, "../images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadPromises = imageArray.map(async (image) => {
      const imageName =
        crypto.randomBytes(20).toString("hex") + path.extname(image.name);
      const imagePath = path.join(uploadDir, imageName);

      return new Promise((resolve, reject) => {
        image.mv(imagePath, async (err) => {
          if (err) {
            console.error(err);
            reject({ message: "Failed to upload image.", error: err });
            return;
          }
          try {
            let updateResult;

            if (modelName === "Product") {
              updateResult = await Product.findByIdAndUpdate(
                modelId,
                { $push: { images: imageName } },
                { new: true, useFindAndModify: false }
              );
            } else if (modelName === "Collection") {
              updateResult = await Collection.findByIdAndUpdate(
                modelId,
                { images: imageName }, // Overwrite existing image
                { new: true, useFindAndModify: false }
              );
            } else if (modelName === "ProductType") {
              updateResult = await ProductType.findByIdAndUpdate(
                modelId,
                { image: imageName }, // Overwrite existing image
                { new: true, useFindAndModify: false }
              );
            }

            if (!updateResult) {
              reject({ message: `${modelName} not found during update.` });
              return;
            }
            resolve({ imageName }); // Resolve with an object containing imageName
          } catch (updateError) {
            console.error("Error updating model:", updateError);
            reject({
              message: `Failed to update ${modelName}.`,
              error: updateError.message,
            });
          }
        });
      });
    });

    try {
      //  Get the results of all promises.
      const results = await Promise.all(uploadPromises);
      //results is now an array of {imageName: "..."}

      res.status(201).json({
        imageNames: results.map((r) => r.imageName), // Send back an array of image names
        message: "Images uploaded successfully.",
      });
    } catch (allErrors) {
      console.error("Error during uploads:", allErrors);
      res
        .status(500)
        .json({ message: "Failed to upload all images.", errors: allErrors });
    }
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
      case ".webp":
        contentType = "image/webp";
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

const deleteImage = async (req, res) => {
  try {
    const imageName = req.params.imageName;
    const imageDir = path.join(__dirname, "../images");
    const imagePath = path.join(imageDir, imageName);

    // Check if the image exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: "Image not found." });
    }

    // Delete the image
    fs.unlink(imagePath, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error deleting image." });
      }
      res.status(200).json({ message: "Image deleted successfully." });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

module.exports = { uploadImage, getImage, deleteImage };