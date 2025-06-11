export const getSensorValues = (unit) => {
    const sensores = unit.getSensors();
    const lastMessage = unit.getLastMessage();
    const result = [];

    for (const i in sensores) {
        if (Object.prototype.hasOwnProperty.call(sensores, i)) {
            const sensor = sensores[i];
            const sens = unit.getSensor(sensor.id);            

            let valor = unit.calculateSensorValue(sens, lastMessage);
            if (valor === -348201.3876){
                valor = 'N/A';
            } else{
                valor = Math.abs(Math.round(valor));
            }
            result.push({ nombre: sensor.n, valor });
        }
    }

    return result; // 👈 esto es lo importante
};


export const getSensorsValueByMessages = (unit, messages, sens) => {
    const sensores = unit.getSensors();
    const result = [];

    for (const j in messages) {
        const sensAux = []; // Reiniciar aquí en cada mensaje

        for (const i in sensores) {
            if (Object.prototype.hasOwnProperty.call(sensores, i)) {
                const sensor = sensores[i];

                if (sens.includes(sensor.n)) {
                    const sens = unit.getSensor(sensor.id);            
                    let valor = unit.calculateSensorValue(sens, messages[j]);

                    if (valor === -348201.3876) {
                        valor = 'N/A';  
                    }

                    sensAux.push({ 
                        nombre: sensor.n, 
                        valor: valor, 
                    });
                }
            }
        }

        result.push({ [messages[j].t]: sensAux });
    }

    // console.log(unit.getName(), result);
    return result;
}