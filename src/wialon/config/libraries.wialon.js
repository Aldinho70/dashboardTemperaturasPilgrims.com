export function loadLibraries(conexion) {
    conexion.loadLibrary("itemIcon"); 
    conexion.loadLibrary("unitGroups");
    conexion.loadLibrary("unitSensors");
    conexion.loadLibrary("resourceZones");
    conexion.loadLibrary("resourceReports");
    conexion.loadLibrary("itemCustomFields");
    conexion.loadLibrary("resourceAccounts");
    conexion.loadLibrary("resourceNotifications");
}
