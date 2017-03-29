var ChartsController = {

    apiURL: 'http://localhost:8000/',

    init: function() {
        this.lineChart = Highcharts.chart('line-chart', {
            chart: {
                type: 'line'
            },
            xAxis: {
                title: {
                    text: 'Date'
                },
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                type: 'linear'
            },
            title: {
                text: 'Line Chart'
            },
            series: []
        });

        this.barChart = Highcharts.chart('bar-chart', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Bar Chart'
            },
            xAxis: {
                title: {
                    text: 'Date'
                },
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Fruit eaten'
                }
            },
            series: [{
                name: 'Jane',
                data: [1, 0, 4]
            }, {
                name: 'John',
                data: [5, 7, 3]
            }]
        });
    },

    loadData: function(series) {
        var _this = this;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', _this.apiURL + 'api/series/?series='+series, false);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                _this._prepareSeries(series, data);
            }
        };
        xhr.send();
    },

    rescale: function() {
        console.log('rescale');
    },

    _prepareSeries: function(series, data) {
        this.lineChart.addSeries({
            name: series,
            data: data.map(function(val) {
                return [Date.parse(val.date), parseFloat(val.value)];
            })
        });
    }

};

document.addEventListener('DOMContentLoaded', function() {
    ChartsController.init();

    ChartsController.loadData('Aberdeen Global - Emerging Markets Local Currency Bond Fund');
    ChartsController.loadData('Ashmore SICAV - Emerging Markets Local Currency Bond Fund');

    document.getElementById('rescale').addEventListener('click', function() {
       ChartsController.rescale();
    });
});