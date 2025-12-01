import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // ➜ ambil ekstensi file asli (.jpg, .png, dll)
    const ext = path.extname(file.originalname);

    // ➜ simpan dengan ekstensi
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only jpeg, jpg, png files are allowed"), false);
};

export const upload = multer({ storage: storage, fileFilter });
