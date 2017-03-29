var ChartsController = {

    apiURL: 'http://localhost:8000/',
    monthMilliseconds: 3600 * 24 * 30 * 1000,

    init: function() {
        this.lineChart = Highcharts.chart('line-chart', {
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            xAxis: {
                ordinal: true,
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
                type: 'column'
            },
            title: {
                text: 'Bar Chart'
            },
            xAxis: {
                title: {
                    text: 'Date'
                },
                type: 'datetime',
                minTickInterval: this.monthMilliseconds,
                minRange: this.monthMilliseconds,
                ordinal: false
            },
            yAxis: {
                title: {
                    text: 'value'
                }
            },
            series: []
        });
    },

    rescale: function(date, min_value) {
        this.lineChart.xAxis[0].setExtremes(date, null);
        this.lineChart.yAxis[0].setExtremes(min_value, null);
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

    monthlyReturn: function(series) {
        var _this = this;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', _this.apiURL + 'api/series/monthly_return/?series='+series, false);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                _this._prepareMonthlyReturn(series, data);
            }
        };
        xhr.send();
    },

    _prepareSeries: function(series, data) {
        this.lineChart.addSeries({
            name: series,
            data: data.map(function(val) {
                return [Date.parse(val.date), parseFloat(val.value)];
            })
        });
    },

    _prepareMonthlyReturn: function(series, data) {
        this.barChart.addSeries({
            name: series,
            data: data.map(function(val) {
                return [Date.parse(val.date), parseFloat(val.value)]
            })
        })
    }
};

document.addEventListener('DOMContentLoaded', function() {
    ChartsController.init();

    ChartsController.loadData('Aberdeen Global - Emerging Markets Local Currency Bond Fund');
    ChartsController.loadData('Ashmore SICAV - Emerging Markets Local Currency Bond Fund');

    ChartsController.monthlyReturn('Aberdeen Global - Emerging Markets Local Currency Bond Fund');
    ChartsController.monthlyReturn('Ashmore SICAV - Emerging Markets Local Currency Bond Fund');

    document.getElementById('rescale').addEventListener('click', function() {
       ChartsController.rescale(Date.UTC(2012, 0, 0), 100);
    });
});