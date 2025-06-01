export const convertTimestamp = (timestamp) =>{
    const _date =  new Date(timestamp * 1000);
    return (_date.toLocaleString());
}

export const getFechaActual = () => {
  const hoy = new Date();

  const dia = String(hoy.getDate()).padStart(2, '0');
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const año = hoy.getFullYear();

  const horas = String(hoy.getHours()).padStart(2, '0');
  const minutos = String(hoy.getMinutes()).padStart(2, '0');
  const segundos = String(hoy.getSeconds()).padStart(2, '0');

  return `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;
}
