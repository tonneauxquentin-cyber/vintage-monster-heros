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
    }
}