import getTemplate from "./template";
// Représente UNE créature : ses propriétés et sa ligne <tr>.
// Il ne parle jamais à l'API et ne connaît pas MonsterList :
// il émet des événements, et c'est la liste qui décide quoi faire.
export default class Monster {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.type = data.type;
        // Number() : certaines données de l'API peuvent être du texte ("1956")
        this.dangerLevel = Number(data.dangerLevel);
        this.year = Number(data.year);
        this.domElt = null; // le <tr>, rempli par render()
    }
    // Bonus : niveau de danger en têtes de mort (niveau 3 → ☠️☠️☠️)
    get skulls() {
        return "☠️".repeat(this.dangerLevel);
    }
    // Fabrique le <tr> et le retourne : c'est MonsterList qui décide où l'ajouter
    render() {
        const template = document.createElement("template");
        template.innerHTML = getTemplate(this);
        this.domElt = template.content.firstElementChild;
        this.initEvents();
        return this.domElt;
    }
    // Envoie un signal vers le parent (bubbles : l'événement remonte dans le DOM)
    dispatch(type, detail) {
        this.domElt.dispatchEvent(new CustomEvent(type, { bubbles: true, detail }));
    }
    initEvents() {
        // Crâne : demande la suppression (la liste s'en occupe)
        this.domElt.querySelector(".btn-delete").addEventListener("click", () => {
            this.dispatch("monster:deleted", { id: this.id });
        });
        // Crayon : passe la ligne en mode édition (CSS du gabarit)
        this.domElt.querySelector(".btn-edit").addEventListener("click", () => {
            this.domElt.classList.add("isEditing");
        });
        // Coche : lit les champs et valide la modification
        this.domElt.querySelector(".btn-check").addEventListener("click", () => {
            this.update({
                name: this.domElt.querySelector(".input-name").value,
                type: this.domElt.querySelector(".input-type").value,
                dangerLevel: Number(this.domElt.querySelector(".input-danger").value),
                year: Number(this.domElt.querySelector(".input-year").value),
            });
        });
    }
    // Met à jour l'objet ET l'affichage, puis prévient le parent
    update(data) {
        // 1. Les propriétés de l'objet
        this.name = data.name;
        this.type = data.type;
        this.dangerLevel = data.dangerLevel;
        this.year = data.year;
        // 2. Les textes affichés
        this.domElt.querySelector(".monster-name").innerText = this.name;
        this.domElt.querySelector(".monster-type").innerText = this.type;
        this.domElt.querySelector(".monster-danger").innerText = this.skulls;
        this.domElt.querySelector(".monster-danger").title = "Danger level " + this.dangerLevel;
        this.domElt.querySelector(".monster-year").innerText = this.year;
        // 3. Retour en mode affichage, puis signal vers MonsterList (qui appelle l'API)
        this.domElt.classList.remove("isEditing");
        this.dispatch("monster:updated", { monster: this });
    }
}
