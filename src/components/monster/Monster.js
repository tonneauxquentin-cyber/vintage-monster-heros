import getTemplate from "./template";
export default class Monster {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.type = data.type;
        this.dangerLevel = data.dangerLevel;
        this.year = data.year;
        this.domElt = null;
    }
    get skulls() {
        return "☠️".repeat(this.dangerLevel);
    }
    render() {
        const template = document.createElement("template");
        template.innerHTML = getTemplate(this);
        this.domElt = template.content.firstElementChild;
        this.initEvents();
        return this.domElt;
    }
    dispatch(type, detail) {
        this.domElt.dispatchEvent(new CustomEvent(type, { bubbles: true, detail }));
    }
    initEvents() {
        this.domElt.querySelector(".btn-delete").addEventListener("click", () => {
            this.dispatch("monster:deleted", { id: this.id });
        });
        this.domElt.querySelector(".btn-edit").addEventListener("click", () => {
            this.domElt.classList.add("isEditing");
        });
        this.domElt.querySelector(".btn-check").addEventListener("click", () => {
            this.update({
                name: this.domElt.querySelector(".input-name").value,
                type: this.domElt.querySelector(".input-type").value,
                dangerLevel: Number(this.domElt.querySelector(".input-danger").value),
                year: Number(this.domElt.querySelector(".input-year").value),
            });
        });
    }
    update(data) {
        this.name = data.name;
        this.type = data.type;
        this.dangerLevel = data.dangerLevel;
        this.year = data.year;
        this.domElt.querySelector(".monster-name").innerText = this.name;
        this.domElt.querySelector(".monster-type").innerText = this.type;
        this.domElt.querySelector(".monster-danger").innerText = this.skulls;
        this.domElt.querySelector(".monster-danger").title = "Danger level " + this.dangerLevel;
        this.domElt.querySelector(".monster-year").innerText = this.year;
        this.domElt.classList.remove("isEditing");
        this.dispatch("monster:updated", { monster: this });
    }
}
