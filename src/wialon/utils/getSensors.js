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
