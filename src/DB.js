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
    static async deleteOneById(id) {
        const response = await fetch(this.apiURL + "/creatures/" + id, {
            method: "DELETE",
        });
        return response.json();
    }
    static async updateOne(monster) {
        const response = await fetch(this.apiURL + "/creatures/" + monster.id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: monster.name,
                type: monster.type,
                dangerLevel: monster.dangerLevel,
                year: monster.year,
            }),
        });
        return response.json();
    }
}