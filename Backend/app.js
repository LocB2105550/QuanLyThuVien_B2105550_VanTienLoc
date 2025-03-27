const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error")

const app = express();

const docgiaRouter = require("./app/routes/docgia.route");
const muonRouter = require("./app/routes/muon.route");
const nhanvienRouter = require("./app/routes/nhanvien.route");
const nxbRouter = require("./app/routes/nhaxuatban.route");
const sachRouter = require("./app/routes/sach.route");
const uploadRouter = require("./app/routes/upload.route.js");

app.use(cors());
app.use(express.json());

app.use("/api/docgia", docgiaRouter);
app.use("/api/muon", muonRouter);
app.use("/api/nhanvien", nhanvienRouter);
app.use("/api/nhaxuatban", nxbRouter);
app.use("/api/sach", sachRouter);
app.use("/api/upload", uploadRouter);

// handle 404 response
app.use((req, res, next) => {
    // code ở đây sẽ chạy khi không có route được định nghĩa nào
    // khớp với yêu cầu. Gọi next để chuyên sang middleware xử lí lỗi
    return next(new ApiError(404, "Resource not found"))
})

// define error-handling middleware last, after other app.use() and routes calls
app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        message: error.message || "Internal server error"
    })
})

module.exports = app;