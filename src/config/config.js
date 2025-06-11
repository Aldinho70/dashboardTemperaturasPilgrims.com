export const USUARIO = 'TEMPERATURAS PILGRIMS';
export const CONTRASEÑA = 'Temp-2025';
export const TOKEN = '74799f62945e446c599d2747895e8c651A168076E34508092DE3A89F0FA0240290E7A1E7';

export const GRUPOS = ['PILGRIMS GP REPARTO', 'PILGRIMS DGO REPARTO', 'PILGRIMS MTY REPARTO', 'PILGRIMS CHIH. REPARTO',
                       'PILGRIMS GP CAMARAS', 'PILGRIMS DGO CAMARAS', 'PILGRIMS MTY CAMARAS', 'PILGRIMS CHIH. CAMARAS',
                       'PILGRIMS GRUPO REFRIGERACION']

export const GRUPOS_FILTER = {
    'REPARTO':{
        GRUPOS: ['PILGRIMS GP REPARTO', 'PILGRIMS DGO REPARTO', 'PILGRIMS MTY REPARTO', 'PILGRIMS CHIH. REPARTO' ],
        SENSOR: ['TEMPERATURA DASHBOARD'],
        getState: (temp) => {
            return ( temp >= 200) ? 'temp-hot' : 'temp-cold'
        }
    },
    'CAMARAS':{
        GRUPOS: ['PILGRIMS GP CAMARAS', 'PILGRIMS DGO CAMARAS', 'PILGRIMS MTY CAMARAS', 'PILGRIMS CHIH. CAMARAS' ],
        SENSOR: ["Temperatura Puerta Dashboard", "Temperatura Media Dashboard", "Temperatura Atras Dashboard"],
        getState: (temp) => {
            return 'temp-cold'
        }
    },
    'REFRIGERACION':{
        GRUPOS: ['PILGRIMS GRUPO REFRIGERACION'],
        SENSOR: ["Difusor Norte Dashboard", "Difusor Sur Dashboard", "PICKING Dashboard", "CUARTO INTERMEDIO Dashboard",
            "CUARTO FRESCO NORTE Dashboard", "CUARTO FRESCO SUR Dashboard", "MATERIA PRIMA RASTRO Dashboard",
            "RAFAGAS CAM 01 Dashboard", "RAFAGAS CAM 03 Dashboard", "Difusor Oriente Dashboard", "Difusor Poniente Dashboard",
            "RAFAGAS 2 Dashboard", "RAFAGAS 4 Dashboard"],
        getState: (temp) => {
            return 'temp-cold'
        }
    }
}

// USUARIO: TEMPERATURAS PILGRIMS
// CONTRASEÑA: Temp-2025