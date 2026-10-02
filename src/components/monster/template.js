export default function getTemplate(monster) {
    const types = ["Giant reptile", "Alien", "Mutant", "Giant insect", "Robot", "Deep-sea creature"];

    return `
        <tr class="monster-row" data-id="${monster.id}">
            <td class="p-3 font-semibold">
                <span class="isEditing-hidden">${monster.name}</span>
                <input type="text" class="input-name isEditing-visible field" value="${monster.name}" />
            </td>
            <td class="p-3">
                <span class="isEditing-hidden">${monster.type}</span>
                <select class="input-type isEditing-visible field">
                    ${types.map((type) => `<option ${type === monster.type ? "selected" : ""}>${type}</option>`).join("")}
                </select>
            </td>
            <td class="p-3 whitespace-nowrap">
                <span class="isEditing-hidden">${monster.dangerLevel}</span>
                <input type="number" min="1" max="5" class="input-danger isEditing-visible field" value="${monster.dangerLevel}" />
            </td>
            <td class="p-3">
                <span class="isEditing-hidden">${monster.year}</span>
                <input type="number" min="1950" max="1969" class="input-year isEditing-visible field" value="${monster.year}" />
            </td>
            <td class="p-3">
                <div class="flex justify-end gap-2">
                    <button class="btn-check isEditing-visible btn btn-jade py-2 px-3" aria-label="Save">
                        <i class="fa-solid fa-check"></i>
                    </button>
                    <button class="btn-edit isEditing-hidden btn btn-gold py-2 px-3" aria-label="Edit">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-delete isEditing-hidden btn btn-lipstick py-2 px-3" aria-label="Delete">
                        <i class="fa-solid fa-skull"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}