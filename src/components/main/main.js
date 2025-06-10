// import {units} from '../../../index.js'
import { getFechaActual } from '../../utils/timestamp.js'
$(document).ready(function () {
  $('#mainContent').html(`
    <span class="text-light" id="root-fecha" >Ultima actualizacion: ${getFechaActual()}<span>
    <!-- root-notification-->
      <div class="accordion" id="accordionNotificaciones">
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingNotif">
            <button class="accordion-button collapsed w-100" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNotif" aria-expanded="false" aria-controls="collapseNotif">
              <div class="d-flex justify-content-between align-items-center w-100">
                <div class="d-flex align-items-center">
                  <i class="bi bi-bell me-2 text-warning fs-4"></i>
                  <span class="fs-4">Panel de Notificaciones</span>
                  <span class="badge bg-warning ms-2 btn-lg" id="notif-count">0</span>
                </div>                
              </div>
            </button>
          </h2>

          <div id="collapseNotif" class="accordion-collapse collapse" aria-labelledby="headingNotif" data-bs-parent="#accordionNotificaciones">
            <div class="accordion-body">
              <div class="container" id="root-main-notifation">
              <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal" >
                Abrir panel completo de notificaciones
              </button>
              <div class="overflow-auto bg-white border border-2 rounded-3 shadow-sm text-center text-muted root-notification " style="max-height: 100px;" >
                <h6 class="mb-0" id="root-notification-nobody">
                  <i class="bi bi-bell-slash me-2 fs-5"></i>Sin notificaciones aún
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- root-notification-->

    <hr class="text-light">

    <div class="container " id="root-main-1">
      <!--Card info-->
      <div class="row" id="root-card-info"></div>
      <!--Card-->
      <h2 class="mb-4 text-light"> Panel de temperaturas</h2>
      <hr class="text-light">      
      <!--Card norias-->
      <div class="row row-cols-1 row-cols-md-3 g-4" id="root-card"></div>
      <!--Card-->
    </div>
    <div class="container py-4 d-none" id="root-main-2">
      <h2 class="mb-4 text-light" id="root-categori" >Panel de temperaturas</h2>
      <div class="accordion overflow-auto" id="root-list-card" style="max-height: 500px;"></div>
    </div>

    <!--modal-notification-->
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Panel de notificaciones</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body-notifications root-notification"></div>
            <div class="modal-footer"></div>
          </div>
        </div>
      </div>
    <!--modal-notification-->
`);
});

export const htmlCreateCard = (data) => {
  $("#root-card").html('')
  data.map(unit => {
    const sensorTemperatura = unit.sensors.find(s => s.nombre === "TEMPERATURA DASHBOARD");
    if(sensorTemperatura){
      $('#root-card').append(`
        <!-- Tarjeta Noria -->
            <div class="col">
              <div class="card shadow-lg border-0 rounded-4 bg-light ${ (sensorTemperatura.valor > 200) ? 'temp-hot' : 'temp-cold' }">
                <div class="card-body">
                  <h5 class="card-title fw-bold fs-5 text-light mb-2">
                    <img src="${unit.icon}" class="img-thumbnail" alt="15">
                    <span class="text-light">${unit.name}</span>
                  </h5>
                  <p class="text-muted small mb-3">
                    <i class="bi bi-clock me-1 text-light"></i> 
                    <span class="text-light">Último mensaje: ${unit.dateParsed}</span>
                  </p>
                  <h1 class="text-light text-center">${sensorTemperatura.valor} °C</h1>
                </div>
              </div>
            </div>
        <!-- Repetir dinámicamente -->`);
    }
  })
}

// export const htmListCard = (data) => {
//   $('#root-card').html('');
//   console.log(data);
//   for (const key in data) {
//     if (Object.prototype.hasOwnProperty.call(data, key)) {
//       const unit = data[key];

//       const sensorGabinete = unit.sensors.find(s => s.nombre === "GABINETE");
//       const sensorEstado = unit.sensors.find(s => s.nombre === "BOMBA");
//       const voltaje = unit.sensors.find(s => s.nombre === "VOLTAJE EXTERNO");

//       $('#root-card').append(`
//          <!-- Tarjeta estilo lista -->
// <div class="mb-3">
//   <div class="card border-0 shadow-sm rounded-3">
//     <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center">
//       <div>
//         <h5 class="fw-bold text-dark mb-1">
//           <i class="bi bi-gear-fill me-2"></i> ${unit.name}
//         </h5>
//         <small class="text-muted">
//           <i class="bi bi-clock me-1"></i> Último mensaje: ${unit.dateParsed}
//         </small>
//       </div>

