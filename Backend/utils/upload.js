const multer = require("multer");

const imageExtensions = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp"
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        if (!Object.prototype.hasOwnProperty.call(imageExtensions, file.mimetype)) {
            const error = new Error("Only JPG, PNG and WEBP images are allowed.");
            error.status = 400;
            return callback(error);
        }
        callback(null, true);
    }
});

module.exports = { upload, imageExtensions };
