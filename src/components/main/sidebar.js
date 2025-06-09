$(document).ready(function () { 
    $('#sidebar').html(`
    <button id="openBtn" class="btn btn-primary position-fixed top-0 start-0 m-2" style="z-index: 1040; display: none;">
        <i class="bi bi-chevron-right"></i>
    </button>

    <div class="p-1 border-bottom">
    <button id="toggleBtn" class="btn btn-sm btn-warning w-100">
        <i class="bi bi-chevron-left"></i> Ocultar panel
    </button>
    </div>
    <div class="p-1">
        <div class="btn-group-vertical w-100 gap-2" role="group" aria-label="Vertical button group" id="root-groups">
            <button type="button" class="btn btn-primary">Button</button>
            <button type="button" class="btn btn-primary">Button</button>
            <button type="button" class="btn btn-primary">Button</button>
            <button type="button" class="btn btn-primary">Button</button>
        </div>
    </div>`);
});
