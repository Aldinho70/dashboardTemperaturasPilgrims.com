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
        <div id="root_all"></div>
        <div id="root-gabinetes" ></div>
        <div id="root-status-bomba"></div>
        <div id="root-voltaje"></div>
    </div>`);
});
