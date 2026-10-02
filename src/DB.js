export default class DB {
    static setApiURL(url) {
        this.apiURL = url;
    }
    static async findAll() {
        const response = await fetch(this.apiURL + "/creatures");
        return response.json();
    }
    static async store(data) {
        const response = await fetch(this.apiURL + "/creatures", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return response.json();
    }
}