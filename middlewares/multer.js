/* eslint-disable prettier/prettier */
import multer from "multer";
import Path from "path";

const storage = multer.memoryStorage(); // Important for React Native

const fileFilter = (req, file, callback) => {
    const acceptableExt = [".png", ".jpg", ".jpeg"];
    if (!acceptableExt.includes(Path.extname(file.originalname))) {

    }
    const fileSize = parseInt(req.headers["content-length"]);
    if (fileSize > 5048576) {
        return callback(new Error("File Size Big"));
    }

    callback(null, true);
};
const attachmentFilter = (req, file, callback) => {
    const acceptableExt = [".png", ".jpg", ".jpeg",".pdf", ".docx", ".xlsx"];
    console.log("File Name");
    console.log(Path.extname(file.originalname).toLowerCase());
    console.log(file)
    if (!acceptableExt.includes(Path.extname(file.originalname).toLowerCase())) {
        return callback(new Error("Invalid file type"));
    }

    const fileSize = parseInt(req.headers["content-length"]);
    if (fileSize > 5048576) {
        return callback(new Error("File Size Big"));
    }

    callback(null, true);
}

let upload = multer({
    fileFilter: fileFilter,
    fileSize: 1048576,
});
const fileUpload = multer({
    storage: storage,
    fileFilter: attachmentFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, 
});

const singleAvatar = upload.single("avatar");
const attachmentsMulter = fileUpload.single("files");

export  {singleAvatar,attachmentsMulter};