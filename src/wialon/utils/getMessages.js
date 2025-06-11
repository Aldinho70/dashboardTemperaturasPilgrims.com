// import { toUnixTimestamp } from "../../utils/timestamp.js";

class MessagesService {
    constructor(){
        this.session = wialon.core.Session.getInstance();
        // this.unit = unit;
    }

    async loadMessages( unit ) {
        return new Promise((resolve, reject) => {
            const ml = this.session.getMessagesLoader();
            if (!ml) {
                reject("MessagesLoader not available");
                return;
            }
            // this.from = toUnixTimestamp(this.from);
            // this.to = toUnixTimestamp(this.to);

            console.log( this.to, this.from );
            
            // Usando flags y flagsMask para cargar toda la información disponible
            const flags = 0x0000;
            const flagsMask = 0xFF00;
    
            ml.loadInterval( unit, this.from, this.to, flags, flagsMask, 10000, (code, data) => {
                if (code) {
                    reject(wialon.core.Errors.getErrorText(code));
                    return;
                }
    
                if (!data) {
                    reject("No data returned");
                    return;
                }
    
                resolve(data);
            });
        });
    }

    async loadMessagesToday( unit ) {
        return new Promise((resolve, reject) => {
            const ml = this.session.getMessagesLoader();
            if (!ml) {
                reject("MessagesLoader not available");
                return;
            }
            const to = this.session.getServerTime();
            const from = to - (3600 * 24);  // Últimas 24 horas
            
            // Usando flags y flagsMask para cargar toda la información disponible
            const flags = 0x0000;
            const flagsMask = 0xFF00;
    
            ml.loadInterval( unit, from, to, flags, flagsMask, 10000, (code, data) => {
                if (code) {
                    reject(wialon.core.Errors.getErrorText(code));
                    return;
                }
    
                if (!data) {
                    reject("No data returned");
                    return;
                }
    
                resolve(data);
            });
        });
    }

    async getInfoUnit( id_unit ){
        return new Promise((resolve, reject) => {
            const unit = this.session.getItem(id_unit);
            resolve( unit )
        })
    }

    // async getMessagesLoader (unit, from, to){
    //     const _from = Timestamp.toUnixTimestamp(from);
    //     const _to = Timestamp.toUnixTimestamp(to);

    //     const messageService = new MessagesService(unit, _from, _to);
    //     const unit_messages = await messageService.loadMessages();
    //     const unit_data = await messageService.getInfoUnit(unit);

    //     const name = unit_data.getName();
    //     const sensors = unit_data.getSensors();

    //     const { messages, count } = unit_messages;

    //     if (messages.length > 0) {
    //         messages.map(element => {
    //            console.log(element);                
    //         });            
    //     } else {
    //         Utils.showToast("No hay mensajes", "Error", "info");
    //     }
    // }
     
}

export default new MessagesService();