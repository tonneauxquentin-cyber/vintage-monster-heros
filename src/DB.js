// Couche données : seule responsabilité = parler à l'API MockAPI.
// Méthodes statiques : on l'utilise directement (DB.findAll()), sans "new".
export default class DB {
    static setApiURL(url) {
        this.apiURL = url;
    }
    // READ : toutes les créatures
    static async findAll() {
        const response = await fetch(this.apiURL + "/creatures");
        return response.json();
    }
    // CREATE : renvoie la créature créée, avec son id généré par le serveur
    static async store(data) {
        const response = await fetch(this.apiURL + "/creatures", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return response.json();
    }
    // DELETE
    static async deleteOneById(id) {
        const response = await fetch(this.apiURL + "/creatures/" + id, {
            method: "DELETE",
        });
        return response.json();
    }
    // UPDATE : reçoit l'objet Monster entier
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