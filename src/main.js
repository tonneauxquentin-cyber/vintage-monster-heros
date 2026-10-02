import MonsterList from "./components/monsterList/MonsterList";

new MonsterList({
    el: "#monsters",
    apiURL: "https://6aba4fda5b549d818d62448a.mockapi.io",
}).render();