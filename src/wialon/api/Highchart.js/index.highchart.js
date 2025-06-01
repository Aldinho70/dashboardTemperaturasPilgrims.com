import { htmListCard } from '../../../components/main/main.js';
class HighChart {
    initChartGabinetes = (data) => {
        Highcharts.chart('root-gabinetes', {
            chart: {
                type: 'pie',
                height: 200
            },
            title: {
                text: 'Estatus gabinete'
            },
            series: [{
                name: 'Valores',
                data: [
                    { name: 'Abierto', y: Object.keys(data.abierto).length },
                    { name: 'Cerrado', y: Object.keys(data.cerrado).length },
                    { name: 'falla', y: Object.keys(data.falla).length }
                ],
                showInLegend: true,
                size: '225%'
            }],
            legend: {

            },
            tooltip: {
                pointFormat: '<b>{point.name}: {point.y} Unidades</b>'
            },
            plotOptions: {
                pie: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                htmListCard(data[this.name.toLowerCase()], this.point.name, this.point.y);
                            }
                        }
                    }
                },
            },
        });
    }
    initChartStatus = (data) => {
        Highcharts.chart('root-status-bomba', {
            chart: {
                type: 'pie',
                height: 200
            },
            title: {
                text: 'Estado de bombas'
            },
            series: [{
                name: 'Valores',
                data: [
                    { name: 'Apagados', y: Object.keys(data.apagado).length },
                    { name: 'Encendidos', y: Object.keys(data.encendido).length },
                    { name: 'Con fallas', y: Object.keys(data.falla).length }
                ],
                showInLegend: true,
                size: '225%'
            }],
            tooltip: {
                pointFormat: '<b>{point.name}: {point.y} Unidades</b>'
            },
            plotOptions: {
                pie: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                if (this.name == 'Apagados') {
                                    htmListCard(data['apagado'], this.point.name, this.point.y);
                                }
                                if (this.name == 'Encendidos') {
                                    htmListCard(data['encendido'], this.point.name, this.point.y);
                                }
                                if (this.name == 'Con fallas') {
                                    htmListCard(data['falla'], this.point.name, this.point.y);
                                }

                            }
                        }
                    }
                },
            },
        });
    }
    initChartVoltaje = (data) => {
        Highcharts.chart('root-voltaje', {
            chart: {
                type: 'pie',
                height: 200
            },
            title: {
                text: 'Voltajes en bomba'
            },
            series: [{
                name: 'Valores',
                data: [
                    { name: 'Voltaje correcto', y: Object.keys(data.ok).length },
                    { name: 'fallas', y: Object.keys(data.falla).length }
                ],
                showInLegend: true,
                size: '225%' // aquí agranda el gráfico dentro del chart
            }],
            tooltip: {
                pointFormat: '<b>{point.name}: {point.y} Unidades</b>'
            },
            plotOptions: {
                pie: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                if (this.name == 'Voltaje correcto') {
                                    htmListCard(data['ok'], this.point.name, this.point.y);
                                }
                                if (this.name == 'fallas') {
                                    htmListCard(data['falla'], this.point.name, this.point.y);
                                }
                            }
                        }
                    }
                },
            },
        });
    }

    initchartAll(gabinete, voltaje, estado) {
        const all_data = { gabinete, voltaje, estado }
        const colors = Highcharts.getOptions().colors;
        const categorias = ['Gabinete', 'Voltaje', 'Estado'];
        const fuentes = [gabinete, voltaje, estado];

        const browserData = [];
        const versionsData = [];

        fuentes.forEach((fuente, i) => {
            const subcategorias = Object.keys(fuente);
            let totalCategoria = 0;
            const drilldownCategorias = [];
            const drilldownData = [];

            // Calcular los totales por subcategoría
            subcategorias.forEach((sub, j) => {
                const total = Object.keys(fuente[sub]).length;
                totalCategoria += total;
                drilldownCategorias.push(sub);
                drilldownData.push(total);
            });

            // Agregar categoría principal
            browserData.push({
                name: categorias[i],
                y: totalCategoria,
                color: colors[i],
                drilldown: {
                    name: categorias[i],
                    categories: drilldownCategorias,
                    data: drilldownData
                }
            });
        });

        // Construir drilldown detallado
        browserData.forEach((cat, i) => {
            const drillDataLen = cat.drilldown.data.length;
            for (let j = 0; j < drillDataLen; j++) {
                const name = `${cat.name} - ${cat.drilldown.categories[j]}`;
                const subname = `${cat.drilldown.categories[j]}`;
                const owner = `${cat.name}`;
                const brightness = 0.2 - (j / drillDataLen) / 5;
                versionsData.push({
                    name,
                    owner,
                    subname,
                    y: cat.drilldown.data[j],
                    color: Highcharts.color(cat.color).brighten(brightness).get()
                });
            }
        });

        // Crear el gráfico
        Highcharts.chart('root_all', {
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Resumen de Categorías por Estado'
            },
            plotOptions: {
                pie: {
                    shadow: false,
                    center: ['50%', '50%'],
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                
                                if( this.owner ){
                                    htmListCard(all_data[this.owner.toLowerCase()][this.subname], this.point.name, this.point.y );
                                }else{
                                    // htmListCard(all_data[this.point.name.toLowerCase()], this.point.name, this.point.y );

                                }
                            }
                        }
                    }
                },
            },
            tooltip: {
                pointFormat: '<b>{point.name}</b>: {point.y}'
            },
            series: [{
                name: 'Categorías',
                data: browserData.map(item => ({
                    name: item.name,
                    y: item.y,
                    color: item.color
                })),
                size: '45%',
                dataLabels: {
                    color: '#ffffff',
                    distance: '-50%'
                }
            }, {
                name: 'Detalles',
                data: versionsData,
                size: '80%',
                innerSize: '60%',
                dataLabels: {
                    format: '<b>{point.name}:</b> <span style="opacity: 0.5">{y}</span>',
                    style: {
                        fontWeight: 'normal'
                    },
                    filter: {
                        property: 'y',
                        operator: '>',
                        value: 0
                    }
                },
                id: 'detalles'
            }]
        });
    }

}

export default new HighChart();
