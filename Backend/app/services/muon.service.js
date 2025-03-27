const { ObjectId } = require('mongodb');
const ApiError = require('../api-error');

class MuonService {
    constructor(client) {
        this.client = client;
        this.Muon = this.client.db("QuanLyMuonSach").collection("muon");
        this.Docgia = this.client.db("QuanLyMuonSach").collection("docgia");
        this.Sach = this.client.db("QuanLyMuonSach").collection("sach");
    }

    // Hàm parseDate để chuyển đổi định dạng ngày từ chuỗi 'dd/MM/yyyy' sang đối tượng Date
    parseDate(dateString) {
        const [day, month, year] = dateString.split('-');
        return new Date(`${year}-${month}-${day}T00:00:00Z`);
    }

    // Hàm trích xuất dữ liệu mượn sách từ payload  
    extractMuonData(payload) {
        const today = new Date();
        const muon = {
            maDocGia: new ObjectId(payload.maDocGia),
            maSach: new ObjectId(payload.maSach),
            ngayMuon: today,
            ngayTra: payload.ngayTra ? this.parseDate(payload.ngayTra) : null,
            status: payload.status || "Đang mượn"
        };

        Object.keys(muon).forEach(key => muon[key] === undefined && delete muon[key]);
        return muon;
    }



    // Phương thức để thêm thông tin mượn sách mới
    async create(payload) {
        const muon = this.extractMuonData(payload);

        // Kiểm tra sự tồn tại của độc giả
        const docgia = await this.Docgia.findOne({ _id: new ObjectId(muon.maDocGia) });
        if (!docgia) {
            throw new ApiError(404, `Độc giả với ID ${muon.maDocGia} không tồn tại.`);
        }

        // Kiểm tra sự tồn tại của sách
        const sach = await this.Sach.findOne({ _id: new ObjectId(muon.maSach) });
        if (!sach) {
            throw new ApiError(404, `Sách với ID ${muon.maSach} không tồn tại.`);
        }

        // console.log(sach.soquyen);
        // Kiểm tra số quyển còn lại của sách
        if (sach.soquyen <= 0) {
            throw new ApiError(400, `Sách với ID ${muon.maSach} hiện không còn quyển nào để mượn.`);
        }

        // Thêm thông tin mượn sách vào cơ sở dữ liệu
        const result = await this.Muon.insertOne(muon);

        // Giảm số lượng sách sau khi mượn thành công
        await this.Sach.updateOne(
            { _id: new ObjectId(muon.maSach) },
            { $inc: { soquyen: -1 } }  // Giảm soQuyen đi 1
        );

        return result;
    }


    async findAll() {
        const result = await this.Muon.aggregate([
            {
                $lookup: {
                    from: "docgia",  // Tên collection độc giả
                    localField: "maDocGia",  // Trường maDocGia trong collection Muon
                    foreignField: "_id",  // Trường _id trong collection Docgia
                    as: "docGiaInfo"  // Alias để chứa thông tin độc giả
                }
            },
            {
                $unwind: {
                    path: "$docGiaInfo",  // Giải nén mảng docGiaInfo (giả sử có 1 độc giả)
                    preserveNullAndEmptyArrays: true // Giữ lại những sách không có thông tin độc giả
                }
            },
            {
                $lookup: {
                    from: "sach",  // Tên collection sách
                    localField: "maSach",  // Trường maSach trong collection Muon
                    foreignField: "_id",  // Trường _id trong collection Sach
                    as: "sachInfo"  // Alias để chứa thông tin sách
                }
            },
            {
                $unwind: {
                    path: "$sachInfo",  // Giải nén mảng sachInfo (giả sử có 1 sách)
                    preserveNullAndEmptyArrays: true // Giữ lại những sách không có thông tin sách
                }
            },
            {
                $project: {  // Lựa chọn các trường cần trả về
                    _id: 1,
                    maDocGia: 1,
                    maSach: 1,
                    ngayMuon: 1,
                    ngayTra: 1,
                    status: 1,
                    docGiaInfo: 1,  // Thông tin độc giả
                    sachInfo: 1,    // Thông tin sách
                }
            }
        ]).toArray();

        // Debug: Kiểm tra kết quả trả về
        // console.log(result);
        return result;
    }

    // Phương thức để tìm thông tin mượn sách theo ID
    async findById(id) {
        const result = await this.Muon.aggregate([
            {
                $match: { _id: new ObjectId(id) }  // Chỉ tìm bản ghi với ID được cung cấp
            },
            {
                $lookup: {
                    from: "docgia",  // Tên collection độc giả
                    localField: "maDocGia",  // Trường maDocGia trong collection Muon
                    foreignField: "_id",  // Trường _id trong collection Docgia
                    as: "docGiaInfo"  // Alias để chứa thông tin độc giả
                }
            },
            {
                $unwind: {
                    path: "$docGiaInfo",  // Giải nén mảng docGiaInfo
                    preserveNullAndEmptyArrays: true  // Giữ lại các bản ghi không có thông tin độc giả
                }
            },
            {
                $lookup: {
                    from: "sach",  // Tên collection sách
                    localField: "maSach",  // Trường maSach trong collection Muon
                    foreignField: "_id",  // Trường _id trong collection Sach
                    as: "sachInfo"  // Alias để chứa thông tin sách
                }
            },
            {
                $unwind: {
                    path: "$sachInfo",  // Giải nén mảng sachInfo
                    preserveNullAndEmptyArrays: true  // Giữ lại các bản ghi không có thông tin sách
                }
            },
            {
                $project: {  // Lựa chọn các trường cần trả về
                    _id: 1,
                    maDocGia: 1,
                    maSach: 1,
                    ngayMuon: 1,
                    ngayTra: 1,
                    status: 1,
                    docGiaInfo: 1,  // Thông tin độc giả
                    sachInfo: 1     // Thông tin sách
                }
            }
        ]).toArray();

        if (!result.length) {
            throw new ApiError(404, `Thông tin mượn sách với ID ${id} không tồn tại.`);
        }

        // Trả về kết quả đầu tiên vì chỉ có một bản ghi với ID được tìm kiếm
        return result[0];
    }


    // Phương thức để cập nhật thông tin mượn sách
    async update(id, payload) {
        const muon = this.extractMuonData(payload);
        if (muon.status === "Đã trả") {
            muon.ngayTra = new Date();
        }
        console.log(muon);
        const result = await this.Muon.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: muon },
            { returnDocument: "after" }
        );
        if (!result) {
            throw new ApiError(404, `Thông tin mượn sách với ID ${id} không tồn tại.`);
        }
        return result;
    }

    // Phương thức để xóa thông tin mượn sách
    async delete(id) {
        const result = await this.Muon.findOneAndDelete({ _id: new ObjectId(id) });
        if (!result) {
            throw new ApiError(404, `Thông tin mượn sách với ID ${id} không tồn tại.`);
        }
        return result;
    }

    // Phương thức để xóa tất cả thông tin mượn sách
    async deleteAll() {
        const result = await this.Muon.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = MuonService;