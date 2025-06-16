// import {units} from '../../../index.js'
import { getFechaActual } from '../../utils/timestamp.js'
import { GRUPOS_FILTER } from '../../config/config.js';

$(document).ready(function () {
  $('#mainContent').html(`
    
    <center>
        <div id="loading" class="p-5">
        <img src="./src/img/logojd.png" alt="Cargando..." /><br>
        
        <h1 class="text-dark">Cargando informacion...</h1>
        </div>
    </center>
    
    <h6 class="text-light" id="root-fecha" >Ultima actualizacion: ${getFechaActual()}<h6>
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
      <div class="d-flex align-items-center gap-3 mb-4">
        <img 
          src="https://c0.klipartz.com/pngpicture/994/729/gratis-png-cartel-de-signo-de-exclamacion-icono-de-exclamacion.png" 
          alt="Icono" 
          class="img-fluid rounded-circle" 
          id="root-icon-group"
          style="width: 35px; height: 35px; object-fit: cover;"
        >
        <h2 class="mb-0 text-light" id="root-categori">Panel de temperaturas</h2>
      </div>

      <hr class="text-light">      
      <!--Card norias-->
      <div class="row row-cols-1 row-cols-md-3 g-4 overflow-auto" id="root-card" style="max-height: 74vh;"></div>
      <!--Card-->
    </div>
    <div class="container py-4 d-none" id="root-main-2">
      <img src="https://c0.klipartz.com/pngpicture/994/729/gratis-png-cartel-de-signo-de-exclamacion-icono-de-exclamacion.png" alt="Icono" class="img-fluid rounded-circle " style="width: 50px; height: 50px; object-fit: cover;">
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
  $("#loading").fadeIn();
});

export const htmlCreateCard = (info_groups = {}, data, filter = '') => {
  $("#root-card").html('');
  $("#root-categori").text(info_groups.info.nameGroup);
  $('#root-icon-group').attr('src', info_groups.info.icon);
  data.forEach((unit, unitIndex) => {
    // console.log((unit));
    
    const _temperaturas = [];
    let class_temp = `temp-cold`;

    GRUPOS_FILTER[filter].SENSOR.forEach(sensor => {
      const sensorTemperatura = unit.sensors.find(s => s.nombre === sensor);
      if (sensorTemperatura) {
        class_temp = GRUPOS_FILTER[filter].getState(sensorTemperatura.valor);
        _temperaturas.push({ 
          name: sensorTemperatura.nombre, 
          subname: sensor, 
          value: sensorTemperatura.valor 
        });
      }
    });

    // Construir el HTML de la tarjeta
    let cardHtml = `
      <div class="col">
        <div class="card bg-dark text-light shadow rounded-4 p-3 border-0 ${class_temp}">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="d-flex align-items-center">
              <img src="${unit.icon}" alt="Icono" class="rounded-circle me-2" style="width: 40px; height: 40px; object-fit: cover;">
              <h5 class="mb-0 fw-semibold">${unit.name}</h5>
            </div>
            <div>
              <i class="bi bi-thermometer-half fs-4 text-light"></i>
            </div>
          </div>

          <p class="small text-ligth mb-3">
            <i class="bi bi-clock me-1"></i> Último mensaje: ${unit.dateParsed}
          </p>
    `;

    _temperaturas.forEach((temp, tempIndex) => {
      // Crear ID único con índices si no hay ID disponible
      const chartId = `chart-${unitIndex}-${tempIndex}`;
      cardHtml += `
        <div class="mb-4">
          <h6 class="text-uppercase  text-center small text-light">${temp.subname}</h6>
          <h2 class="text-center ${temp.value >= 200 ? 'text-light' : 'text-light'} fw-bold">
            ${temp.value >= 200 ? `Error: ${temp.value}⁉️` : `${temp.value} °C`}
          </h2>
          <div class="w-100" id="${chartId}" style="height: 150px; border-radius: 30px">
            <h2 class="text-center text-light fw-bold">
              La unidad no presenta historial
            </h2>
          </div>
        </div>
      `;

      // 🔁 Programar la gráfica para renderizar después del append
      setTimeout(() => {

        Highcharts.chart(chartId, {
          chart: {
            type: 'line',
            backgroundColor: 'transparent'
          },
          title: { text: null },
          xAxis: {
            // categories: dataExample.map(d => d.time),
            categories: unit.tempsToday[temp.subname].tiempos,
            labels: { style: { color: 'white' } }
          },
          yAxis: {
            title: { text: '°C', style: { color: 'white' } },
            labels: { style: { color: 'white' } }
          },
          tooltip: {
            backgroundColor: '#333',
            borderColor: '#888',
            style: { color: 'white' },
            formatter: function () {
              return `<b>Temperatura:</b> ${this.y} °C<br><b>Hora:</b> ${this.key}`;
            }
          },
          series: [{
            name: 'Temperatura',
            // data: dataExample.map(d => d.temp),
            data: unit.tempsToday[temp.subname].valores,
            color: 'white'
          }],
          legend: { enabled: false },
          credits: { enabled: false }
        });
      }, 0); // Garantiza que el DOM esté listo
    });

    cardHtml += `</div></div>`;
    $('#root-card').append(cardHtml);
  });
};

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

function getLoading(tag) {
    $(tag).fadeIn();
    // setTimeout(() => {
    //     $(tag).fadeOut();
    // }, 3000);
}