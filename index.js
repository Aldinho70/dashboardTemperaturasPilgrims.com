import wialonSDK from './src/wialon/sdk/wialonSDK.js';
import { getSensorValues } from './src/wialon/utils/getSensors.js';
import { getInformation } from './src/wialon/utils/getInformation.js';
import { convertTimestamp, getFechaActual } from './src/utils/timestamp.js';
import { htmlCreateCard, htmListCard } from './src/components/main/main.js';
import { htmlCreateNotification } from './src/components/main/Notifications.js';
import { htmlCreateCardInfo } from './src/components/main/CardsInfo.js';
import { htmlCreatedModuleGroups } from './src/components/main/sidebar.js';
import { getGrupos } from './src/wialon/utils/getGroups.js';
import HighChart from './src/wialon/api/Highchart.js/index.highchart.js'

const TOKEN = "74799f62945e446c599d2747895e8c651A168076E34508092DE3A89F0FA0240290E7A1E7";
export let allUnits_groups;

export async function iniciarWialon() {
    try {
        const _units = [];
        const _temperatura = { ok: {}, notOk: {}, falla: {} }

        const session = await wialonSDK.init(TOKEN);         
        const user = session.getCurrUser();
        const resource = session.getItems('avl_resource');
        const groups = session.getItems('avl_unit_group');
        const _units_groups = await getGrupos(groups);
        allUnits_groups = _units_groups;
        // console.log( _units_groups );
        
        
        
        for (var i = 0; i< resource.length; i++) { // construct Select list using found resources
		    //addEvent(res[i].getId()); // add event to any resource object
			resource[i].addListener("messageRegistered", htmlCreateNotification); // register event when we will receive message
	    }

        // console.log("Usuario:", user.getName());
        // console.log( "resources", resource );
        // console.log( "resources", resource[0].getNotifications() );


        const data_units = session.getItems("avl_unit");
        const units = getInformation(data_units);

        data_units.forEach(_unit => {
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

            // console.log( unidad );


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
        });
        
        $('#root-fecha').val(`Ultima actualizacion: ${getFechaActual()}`)
        /* CREAR FUNCION DE LIMPIA DE HTML */
        // $("#root-card-info").html('');
        // $("#root-card").html('');


        // htmlCreateCard(_units);
        htmlCreatedModuleGroups(_units_groups)
        // htmlCreateCardInfo(_gabinete, ['abierto', 'cerrado'], 'gabinete');
        // htmlCreateCardInfo(_estado, ['encendido', 'apagado'], 'estado');
        // htmlCreateCardInfo(_voltaje, ['ok', 'falla'], 'voltaje');

        // HighChart.initChartGabinetes( _gabinete );
        // HighChart.initChartStatus(_estado);
        // HighChart.initChartVoltaje(_voltaje);
        // HighChart.initchartAll(_gabinete,_voltaje, _estado);

    } catch (error) {
        console.error("Error al iniciar Wialon:", error);
    }
    // console.log(_temperatura);
}


const getInfocard = (name, owner, total) => {
    const all_data = { _voltaje, _gabinete, _estado }
    htmListCard( all_data[owner][name], name, total )
};

window.getInfocard = getInfocard;

const htmlCreatedCardsByGroups = ( name_group, filter ) =>{
    const _units = []
    const units = allUnits_groups[name_group] 
    for (const key in units.units_temp.general) {
        if (Object.prototype.hasOwnProperty.call(units.units_temp.general, key)) {
            const element = units.units_temp.general[key];
             _units.push(element.unidad);            
        }
    }htmlCreateCard(_units, filter)
}

window.htmlCreatedCardsByGroups = htmlCreatedCardsByGroups;

iniciarWialon();

setInterval(() => {

  wialonSDK.logout(TOKEN) // ejecución cada 10 segundos
}, 1 * 60 * 1000);