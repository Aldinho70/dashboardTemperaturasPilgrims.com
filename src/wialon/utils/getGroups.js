// import { getGPS, getInfo, getPersonalizados, getSensores, getState } from "./getDevice.js";
import { getSensorValues } from "./getSensors.js";
import { convertTimestamp } from "../../utils/timestamp.js";
import { GRUPOS } from "../../config/config.js";
const conexion = wialon.core.Session.getInstance();

export const getGrupos = async ( groups ) => {
        await groups.forEach(group => {
            if( GRUPOS.includes(group.getName() ) ){
                const objeto = {
                    info: getInfoGroup( group ),
                    units_temp: getUnitsGroup( group ),   
                }
                groups[group.getName()] = objeto;
            }
    });
    return groups;
}

export const getInfoGroup = ( group ) =>{
    return {
        nameGroup: group.getName(),
        idGroup: group.getId(),
        icon: group.getIconUrl(32), 
        units: group.getUnits(),
    }
}

export const getUnitsGroup = ( group ) =>{
    const _units = [];
    const _temperatura = { ok: {}, notOk: {}, falla: {} }
    const idUnits = group.getUnits()

    idUnits.map( element => {
        const _unit = conexion.getItem(element);        
        const name = _unit.getName();
        const sensors = getSensorValues(_unit);
        const icon =  _unit.getIconUrl(32);
        const last_message = _unit.getLastMessage();
        const dateParsed = (last_message) ? convertTimestamp(last_message.t) : 0;

        const unidad = {
                name,
                sensors,
                last_message,
                dateParsed,
                icon
            };

            const temperatura = (sensors.find(s => s.nombre === "TEMPERATURA DASHBOARD")) ? sensors.find(s => s.nombre === "TEMPERATURA DASHBOARD") : 'N/A';
            if(temperatura){
                _units.push(unidad);
                if(temperatura.valor >= 200){
                    _temperatura.notOk[name] = {unidad, temperatura}
                }else if( temperatura.valor < 200 && temperatura.valor > 0 ){
                    _temperatura.ok[name] = {unidad, temperatura}
                }else{
                    _temperatura.falla[name] = {unidad, temperatura}

                }
            }
    }) 

    return _temperatura;    
}


// export const getUnitsGroup = ( group ) => {
//     return initUnit( group.getUnits() );
// }


// function initUnit(unitsGoups) {
//     const units = {};
//     unitsGoups.forEach( Element => {
//         const unit = conexion.getItem( Element );
//         if ( unit ) {
//             const objeto = {
//                 info: getInfo(unit),
//                 sensors: getSensores(unit),
//                 personalizados: getPersonalizados(unit),
//                 gps: getGPS(unit),
//             }
//             getState( objeto );

//             units[unit.getName()] = objeto;
//         }
        
//     })
//     return units;
// }