import { GRUPOS } from "../../config/config.js";
import { allUnits_groups } from "../../../index.js";

$(document).ready(function () { 
    $('#sidebar').html(`
    <button id="openBtn" class="btn btn-warning position-fixed top-0 start-0 m-2" style="z-index: 1040; display: none;">
        <i class="bi bi-chevron-right"></i> Abrir panel de grupos
    </button>

    <div class="p-1 border-bottom">
    <button id="toggleBtn" class="btn btn-sm btn-warning w-100">
        <i class="bi bi-chevron-left"></i> Ocultar panel
    </button>
    </div>
    <div class="p-1">
        <div class="btn-group-vertical w-100 gap-2" role="group" aria-label="Vertical button group" id="root-groups"></div>
    </div>`);
});

export const htmlCreatedModuleGroups = ( data ) => {
    $("#root-groups").html('')
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const _group = data[key];
            $("#root-groups").append(
                `<div class="card shadow-lg border-0 rounded-4 bg-dark-subtle w-100 p-3" onClick="htmlCreatedCardsByGroups('${_group.info.nameGroup}', '${_group.filter}')">
                    <div class="card-body d-flex align-items-center gap-3">
                        <!-- Icono -->
                        <img src="${_group.info.icon}" alt="Icono" class="img-fluid rounded-circle " style="width: 50px; height: 50px; object-fit: cover;">
                        <!-- Texto -->
                        <div>
                            <h6 class="text-uppercase text-secondary mb-1 fw-semibold">${_group.info.nameGroup}</h6>
                            <h4 class="text-dark-emphasis fw-bold m-0">${Object.keys(_group.units_temp.general).length} unidades</h4>
                        </div>
                    </div>
                </div>
            `)
        }
    }
    $("#loading").fadeOut();
}