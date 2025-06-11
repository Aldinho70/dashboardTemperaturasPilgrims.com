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
    // const unit_messages = await messageService.loadMessages(_unit.getId());
    const { messages, count } = unit_messages;
    
    let sensorsByMessages = getSensorsValueByMessages(unit, messages, sensores); 
    const datosProcesados = agruparTemperaturasPorSensorYHora(sensorsByMessages);
    return datosProcesados;
}

function agruparTemperaturasPorSensorYHora(data) {
  const resultado = {};

  data.forEach(obj => {
    const timestamp = Number(Object.keys(obj)[0]);
    const lecturas = obj[timestamp];

    // Convertir timestamp a hora redondeada (HH:00)
    const fecha = new Date(timestamp * 1000); // asumiendo que el timestamp viene en segundos
    const hora = `${fecha.getHours().toString().padStart(2, '0')}:00`;

    lecturas.forEach(sensor => {
      const nombre = sensor.nombre;
      const valor = sensor.valor;

      if (!resultado[nombre]) {
        resultado[nombre] = {
          tiempos: {},
        };
      }

      if (!resultado[nombre].tiempos[hora]) {
        resultado[nombre].tiempos[hora] = [];
      }

      resultado[nombre].tiempos[hora].push(valor);
    });
  });

  // Promediar valores y transformar a array final
  const resultadoFinal = {};
  Object.entries(resultado).forEach(([nombre, datos]) => {
    const tiempos = Object.keys(datos.tiempos).sort(); // ordenar por hora
    const valores = tiempos.map(hora => {
      const arr = datos.tiempos[hora];
      const suma = arr.reduce((acc, val) => acc + val, 0);
      return +(suma / arr.length).toFixed(2); // promedio con 2 decimales
    });

    resultadoFinal[nombre] = {
      tiempos,
      valores,
    };
  });

  return resultadoFinal;
}
