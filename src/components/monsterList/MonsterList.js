import DB from "../../DB";
import getTemplate from "./template";
import Monster from "../monster/Monster";
// Chef d'orchestre : possède le tableau de Monster, parle à la DB,
// écoute les événements des Monster et gère le DOM de la liste.
export default class MonsterList {
    constructor(data) {
        DB.setApiURL(data.apiURL);
        this.domElt = document.querySelector(data.el);
        this.monsters = [];
        // Bonus : état du filtre et du tri
        this.search = "";
        this.sortKey = null; // propriété triée (name, type, dangerLevel, year)
        this.sortAsc = true; // true = croissant
    }
    // Charge depuis l'API et transforme le JSON brut en vraies instances de Monster
    async loadMonsters() {
        const monsters = await DB.findAll();
        this.monsters = monsters.map((monster) => new Monster(monster));
    }
    // Point d'entrée : charger, afficher le gabarit, puis tout brancher
    async render() {
        await this.loadMonsters();
        this.domElt.innerHTML = getTemplate(this);
        this.listDomElt = this.domElt.querySelector(".monster-list");
        this.renderMonsters();
        this.renderMonstersCount();
        this.initEvents();
    }
    // Vide le tableau puis affiche les créatures visibles (filtre + tri)
    renderMonsters() {
        this.listDomElt.innerHTML = "";
        this.getVisibleMonsters().forEach((monster) => this.listDomElt.append(monster.render()));
    }
    // getMonstersCount calcule, renderMonstersCount affiche : une méthode = une chose
    getMonstersCount() {
        return this.monsters.length;
    }
    renderMonstersCount() {
        this.domElt.querySelector(".monster-count").innerText = this.getMonstersCount();
    }
    storeInArray(monster) {
        this.monsters.push(new Monster(monster));
    }
    // Ordre suivi partout : API → tableau → DOM → compteur
    async store(data) {
        // 1. Ajouter dans l'API via DB.store
        const created = await DB.store(data);
        // 2. Ajouter dans le tableau
        this.storeInArray(created);
        // 3. Réafficher la liste (respecte le filtre)
        this.renderMonsters();
        // 4. Mettre à jour le compteur
        this.renderMonstersCount();
    }
    initEvents() {
        // Bouton Add : lire le formulaire, ignorer si vide, puis store()
        this.domElt.querySelector(".btn-add").addEventListener("click", () => {
            const name = this.domElt.querySelector(".new-name");
            const type = this.domElt.querySelector(".new-type");
            const dangerLevel = this.domElt.querySelector(".new-danger");
            const year = this.domElt.querySelector(".new-year");
            if (!name.value || !dangerLevel.value || !year.value) return;
            this.store({
                name: name.value,
                type: type.value,
                dangerLevel: Number(dangerLevel.value),
                year: Number(year.value),
            });
            // On vide le formulaire (le type garde sa valeur)
            name.value = "";
            dangerLevel.value = "";
            year.value = "";
        });
        // Les Monster émettent, la liste écoute : l'événement remonte du <tr> jusqu'au <tbody>
        this.listDomElt.addEventListener("monster:deleted", async (e) => {
            await this.deleteOneById(e.detail.id);
        });
        this.listDomElt.addEventListener("monster:updated", async (e) => {
            await this.updateOne(e.detail.monster);
        });
        // Bonus filtre : "input" se déclenche à chaque frappe
        this.domElt.querySelector(".search").addEventListener("input", (e) => {
            this.search = e.target.value;
            this.renderMonsters();
        });
        // Bonus tri : un clic sur un en-tête trie selon son data-sort
        this.domElt.querySelectorAll("[data-sort]").forEach((link) => {
            link.addEventListener("click", (e) => {
                // sans preventDefault, le href="#" ferait remonter la page en haut
                e.preventDefault();
                this.sortBy(link.dataset.sort);
            });
        });
    }
    async deleteOneById(id) {
        // 1. Supprimer dans l'API
        await DB.deleteOneById(id);
        // 2. Supprimer dans le tableau
        this.monsters.splice(
            this.monsters.findIndex((monster) => monster.id == id),
            1
        );
        // 3. Supprimer dans le DOM
        this.domElt.querySelector(`[data-id='${id}']`).remove();
        // 4. Mettre à jour le compteur
        this.renderMonstersCount();
    }
    // L'objet Monster s'est déjà mis à jour : il reste à prévenir l'API
    async updateOne(monster) {
        return await DB.updateOne(monster);
    }
    // Bonus : filtre par nom ou type, puis tri.
    // filter() renvoie une nouvelle liste : le tri ne modifie pas this.monsters
    getVisibleMonsters() {
        const search = this.search.toLowerCase();
        const monsters = this.monsters.filter(
            (monster) =>
                monster.name.toLowerCase().includes(search) ||
                monster.type.toLowerCase().includes(search)
        );
        if (this.sortKey) {
            monsters.sort((a, b) => {
                const result =
                    typeof a[this.sortKey] === "number"
                        ? a[this.sortKey] - b[this.sortKey]
                        : a[this.sortKey].localeCompare(b[this.sortKey]);
                return this.sortAsc ? result : -result;
            });
        }
        return monsters;
    }
    // Bonus : même colonne = inverse le sens, autre colonne = croissant
    sortBy(key) {
        this.sortAsc = this.sortKey === key ? !this.sortAsc : true;
        this.sortKey = key;
        this.renderMonsters();
    }
}