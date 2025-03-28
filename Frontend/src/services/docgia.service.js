import createApiClient from "./api.service";
class DocgiaService {
    constructor(baseUrl = "/api/docgia") {
        this.api = createApiClient(baseUrl);
    }
    async getAll() {
        return (await this.api.get("/")).data;
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
    async deleteAll() {
        return (await this.api.delete("/")).data;
    }
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
    async login(dienThoai, password) {
        const data = { dienThoai, password };
        const res = (await this.api.post(`/login`, data));
        return res?.data;
    }
    async findByPhone(dienThoai) {
        return (await this.api.get(`/phone/${dienThoai}`)).data;
    }

}
export default new DocgiaService();