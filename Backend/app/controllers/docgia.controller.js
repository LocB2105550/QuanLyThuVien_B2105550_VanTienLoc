const ApiError = require("../api-error");
const DocgiaService = require("../services/docgia.service");
const MongoDB = require("../utils/mongodb.util");

// Tạo mới
exports.create = async (req, res, next) => {
    try {
        const docgiaService = new DocgiaService(MongoDB.client);
        const docgia = await docgiaService.create(req.body);
        res.status(201).send(docgia);
    } catch (error) {
        console.error("Lỗi khi tạo độc giả:", error);
        next(new ApiError(500, "Không thể tạo độc giả"));
    }
};

// Tìm kiếm tất cả
exports.findAll = async (req, res, next) => {
    try {
        const docgiaService = new DocgiaService(MongoDB.client);
        const docgiaList = await docgiaService.findAll();
        res.send(docgiaList);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách độc giả:", error);
        next(new ApiError(500, "Không thể lấy danh sách độc giả"));
    }
};

// Tìm kiếm bằng ID
exports.findOne = async (req, res, next) => {
    try {
        const docgiaService = new DocgiaService(MongoDB.client);
        const docgia = await docgiaService.findById(req.params.id);
        if (!docgia) {
            return next(new ApiError(404, "Không tìm thấy độc giả"));
        }
        res.send(docgia);
    } catch (error) {
        next(new ApiError(500, "Lỗi khi tìm độc giả"));
    }
};

// Cập nhật độc giả
exports.update = async (req, res, next) => {
    try {
        const docgiaService = new DocgiaService(MongoDB.client);
        const docgia = await docgiaService.update(req.params.id, req.body);
        if (!docgia) {
            return next(new ApiError(404, "Không tìm thấy độc giả để cập nhật"));
        }
        res.send(docgia);
    } catch (error) {
        console.error("Lỗi khi cập nhật độc giả:", error);
        next(new ApiError(500, "Không thể cập nhật độc giả"));
    }
};

// Xóa độc giả
exports.delete = async (req, res, next) => {
    try {
        const docgiaService = new DocgiaService(MongoDB.client);
        const docgia = await docgiaService.delete(req.params.id);
        if (!docgia) {
            return next(new ApiError(404, "Không tìm thấy độc giả để xóa"));
        }
        res.send({ message: "Xóa độc giả thành công" });
    } catch (error) {
        next(new ApiError(500, "Không thể xóa độc giả"));
    }
};


// Xóa tất cả độc giả
exports.deleteAll = async (req, res, next) => {
    try {
        const docgiaService = new DocgiaService(MongoDB.client);
        await docgiaService.deleteAll();
        res.send({ message: "Xóa tất cả độc giả thành công" });
    } catch (error) {
        next(new ApiError(500, "Không thể xóa tất cả độc giả"));
    }
};

// Đăng nhập
exports.login = async (req, res, next) => {
    try {
        const docgiaService = new DocgiaService(MongoDB.client);
        const docgia = await docgiaService.login(req.body);
        res.send(docgia);
    } catch (error) {
        next(new ApiError(500, "Lỗi khi đăng nhập " + error.message));
    }
}

// Tìm kiếm độc giả bằng số điện thoại
exports.findByPhone = async (req, res, next) => {
    try {
        const docgiaService = new DocgiaService(MongoDB.client);
        const docgia = await docgiaService.findByPhone(req.params.phone);
        if (!docgia) {
            return next(new ApiError(404, "Không tìm thấy độc giả"));
        }
        res.send(docgia);
    } catch (error) {
        next(new ApiError(500, "Lỗi khi tìm độc giả " + error.message));
    }
}