import { loadLibraries } from '../config/libraries.wialon.js';
import { all_avl } from '../config/spec.wialon.js';
import { iniciarWialon } from '../../../index.js';

class WialonSDK {
    constructor() {
        this.token = null;
        this.session = null;
    }

    async init(token) {
        return new Promise((resolve, reject) => {
            if (!window.wialon) {
                reject("SDK de Wialon no está cargado");
                return;
            }

            this.token = token;
            wialon.core.Session.getInstance().initSession("https://hst-api.wialon.com");

            wialon.core.Session.getInstance().loginToken(this.token, "", (code) => {
                if (code) {
                    reject(`Error al iniciar sesión: ${wialon.core.Errors.getErrorText(code)}`);
                } else {
                    this.session = wialon.core.Session.getInstance();
                    loadLibraries( this.session )
                    this.session.updateDataFlags(all_avl, () => resolve(this.session)
                    );
                }
            });
        });
    }

    logout = ( token ) => {
    wialon.core.Session.getInstance().logout( // if user exist - logout
        function (code) { // logout callback
            if (code) {
                console.log('logout: ' + wialon.core.Errors.getErrorText(code));
            }
            else //console.log("Sesion cerrada");
                // init( token );
                iniciarWialon( token );
        }
    );
}
}

export default new WialonSDK();
