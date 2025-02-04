/* eslint-disable prettier/prettier */
import multer from "multer";
import Path from "path";


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
let fileUpload = multer({
    fileFilter: attachmentFilter,
    fileSize: 1048576,
});

const singleAvatar = upload.single("avatar");
const attachmentsMulter = fileUpload.array("files", 5);

export  {singleAvatar,attachmentsMulter};