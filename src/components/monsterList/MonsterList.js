import DB from "../../DB";
import getTemplate from "./template";
import Monster from "../monster/Monster";

export default class MonsterList {
    constructor(data) {
        DB.setApiURL(data.apiURL);
        this.domElt = document.querySelector(data.el);
        this.monsters = [];
    }
    async loadMonsters() {
        const monsters = await DB.findAll();
        this.monsters = monsters.map((monster) => new Monster(monster));
    }
    async render() {
        await this.loadMonsters();
        this.domElt.innerHTML = getTemplate(this);
        this.listDomElt = this.domElt.querySelector(".monster-list");
        this.renderMonsters();
        this.renderMonstersCount();
        this.initEvents();
    }
    renderMonsters() {
        this.monsters.forEach((monster) => this.listDomElt.append(monster.render()));
    }
    getMonstersCount() {
        return this.monsters.length;
    }
    renderMonstersCount() {
        this.domElt.querySelector(".monster-count").innerText = this.getMonstersCount();
    }
    storeInArray(monster) {
        this.monsters.push(new Monster(monster));
    }
    storeInDOM(monster) {
        this.listDomElt.append(monster.render());
    }
    async store(data) {
        // 1. Ajouter dans l'API via DB.store
        const created = await DB.store(data);
        // 2. Ajouter dans le tableau
        this.storeInArray(created);
        // 3. Ajouter dans le DOM (le dernier élément du tableau est le nouveau)
        this.storeInDOM(this.monsters[this.monsters.length - 1]);
        // 4. Mettre à jour le compteur
        this.renderMonstersCount();
    }
    initEvents() {
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
            name.value = "";
            dangerLevel.value = "";
            year.value = "";
        });
    }
}