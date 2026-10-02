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
    }
}
