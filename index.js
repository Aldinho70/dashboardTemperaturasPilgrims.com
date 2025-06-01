import wialonSDK from './src/wialon/sdk/wialonSDK.js';
import { getSensorValues } from './src/wialon/utils/getSensors.js';
import { getInformation } from './src/wialon/utils/getInformation.js';
import { convertTimestamp, getFechaActual } from './src/utils/timestamp.js';
import { htmlCreateCard, htmListCard } from './src/components/main/main.js';
import { htmlCreateNotification } from './src/components/main/Notifications.js';
import { htmlCreateCardInfo } from './src/components/main/CardsInfo.js';
import HighChart from './src/wialon/api/Highchart.js/index.highchart.js'

const TOKEN = "74799f62945e446c599d2747895e8c651A168076E34508092DE3A89F0FA0240290E7A1E7";



export async function iniciarWialon() {
    try {
        const _units = [];
        const _voltaje = { falla: {}, ok: {} };
        const _estado = { apagado: {}, encendido: {}, falla: {} };
        const _gabinete = { abierto: {}, cerrado: {}, falla: {} };
        const _temperatura = { ok: {}, notOk: {}, falla: {} }

        const session = await wialonSDK.init(TOKEN);
        const user = session.getCurrUser();
        const resource = session.getItems('avl_resource');

        for (var i = 0; i< resource.length; i++) { // construct Select list using found resources
		    //addEvent(res[i].getId()); // add event to any resource object
			resource[i].addListener("messageRegistered", htmlCreateNotification); // register event when we will receive message
	    }

        console.log("Usuario:", user.getName());
        // console.log( "resources", resource );
        // console.log( "resources", resource[0].getNotifications() );


        const data_units = session.getItems("avl_unit");
        const units = getInformation(data_units);
        console.log(units);


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

            /**Hcaer funciones de cada una */
            // const voltaje = sensors.find(s => s.nombre === "VOLTAJE EXTERNO");
            // if (voltaje && voltaje.valor === 'N/A' || voltaje.valor < 5 ) {
            //     _voltaje.falla[name] = unidad;
            // } else if( voltaje.valor ){
            //     _voltaje.ok[name] = unidad;
            // }

            // const gabinete = sensors.find(s => s.nombre === "GABINETE");
            // if( gabinete ){
            //     if(gabinete.valor === 'N/A'){
            //         _gabinete.cerrado[name] = unidad
            //     }else if(gabinete.valor === 1){
            //         _gabinete.abierto[name] = unidad
            //     }else{
            //         _gabinete.cerrado[name] = unidad
            //     }
            // }

            // const estado = sensors.find(s => s.nombre === "BOMBA");
            // if( estado ){
            //     if( estado.valor == 1 ){
            //         _estado.encendido[name] = unidad
            //     }else if ( estado.valor == 0 ){
            //         _estado.apagado[name] = unidad
            //     }else if ( estado.valor == 'N/A' ){
            //         _estado.falla[name] = unidad
            //     }
            // }
            /**Hcaer funciones de cada una */


        });

        console.log("_units", _units);
        // console.log("_voltaje", _voltaje);
        // console.log("_gabinete", _gabinete);
        // console.log("_estado", _estado);


        $('#root-fecha').val(`Ultima actualizacion: ${getFechaActual()}`)
        /* CREAR FUNCION DE LIMPIA DE HTML */
        $("#root-card-info").html('');
        $("#root-card").html('');


        htmlCreateCard(_units);
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

iniciarWialon();

setInterval(() => {

  wialonSDK.logout(TOKEN) // ejecución cada 10 segundos
}, 1 * 60 * 1000);