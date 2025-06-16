// import { getGPS, getInfo, getPersonalizados, getSensores, getState } from "./getDevice.js";
import { getSensorValues, getSensorsValueByMessages } from "./getSensors.js";
import { convertTimestamp } from "../../utils/timestamp.js";
import { GRUPOS, GRUPOS_FILTER } from "../../config/config.js";
import MessagesService from "./getMessages.js";

const conexion = wialon.core.Session.getInstance();

export const getGrupos = async (groups) => {
  const _groups = {};
  const key = Object.keys(GRUPOS_FILTER);

  const promesas = groups.map(async (group) => {
    const name_group = group.getName();
    const _key = key.find((clave) => name_group.toUpperCase().includes(clave));

    if (GRUPOS_FILTER[_key]) {
      if (GRUPOS_FILTER[_key].GRUPOS.includes(name_group)) {
        const objeto = {
          info: getInfoGroup(group),
          units_temp: await getUnitsGroup(group, GRUPOS_FILTER[_key].SENSOR),
          filter: _key,
        };
        _groups[name_group] = objeto;
      }
    }
  });

  // Espera a que todas las promesas terminen
  await Promise.all(promesas);

  return _groups;
};


export const getInfoGroup = ( group ) =>{
    return {
        nameGroup: group.getName(),
        idGroup: group.getId(),
        icon: group.getIconUrl(32), 
        units: group.getUnits(),
    }
}

export const getUnitsGroup = async ( group, array_temp ) => {
  const _temperatura = { general: {} };
  const idUnits = group.getUnits();
  
  for (const element of idUnits) {
    const temps = [];
    const _unit = conexion.getItem(element);        
    const name = _unit.getName();
    const sensors = getSensorValues(_unit);
    const icon = _unit.getIconUrl(32);
    const last_message = _unit.getLastMessage();
    const dateParsed = (last_message) ? convertTimestamp(last_message.t) : 0;

    // Esperamos correctamente la función async
    const tempsToday = await getMessagesbyId(_unit, array_temp);
    
    const unidad = {
      name,
      sensors,
      last_message,
      dateParsed,
      icon,
      tempsToday,
    };

    array_temp.map(temp => {
      const temperatura = sensors.find(s => s.nombre === temp);
      if (temperatura) {
        temps.push({ [temperatura.nombre]: temperatura.valor });
      }
    });

    _temperatura.general[name] = { unidad, temps };
  }

  return _temperatura;
};



const getMessagesbyId = async ( unit, sensores ) =>{
    const id = unit.getId();
    const name = unit.getName();
    const unit_messages = await MessagesService.loadMessagesToday( id );
    const { messages, count } = unit_messages;

    // if( name == 'MTY-C 02' ){
    //   console.log(messages);
    //   console.log(sensores);
      
    // }
    
    let sensorsByMessages = getSensorsValueByMessages(unit, messages, sensores); 
    // console.log( name );
    // console.log(sensorsByMessages );
    
    const datosProcesados = agruparTemperaturasPorSensorYHora(sensorsByMessages);
    return datosProcesados;
}

// function agruparTemperaturasPorSensorYHora(data) {
//   const resultado = {};

//   data.forEach(obj => {
//     const timestamp = Number(Object.keys(obj)[0]);
//     const lecturas = obj[timestamp];

//     // Convertir timestamp a hora redondeada (HH:00)
//     const fecha = new Date(timestamp * 1000); // asumiendo que el timestamp viene en segundos
//     const hora = `${fecha.getHours().toString().padStart(2, '0')}:00`;

//     lecturas.forEach(sensor => {
//       const nombre = sensor.nombre;
//       const valor = sensor.valor;

//       if (!resultado[nombre]) {
//         resultado[nombre] = {
//           tiempos: {},
//         };
//       }

//       if (!resultado[nombre].tiempos[hora]) {
//         resultado[nombre].tiempos[hora] = [];
//       }

//       resultado[nombre].tiempos[hora].push(valor);
//     });
//   });

//   // Promediar valores y transformar a array final
//   const resultadoFinal = {};
//   Object.entries(resultado).forEach(([nombre, datos]) => {
//     const tiempos = Object.keys(datos.tiempos).sort(); // ordenar por hora
//     const valores = tiempos.map(hora => {
//       const arr = datos.tiempos[hora];
//       const suma = arr.reduce((acc, val) => acc + val, 0);
//       return +(suma / arr.length).toFixed(2); // promedio con 2 decimales
//     });

//     resultadoFinal[nombre] = {
//       tiempos,
//       valores,
//     };
//   });

//   return resultadoFinal;
// }

function agruparTemperaturasPorSensorYHora(data) {
  const resultado = {};
  if (!Array.isArray(data) || data.length === 0) return {};

  // Encontrar el primer timestamp real
  const primerObj = data.find(obj => obj && typeof obj === 'object' && Object.keys(obj).length > 0);
  const primerTimestamp = Number(Object.keys(primerObj)[0]);
  const primerFecha = new Date(primerTimestamp * 1000);

  // Hora de inicio del primer bloque (redondeado hacia abajo a la hora)
  primerFecha.setMinutes(0, 0, 0);
  let inicioBloque = new Date(primerFecha);

  // Calcular fecha actual local redondeada a la siguiente hora
  const ahora = new Date();
  ahora.setMinutes(0, 0, 0);

  // Convertir datos a { timestamp, lecturas } y ordenarlos por tiempo
  const datosOrdenados = data.map(obj => {
    const ts = Number(Object.keys(obj)[0]);
    return { timestamp: ts, lecturas: obj[ts] };
  }).sort((a, b) => a.timestamp - b.timestamp);

  while (inicioBloque <= ahora) {
    const finBloque = new Date(inicioBloque);
    finBloque.setHours(finBloque.getHours() + 1);

    const inicioSeg = Math.floor(inicioBloque.getTime() / 1000);
    const finSeg = Math.floor(finBloque.getTime() / 1000);

    const lecturasEnBloque = datosOrdenados.filter(d =>
      d.timestamp >= inicioSeg && d.timestamp < finSeg
    );

    lecturasEnBloque.forEach(({ lecturas }) => {
      lecturas.forEach(sensor => {
        const nombre = sensor.nombre;
        const valor = sensor.valor;

        if (!resultado[nombre]) resultado[nombre] = { tiempos: {}, orden: [] };

        const etiquetaHora = `${inicioBloque.getHours().toString().padStart(2, '0')}:00`;

        if (!resultado[nombre].tiempos[etiquetaHora]) {
          resultado[nombre].tiempos[etiquetaHora] = [];
          resultado[nombre].orden.push(etiquetaHora);
        }

        resultado[nombre].tiempos[etiquetaHora].push(valor);
      });
    });

    inicioBloque.setHours(inicioBloque.getHours() + 1);
  }

  // Calcular promedios finales
  const resultadoFinal = {};
  Object.entries(resultado).forEach(([nombre, datos]) => {
    const tiempos = datos.orden; // NO se invierte
    const valores = tiempos.map(etiqueta => {
      const arr = datos.tiempos[etiqueta];
      const suma = arr.reduce((acc, val) => acc + val, 0);
      return +(suma / arr.length).toFixed(2);
    }).reverse(); // ✅ Solo se invierten los valores

    resultadoFinal[nombre] = { tiempos, valores };
  });

  return resultadoFinal;
}