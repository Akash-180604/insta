const multer = require ("multer");
 const path = require("path");

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./public")
    },
     filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Combine the unique suffix with the original extension
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
}
)

// Add a file filter function
const fileFilter = (req, file, cb) => {
    // Allowed mime types for common images and videos
    const allowedMimes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/quicktime'
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error("Invalid file type, only images and videos are allowed!"), false); // Reject file
    }
};


const upload = multer({storage,
     limits: {fileSize: 1024 * 1024 * 100}, // Limit file size to 100MB (adjust as needed)
    fileFilter: fileFilter // Add the file filter here
});

module.exports = upload;