//       <ul class="list-unstyled mt-3 mt-md-0 mb-0">
//         <li class="d-flex align-items-center mb-1">
//           <i class="bi bi-${(sensorEstado.valor == 1) ? `toggle-on text-success` : `toggle-off text-danger`} me-2"></i>
//           <span class="me-2">Estado:</span>
//           <span class="fw-semibold text-${(sensorEstado.valor == 1) ? `success` : `danger`}">
//             ${(sensorEstado.valor == 1) ? `Encendido` : `Apagado`}
//           </span>
//         </li>
//         <li class="d-flex align-items-center mb-1">
//           <i class="bi bi-${(sensorGabinete.valor != 1) ? `lock-fill text-danger` : `unlock-fill text-success`} me-2"></i>
//           <span class="me-2">Gabinete:</span>
//           <span class="fw-semibold text-${(sensorGabinete.valor != 1) ? `danger` : `success`}">
//             ${(sensorGabinete.valor == 'N/A') ? `Error de sensor` : (sensorGabinete.valor) == 0 ? `Cerrado` : `Abierto`}
//           </span>
//         </li>
//         <li class="d-flex align-items-center">
//           <i class="bi bi-${(voltaje.valor != 'N/A') ? `battery-charging text-warning` : `battery text-danger`} me-2"></i>
//           <span class="me-2">Voltaje:</span>
//           <span class="fw-semibold text-${(voltaje.valor === 'N/A') ? `danger` : `warning`}">
//             ${(voltaje.valor === 'N/A') ? 'Error de sensor' : voltaje.valor}
//           </span>
//         </li>
//       </ul>
//     </div>
//   </div>
// </div>
// `);
//     }
//   }
// }

export const htmListCard = (data, name, total = 0) => {
  $('#root-list-card').html('');
  $('#root-card').addClass('d-none')
  $('#root-main-2').removeClass('d-none')
  $('#root-categori').html(`${name}: ${total} unidades.`)
  let index = 0;

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const unit = data[key];
      const sensorGabinete = unit.sensors.find(s => s.nombre === "GABINETE");
      const sensorEstado = unit.sensors.find(s => s.nombre === "BOMBA");
      const voltaje = unit.sensors.find(s => s.nombre === "VOLTAJE EXTERNO");

      const estadoIcon = (sensorEstado.valor == 1) ? `toggle-on text-success` : `toggle-off text-danger`;
      const gabineteIcon = (sensorGabinete.valor != 1) ? `lock-fill text-danger` : `unlock-fill text-success`;
      const voltajeIcon = (voltaje.valor != 'N/A') ? `battery-charging text-warning` : `battery text-danger`;

      $('#root-list-card').append(`
        <div class="accordion-item mb-2">
          <h2 class="accordion-header" id="heading-${index}">
            <button class="accordion-button collapsed d-flex justify-content-between align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${index}" aria-expanded="false" aria-controls="collapse-${index}">
              <div class="d-flex flex-column flex-md-row w-100 justify-content-between align-items-center">
                <span class="fw-bold">
                  <i class="bi bi-gear-fill me-2"></i> ${unit.name}
                </span>
                <span>
                  <i class="bi bi-${estadoIcon} me-2"></i>
                  <i class="bi bi-${gabineteIcon} me-2"></i>
                  <i class="bi bi-${voltajeIcon}"></i>
                </span>
              </div>
            </button>
          </h2>
          <div id="collapse-${index}" class="accordion-collapse collapse" aria-labelledby="heading-${index}" data-bs-parent="#root-card">
            <div class="accordion-body">
              <p class="text-muted mb-3"><i class="bi bi-clock me-1"></i> Último mensaje: ${unit.dateParsed}</p>
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <span><i class="bi bi-${estadoIcon} me-2"></i> Estado</span>
                  <span class="fw-semibold text-${(sensorEstado.valor == 1) ? 'success' : 'danger'}">${(sensorEstado.valor == 1) ? 'Encendido' : 'Apagado'}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <span><i class="bi bi-${gabineteIcon} me-2"></i> Gabinete</span>
                  <span class="fw-semibold text-${(sensorGabinete.valor != 1) ? 'danger' : 'success'}">
                    ${(sensorGabinete.valor == 'N/A') ? 'Cerrado' : (sensorGabinete.valor == 0 ? 'Cerrado' : 'Abierto')}
                  </span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <span><i class="bi bi-${voltajeIcon} me-2"></i> Voltaje</span>
                  <span class="fw-semibold text-${(voltaje.valor === 'N/A') ? 'danger' : 'warning'}">
                    ${voltaje.valor}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      `);
      index++;
    }
  }
};

export const htmlListCardbyName = (name) => {
  console.log(name);
  console.log(units[name]);
  
  
}
