const html = 
        `<div class="card mb-3 col-3 shadow-sm border-0">
          <div class="row g-0 align-items-center">
            <div class="col-auto p-3">
              <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                <i class="bi bi-toggle-on text-success fs-4"></i>
              </div>
            </div>
            <div class="col ps-0">
              <div class="card-body py-3">
                <h6 class="card-title mb-1 text-muted">Encendidos</h6>
                <h4 class="mb-0 fw-bold">5</h4>
              </div>
            </div>
          </div>
        </div>`;

export const htmlCreateCardInfo = (data, filters, owner) => {
    
    for (let i = 0; i < filters.length; i++) {
        const element = filters[i];
        const _data = {
            name: filters[i], 
            data: data[filters[i]],
            length: Object.keys(data[filters[i]]).length,
            owner: owner
        }
        
        htmlCardInfo(_data);
    }
}

const htmlCardInfo = ( data ) => {
    $("#root-card-info").append(`
        <div class="card mb-3 col-2 shadow-sm border-0" onClick="getInfocard('${data.name}', '_${data.owner}', ${data.length})">
          <div class="row g-0 align-items-center">
            <div class="col-auto p-3">
              <div class="bg-${severity[data.name]} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center " style="width: 50px; height: 50px;">
                <i class="bi bi-${icons[data.name]} text-${severity[data.name]} fs-4"></i>
              </div>
            </div>
            <div class="col ps-0">
              <div class="card-body py-3">
                <h6 class="card-title mb-1 text-muted text-center">${data.name}</h6>
                <h4 class="mb-0 fw-bold text-center">${data.length}</h4>
              </div>
            </div>
          </div>
        </div>`);
}

const icons = {
    encendido: 'toggle-on',
    apagado: 'toggle-off',
    abierto: 'unlock-fill',
    cerrado: 'lock-fill',
    ok:      'battery-charging',
    falla:   'battery'

}

const severity = {
    abierto: 'success',
    cerrado: 'danger',
    encendido: 'success',
    apagado: 'danger',
    ok:      'success',
    falla:   'danger'

}