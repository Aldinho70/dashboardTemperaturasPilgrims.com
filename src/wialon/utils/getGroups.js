// import { getGPS, getInfo, getPersonalizados, getSensores, getState } from "./getDevice.js";
import { getSensorValues } from "./getSensors.js";
import { convertTimestamp } from "../../utils/timestamp.js";
import { GRUPOS, GRUPOS_FILTER } from "../../config/config.js";
const conexion = wialon.core.Session.getInstance();

export const getGrupos = async ( groups ) => {
        let _groups = {}
        const key = Object.keys(GRUPOS_FILTER);
        await groups.forEach(group => {
            const name_group = group.getName();
            const _key = key.find(clave => name_group.toUpperCase().includes(clave));

            if(GRUPOS_FILTER[_key]){
                if( GRUPOS_FILTER[_key].GRUPOS.includes( name_group ) ){
                    const objeto = {
                        info: getInfoGroup( group ),
                        units_temp: getUnitsGroup( group, GRUPOS_FILTER[_key].SENSOR ),   
                    }
                    _groups[name_group] = objeto;
                }
            }
        });
    return _groups;
}

export const getInfoGroup = ( group ) =>{
    return {
        nameGroup: group.getName(),
        idGroup: group.getId(),
        icon: group.getIconUrl(32), 
        units: group.getUnits(),
    }
}

export const getUnitsGroup = ( group, array_temp ) =>{
    const _temperatura = { /*ok: {}, notOk: {}, falla: {},*/ general: {} }
    const idUnits = group.getUnits()
    
    idUnits.map( element => {
        const temps = [];
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
                icon, 
            };
            array_temp.map( temp => {                
                const temperatura = (sensors.find(s => s.nombre === temp)) ? sensors.find(s => s.nombre === temp) : 'N/A';
                if( temperatura ){
                    temps.push( { [temperatura.nombre]: temperatura.valor } )
                    // if(temperatura.valor >= 200){
                    //     _temperatura.notOk[name] = {unidad, temperatura}
                    // }else if( temperatura.valor < 200 && temperatura.valor > 0 ){
                    //     _temperatura.ok[name] = {unidad, temperatura}
                    // }else{
                    //     _temperatura.falla[name] = {unidad, temperatura}
                        
                    // }
                }
                _temperatura.general[name] = {unidad, temps}
            })
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