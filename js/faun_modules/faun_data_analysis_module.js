// Module des fonctions de la page donnees
// Namespace: FaunDataAnalysisModule
var url = 'https://connect.faun.fr/api/public';
var FaunDataAnalysisModule = {

    // A props du module
    version: 1.1,
    description: 'Module which contains data analysis functions such as bar graph indicators and raw graph data',

    dataType: {
        getDataType: function(data_type_option) {
            if(data_type_option === "option-all"){
                $('#total-distance-indicator').show();
                $('#used-fuel-indicator').show();
                $('#average-speed-indicator').show();
                $('#emptied-bin-indicator').show();
                $('#lifter-cycle-indicator').show();
            }
            else if(data_type_option === "option-bacs"){
                $('#total-distance-indicator').hide();
                $('#used-fuel-indicator').hide();
                $('#average-speed-indicator').hide();
                $('#emptied-bin-indicator').show();
                $('#lifter-cycle-indicator').show();
            }
            else if(data_type_option === "option-compaction"){
                $('#total-distance-indicator').hide();
                $('#used-fuel-indicator').hide();
                $('#average-speed-indicator').hide();
                $('#emptied-bin-indicator').hide();
                $('#lifter-cycle-indicator').hide();
            }
            else if(data_type_option === "option-vidage"){
                $('#total-distance-indicator').hide();
                $('#used-fuel-indicator').hide();
                $('#average-speed-indicator').hide();
                $('#emptied-bin-indicator').hide();
                $('#lifter-cycle-indicator').hide();
            }
            else if(data_type_option === "option-charge"){
                $('#total-distance-indicator').hide();
                $('#used-fuel-indicator').hide();
                $('#average-speed-indicator').hide();
                $('#emptied-bin-indicator').hide();
                $('#lifter-cycle-indicator').hide();
            }
            else if(data_type_option === "option-vehicule"){
                $('#emptied-bin-indicator').hide();
                $('#lifter-cycle-indicator').hide();
                $('#total-distance-indicator').show();
                $('#used-fuel-indicator').show();
                $('#average-speed-indicator').show();
            }
            else {
                $('#total-distance-indicator').hide();
                $('#used-fuel-indicator').hide();
                $('#average-speed-indicator').hide();
                $('#emptied-bin-indicator').hide();
                $('#lifter-cycle-indicator').hide();
            }
        }
    },

    rawData: {

    },

    indicators: {
        // Fonction permettant d'afficher l'indicateur du nombre de bacs leves
        displayEmptyiedBins: function(selected_vehicle_id) {
            $('#emptiedBinChart').remove();
            $('#emptied_bin_div').append('<canvas id="emptiedBinChart"></canvas>');
            var emptiedBinChart = document.getElementById("emptiedBinChart").getContext("2d");
            emptiedBinChart.canvas.height = 275;
            var aggregation = localStorage.aggregationValue || 'day';
            var start_timestamp = $('#end-timestamp-data').val() + ' ' + '00:00:00';
            var end_timestamp = $('#end-timestamp-data').val() + ' ' + '23:59:59';
            var url = 'https://connect.faun.fr/api/public';
            $.ajax({
                type: 'POST',
                url: url+'/emptied_bin_indic/'+selected_vehicle_id,
                dataType: 'json',
                data: {timezone: localStorage.timezone, aggregation: aggregation, start_timestamp: start_timestamp, end_timestamp: end_timestamp},
                headers: {
                    "faun-token":token
                },
                success: function(rslt){
                    displayEmptyiedBinsTruck(rslt);
                },
                error: function(err){
                    console.log(err);
                }
            });
            function displayEmptyiedBinsTruck(json){
                if($.isEmptyObject(json))
                {
                    var modal = '<div class="modal" id="myModal">\
                                    <div class="modal-dialog">\
                                        <div class="modal-content">\
                                            <div class="modal-header">\
                                                <h5 class="modal-title trn" style="font-weight: normal; margin-left: auto">modal.Info</h5>\
                                                <button type="button" class="close" data-dismiss="modal">&times;</button>\
                                            </div>\
                                            <div class="modal-body">\
                                            <i class="fa fa-exclamation-circle fa-fw" style="color: red;"></i>&nbsp;<span class="trn">error.noData</span>\
                                            </div>\
                                            <div class="modal-footer">\
                                                <button type="button" class="btn btn-primary trn" data-dismiss="modal">button.Close</button>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>'
                    $('#ErrorBox').append(modal);
                    $("#myModal").modal();
                    $('#myModal').trigger('traduction');
                }
                else
                {
                    var timestamps = [];
                    var values_left = [];
                    var values_right = [];
                    var values_middle = [];
                    var values_large = [];
                    const totalizer = {
                        id: 'totalizer',
                        beforeUpdate: emptiedBinChart => {
                            var totals = {};
                            var utmost = 0;
                            emptiedBinChart.data.datasets.forEach((dataset, datasetIndex) => {
                                if(dataset.data.every(item => item === 0))
                                {
                                    dataset.hidden = true;
                                }
                                if (emptiedBinChart.isDatasetVisible(datasetIndex)) {
                                    utmost = datasetIndex
                                    dataset.data.forEach((value, index) => {
                                        totals[index] = (totals[index] || 0) + value
                                    })
                                }
                            });
                            emptiedBinChart.$totalizer = {
                                totals: totals,
                                utmost: utmost
                            }
                        }
                    };
                    if(aggregation == 'hour')
                    {
                        // All bins
                        $.each(json, function(index, element){
                            timestamps.push(moment(element.Hour, "HH"));
                            values_left.push(element.Left_Emptied_bins);
                            values_right.push(element.Right_Emptied_bins);
                            values_middle.push(element.Middle_Emptied_bins);
                            values_large.push(element.Large_Emptied_bins);
                        });
                        var barChart = new Chart(emptiedBinChart, {
                            type: 'bar',
                            data: {
                                labels: timestamps,
                                datasets: [
                                    {
                                        label: 'Côté gauche',
                                        backgroundColor: '#7c85ab',
                                        data: values_left
                                    },
                                    {
                                        label: 'Côté droit',
                                        backgroundColor: '#a0cd7c',
                                        data: values_right
                                    },
                                    {
                                        label: 'Milieu',
                                        backgroundColor: '#efc163',
                                        data: values_middle
                                    },
                                    {
                                        label: '4 roues',
                                        backgroundColor: '#d99da6',
                                        data: values_large
                                    }
                                ]
                            },
                            options: {
                                responsive: true, 
                                maintainAspectRatio: false,
                                scales: {
                                    xAxes: [{
                                        type: 'time',
                                        time: {
                                            displayFormats: {
                                                hour: 'H'
                                            },
                                            minUnit: 'hour',
                                            stepSize: 1,
                                        },
                                        stacked: true
                                    }],
                                    yAxes: [{
                                        ticks: {
                                        beginAtZero: true
                                        },
                                        stacked: true
                                    }]
                                },
                                legend: {
                                    display: true,
                                    position: 'top',
                                },
                                pan: {
                                    enabled: true,
                                    mode: 'x',
                                    rangeMin: {
                                        x: null,
                                        y: null
                                    },
                                    rangeMax: {
                                        x: null,
                                        y: null
                                    },
                                },
                                zoom: {
                                    enabled: true,
                                    drag: false,					
                                    mode: 'x'
                                },
                                plugins: {
                                    datalabels: {
                                        formatter: (value, ctx) => {
                                            if(ctx.chart.$totalizer.totals[ctx.dataIndex] !== 0)
                                            {
                                                const total = ctx.chart.$totalizer.totals[ctx.dataIndex];
                                                return total;
                                            }
                                        },
                                        align: 'end',
                                        anchor: 'end',
                                        offset: -4,
                                        display: function(ctx) {
                                            var index = ctx.dataIndex;
                                            var value = ctx.dataset.data[index];
                                            return ctx.datasetIndex === ctx.chart.$totalizer.utmost && value > 0;
                                        }
                                    }
                                }
                            },
                            plugins: [totalizer]
                        });
                    }
                    else if(aggregation == 'day')
                    {
                        // All bins
                        $.each(json, function(index, element){
                            timestamps.push(moment(element.Timestamp, "YYYY-MM-DD HH:mm:ss"));
                            values_left.push(element.Left_Emptied_bins);
                            values_right.push(element.Right_Emptied_bins);
                            values_middle.push(element.Middle_Emptied_bins);
                            values_large.push(element.Large_Emptied_bins);
                        });
                        var barChart = new Chart(emptiedBinChart, {
                            type: 'bar',
                            data: {
                                labels: timestamps,
                                datasets: [
                                    {
                                        label: 'Côté gauche',
                                        backgroundColor: '#7c85ab',
                                        data: values_left
                                    },
                                    {
                                        label: 'Côté droit',
                                        backgroundColor: '#a0cd7c',
                                        data: values_right
                                    },
                                    {
                                        label: 'Milieu',
                                        backgroundColor: '#efc163',
                                        data: values_middle
                                    },
                                    {
                                        label: '4 roues',
                                        backgroundColor: '#d99da6',
                                        data: values_large
                                    }
                                ]
                            },
                            options: {
                                responsive: true, 
                                maintainAspectRatio: false,
                                scales: {
                                    xAxes: [{
                                        type: 'time',
                                        time: {
                                            displayFormats: {
                                                hour: 'H'
                                            },
                                            minUnit: 'hour',
                                            stepSize: 1,
                                        },
                                        ticks: {
                                            callback: function(label, index, labels) {
                                                return label + 'h';
                                            },
                                            fontColor: '#666',
                                            display: true
                                        },
                                        stacked: true
                                    }],
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true,
                                        },
                                        stacked: true
                                    }]
                                },
                                tooltips: {
                                    callbacks: {
                                        // title: function(tooltipItem, data) {
                                        //     return data["labels"][tooltipItem[0]["index"]];
                                        // },
                                        // label: function(tooltipItem, data) {
                                        //     var label = tooltipItem.yLabel;
                                        //     return label + ' bacs';
                                        // }
                                    }
                                },
                                legend: {
                                    display: true,
                                    position: 'top',
                                },
                                pan: {
                                    enabled: true,
                                    mode: 'x',
                                    rangeMin: {
                                        x: null,
                                        y: null
                                    },
                                    rangeMax: {
                                        x: null,
                                        y: null
                                    },
                                },
                                zoom: {
                                    enabled: true,
                                    drag: false,					
                                    mode: 'x'
                                },
                                plugins: {
                                    datalabels: {
                                        formatter: (value, ctx) => {
                                            if(ctx.chart.$totalizer.totals[ctx.dataIndex] !== 0)
                                            {
                                                const total = ctx.chart.$totalizer.totals[ctx.dataIndex];
                                                return total;
                                            }
                                        },
                                        align: 'end',
                                        anchor: 'end',
                                        offset: -4,
                                        display: function(ctx) {
                                            var index = ctx.dataIndex;
                                            var value = ctx.dataset.data[index];
                                            return ctx.datasetIndex === ctx.chart.$totalizer.utmost && value > 0;
                                        }
                                    }
                                }
                            },
                            plugins: [totalizer]
                        });
                        $('#reset_zoom_emptied_bin_btn').click(function(){
                            barChart.resetZoom();
                        });
                    }
                    else if(aggregation == 'week')
                    {
                        // All bins
                        $.each(json, function(index, element){
                            timestamps.push(moment(element.Timestamp, "YYYY-MM-DD HH:mm:ss"));
                            values_left.push(element.Left_Emptied_bins);
                            values_right.push(element.Right_Emptied_bins);
                            values_middle.push(element.Middle_Emptied_bins);
                            values_large.push(element.Large_Emptied_bins);
                        });
                        var barChart = new Chart(emptiedBinChart, {
                            type: 'bar',
                            data: {
                                labels: timestamps,
                                datasets: [
                                    {
                                        label: 'Côté gauche',
                                        backgroundColor: '#7c85ab',
                                        data: values_left
                                    },
                                    {
                                        label: 'Côté droit',
                                        backgroundColor: '#a0cd7c',
                                        data: values_right
                                    },
                                    {
                                        label: 'Milieu',
                                        backgroundColor: '#efc163',
                                        data: values_middle
                                    },
                                    {
                                        label: '4 roues',
                                        backgroundColor: '#d99da6',
                                        data: values_large
                                    }
                                ]
                            },
                            options: {
                                responsive: true, 
                                maintainAspectRatio: false,
                                scales: {
                                    xAxes: [{
                                        type: 'time',
                                        time: {
                                            displayFormats: {
                                                day: 'MMM DD'
                                            },
                                            minUnit: 'day',
                                            stepSize: 1,
                                        },
                                        stacked: true
                                    }],
                                    yAxes: [{
                                        ticks: {
                                        beginAtZero: true
                                        },
                                        stacked: true
                                    }]
                                },
                                legend: {
                                    display: true,
                                    position: 'top',
                                },
                                pan: {
                                    enabled: true,
                                    mode: 'x',
                                    rangeMin: {
                                        x: null,
                                        y: null
                                    },
                                    rangeMax: {
                                        x: null,
                                        y: null
                                    },
                                },
                                zoom: {
                                    enabled: true,
                                    drag: false,					
                                    mode: 'x'
                                },
                                plugins: {
                                    datalabels: {
                                        formatter: (value, ctx) => {
                                            if(ctx.chart.$totalizer.totals[ctx.dataIndex] !== 0)
                                            {
                                                const total = ctx.chart.$totalizer.totals[ctx.dataIndex];
                                                return total;
                                            }
                                        },
                                        align: 'end',
                                        anchor: 'end',
                                        offset: -4,
                                        display: function(ctx) {
                                            var index = ctx.dataIndex;
                                            var value = ctx.dataset.data[index];
                                            return ctx.datasetIndex === ctx.chart.$totalizer.utmost && value > 0;
                                        }
                                    }
                                }
                            },
                            plugins: [totalizer]
                        });
                        $('#reset_zoom_emptied_bin_btn').click(function(){
                            barChart.resetZoom();
                        });
                    }
                    else
                    {
                        // Aggregation : 'month'
                        $.each(json, function(index, element){
                            timestamps.push(moment(element.Timestamp, "YYYY-MM-DD HH:mm:ss"));
                            values_left.push(element.Left_Emptied_bins);
                            values_right.push(element.Right_Emptied_bins);
                            values_middle.push(element.Middle_Emptied_bins);
                            values_large.push(element.Large_Emptied_bins);
                        });
                        var barChart = new Chart(emptiedBinChart, {
                            type: 'bar',
                            data: {
                                labels: timestamps,
                                datasets: [
                                    {
                                        label: 'Côté gauche',
                                        backgroundColor: '#7c85ab',
                                        data: values_left
                                    },
                                    {
                                        label: 'Côté droit',
                                        backgroundColor: '#a0cd7c',
                                        data: values_right
                                    },
                                    {
                                        label: 'Milieu',
                                        backgroundColor: '#efc163',
                                        data: values_middle
                                    },
                                    {
                                        label: '4 roues',
                                        backgroundColor: '#d99da6',
                                        data: values_large
                                    }
                                ]
                            },
                            options: {
                                responsive: true, 
                                maintainAspectRatio: false,
                                scales: {
                                    xAxes: [{
                                        type: 'time',
                                        time: {
                                            displayFormats: {
                                                day: 'MMM DD'
                                            },
                                            minUnit: 'day',
                                            stepSize: 1,
                                        },   
                                        stacked: true
                                    }],
                                    yAxes: [{
                                        ticks: {
                                        beginAtZero: true
                                        },
                                        stacked: true
                                    }]
                                },
                                legend: {
                                    display: true,
                                    position: 'top',
                                },
                                pan: {
                                    enabled: true,
                                    mode: 'x',
                                    rangeMin: {
                                        x: null,
                                        y: null
                                    },
                                    rangeMax: {
                                        x: null,
                                        y: null
                                    },
                                },
                                zoom: {
                                    enabled: true,
                                    drag: false,					
                                    mode: 'x'
                                },
                                plugins: {
                                    datalabels: {
                                        formatter: (value, ctx) => {
                                            if(ctx.chart.$totalizer.totals[ctx.dataIndex] !== 0)
                                            {
                                                const total = ctx.chart.$totalizer.totals[ctx.dataIndex];
                                                return total;
                                            }
                                        },
                                        align: 'end',
                                        anchor: 'end',
                                        offset: -4,
                                        display: function(ctx) {
                                            var index = ctx.dataIndex;
                                            var value = ctx.dataset.data[index];
                                            return ctx.datasetIndex === ctx.chart.$totalizer.utmost && value > 0;
                                        }
                                    }
                                }
                            },
                            plugins: [totalizer]
                        });
                        $('#reset_zoom_emptied_bin_btn').click(function(){
                            barChart.resetZoom();
                        });
                    }
                }
            }
        },
        
        // Fonction permettant d'afficher l'indicateur du nombre de cycles basculeurs
        displayLifterCycles: function(selected_vehicle_id) {
            $('#lifterCycleChart').remove();
            $('#lifter_cycles_div').append('<canvas id="lifterCycleChart"></canvas>');
            var lifterCycleChart = document.getElementById("lifterCycleChart").getContext("2d");
            lifterCycleChart.canvas.height = 275;
            var aggregation = localStorage.aggregationValue || 'day';
            var start_timestamp = $('#end-timestamp-data').val() + ' ' + '00:00:00';
            var end_timestamp = $('#end-timestamp-data').val() + ' ' + '23:59:59';  
            var url = 'https://connect.faun.fr/api/public';
            $.ajax({
                type: 'POST',
                url: url+'/chair_cycle_indic/'+selected_vehicle_id,
                dataType: 'json',
                data: {timezone: localStorage.timezone, aggregation: aggregation, start_timestamp: start_timestamp, end_timestamp: end_timestamp},
                headers: {
                    "faun-token":token
                },
                success: function(rslt){
                    displayLifterCyclesTruck(rslt);
                },
                error: function(err){
                    console.log(err);
                }
            });
            function displayLifterCyclesTruck(json){
                var timestamps = [];
                var values_left1 = [];
                var values_left2 = [];
                var values_right1 = [];
                var values_right2 = [];
                var values_total = []
                if($.isEmptyObject(json))
                {
                    var modal = '<div class="modal" id="myModal">\
                                    <div class="modal-dialog">\
                                        <div class="modal-content">\
                                            <div class="modal-header">\
                                                <h5 class="modal-title trn" style="font-weight: normal; margin-left: auto">modal.Info</h5>\
                                                <button type="button" class="close" data-dismiss="modal">&times;</button>\
                                            </div>\
                                            <div class="modal-body">\
                                            <i class="fa fa-exclamation-circle fa-fw" style="color: red;"></i>&nbsp;<span class="trn">error.noData</span>\
                                            </div>\
                                            <div class="modal-footer">\
                                                <button type="button" class="btn btn-primary trn" data-dismiss="modal">button.Close</button>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>'
                    $('#ErrorBox').append(modal);
                    $("#myModal").modal();
                    $('#myModal').trigger('traduction');
                }
                else {
                    const totalizer = {
                        id: 'totalizer',
                        beforeUpdate: lifterCycleChart => {
                            var totals = {};
                            var utmost = 0;
                            lifterCycleChart.data.datasets.forEach((dataset, datasetIndex) => {
                                if(dataset.data.every(item => item === 0))
                                {
                                    dataset.hidden = true;
                                }
                                if (lifterCycleChart.isDatasetVisible(datasetIndex)) {
                                    utmost = datasetIndex
                                    dataset.data.forEach((value, index) => {
                                        totals[index] = (totals[index] || 0) + value
                                    })
                                }
                            });
                            lifterCycleChart.$totalizer = {
                                totals: totals,
                                utmost: utmost
                            }
                        }
                    };
                    if(aggregation == 'hour')
                    {
                        // All bins
                        $.each(json, function(index, element){
                            timestamps.push(moment(element.Hour, "HH"));
                            values_left1.push(element.Left_chair_cycle_1);
                            values_left2.push(element.Left_chair_cycle_2);
                            values_right1.push(element.Right_chair_cycle_1);
                            values_right2.push(element.Right_chair_cycle_2);
                        });
                        var barChart2 = new Chart(lifterCycleChart, {
                            type: 'bar',
                            data: {
                                labels: timestamps,
                                datasets: [
                                    {
                                        label: 'Chaise gauche basculeur 1',
                                        backgroundColor: '#7c85ab',
                                        data: values_left1
                                    },
                                    {
                                        label: 'Chaise gauche basculeur 2',
                                        backgroundColor: '#a0cd7c',
                                        data: values_left2
                                    },
                                    {
                                        label: 'Chaise droite basculeur 1',
                                        backgroundColor: '#efc163',
                                        data: values_right1
                                    },
                                    {
                                        label: 'Chaise droite basculeur 2',
                                        backgroundColor: '#d99da6',
                                        data: values_right2
                                    }
                                ]
                            },
                            options: {
                                responsive: true, 
                                maintainAspectRatio: false,
                                scales: {
                                    xAxes: [{
                                        type: 'time',
                                        time: {
                                            displayFormats: {
                                                hour: 'H'
                                            },
                                            minUnit: 'hour',
                                            stepSize: 1,
                                        },
                                        stacked: true
                                    }],
                                    yAxes: [{
                                        ticks: {
                                        beginAtZero: true
                                        },
                                        stacked: true
                                    }]
                                },
                                legend: {
                                    display: true,
                                    position: 'top'
                                },
                                pan: {
                                    enabled: true,
                                    mode: 'x',
                                    rangeMin: {
                                        x: null,
                                        y: null
                                    },
                                    rangeMax: {
                                        x: null,
                                        y: null
                                    },
                                },
                                zoom: {
                                    enabled: true,
                                    drag: false,					
                                    mode: 'x'
                                },
                                plugins: {
                                    datalabels: {
                                        formatter: (value, ctx) => {
                                            if(ctx.chart.$totalizer.totals[ctx.dataIndex] !== 0)
                                            {
                                                const total = ctx.chart.$totalizer.totals[ctx.dataIndex];
                                                return total;
                                            }
                                        },
                                        align: 'end',
                                        anchor: 'end',
                                        offset: -4,
                                        display: function(ctx) {
                                            var index = ctx.dataIndex;
                                            var value = ctx.dataset.data[index];
                                            return ctx.datasetIndex === ctx.chart.$totalizer.utmost && value > 0;
                                        }
                                    }
                                }
                            },
                            plugins: [totalizer]
                        });
                    }
                    else if(aggregation == 'day')
                    {
                        // All lifters
                        $.each(json, function(index, element){
                            timestamps.push(moment(element.Timestamp, "YYYY-MM-DD HH:mm:ss"));
                            values_left1.push(element.Left_chair_cycle_1);
                            values_left2.push(element.Left_chair_cycle_2);
                            values_right1.push(element.Right_chair_cycle_1);
                            values_right2.push(element.Right_chair_cycle_2);
                        });
                        var barChartLifter = new Chart(lifterCycleChart, {
                            type: 'bar',
                            data: {
                                labels: timestamps,
                                datasets: [
                                    {
                                        label: 'Chaise gauche basculeur 1',
                                        backgroundColor: '#7c85ab',
                                        data: values_left1
                                    },
                                    {
                                        label: 'Chaise gauche basculeur 2',
                                        backgroundColor: '#a0cd7c',
                                        data: values_left2
                                    },
                                    {
                                        label: 'Chaise droite basculeur 1',
                                        backgroundColor: '#efc163',
                                        data: values_right1
                                    },
                                    {
                                        label: 'Chaise droite basculeur 2',
                                        backgroundColor: '#d99da6',
                                        data: values_right2
                                    }
                                ]
                            },
                            options: {
                                responsive: true, 
                                maintainAspectRatio: false,
                                scales: {
                                    xAxes: [{
                                        type: 'time',
                                        time: {
                                            displayFormats: {
                                                hour: 'H',
                                            },
                                            minUnit: 'hour',
                                            stepSize: 1,
                                        },
                                        ticks: {
                                            callback: function(label, index, labels) {
                                                return label + 'h';
                                            },
                                        },
                                        stacked: true
                                    }],
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true,
                                        },
                                        stacked: true
                                    }]
                                },
                                tooltips: {
                                    callbacks: {
                                        // title: function(tooltipItem, data) {
                                        //     return data["labels"][tooltipItem[0]["index"]];
                                        // },
                                        // label: function(tooltipItem, data) {
                                        //     var label = tooltipItem.yLabel;
                                        //     return label + ' bacs';
                                        // }
                                    }
                                },
                                legend: {
                                    display: true,
                                    position: 'top',
                                },
                                pan: {
                                    enabled: true,
                                    mode: 'x',
                                    rangeMin: {
                                        x: null,
                                        y: null
                                    },
                                    rangeMax: {
                                        x: null,
                                        y: null
                                    },
                                },
                                zoom: {
                                    enabled: true,
                                    drag: false,					
                                    mode: 'x'
                                },
                                plugins: {
                                    datalabels: {
                                        formatter: (value, ctx) => {
                                            if(ctx.chart.$totalizer.totals[ctx.dataIndex] !== 0)
                                            {
                                                const total = ctx.chart.$totalizer.totals[ctx.dataIndex];
                                                return total;
                                            }
                                        },
                                        align: 'end',
                                        anchor: 'end',
                                        offset: -4,
                                        display: function(ctx) {
                                            var index = ctx.dataIndex;
                                            var value = ctx.dataset.data[index];
                                            return ctx.datasetIndex === ctx.chart.$totalizer.utmost && value > 0;
                                        }
                                    }
                                }
                            },
                            plugins: [totalizer]
                        });
                        $('#reset_zoom_lifter_cycle_btn').click(function(){
                            barChartLifter.resetZoom();
                        });
                    }
                    else if(aggregation == 'week')
                    {
                        // All bins
                        $.each(json, function(index, element){
                            timestamps.push(moment(element.Timestamp, "YYYY-MM-DD HH:mm:ss"));
                            values_left1.push(element.Left_chair_cycle_1);
                            values_left2.push(element.Left_chair_cycle_2);
                            values_right1.push(element.Right_chair_cycle_1);
                            values_right2.push(element.Right_chair_cycle_2);
                        });
                        var barChartLifter = new Chart(lifterCycleChart, {
                            type: 'bar',
                            data: {
                                labels: timestamps,
                                datasets: [
                                    {
                                        label: 'Chaise gauche basculeur 1',
                                        backgroundColor: '#7c85ab',
                                        data: values_left1
                                    },
                                    {
                                        label: 'Chaise gauche basculeur 2',
                                        backgroundColor: '#a0cd7c',
                                        data: values_left2
                                    },
                                    {
                                        label: 'Chaise droite basculeur 1',
                                        backgroundColor: '#efc163',
                                        data: values_right1
                                    },
                                    {
                                        label: 'Chaise droite basculeur 2',
                                        backgroundColor: '#d99da6',
                                        data: values_right2
                                    }
                                ]
                            },
                            options: {
                                responsive: true, 
                                maintainAspectRatio: false,
                                scales: {
                                    xAxes: [{
                                        type: 'time',
                                        time: {
                                            displayFormats: {
                                                day: 'MMM D'
                                            },
                                            minUnit: 'day',
                                            stepSize: 1
                                        },
                                        stacked: true
                                    }],
                                    yAxes: [{
                                        ticks: {
                                        beginAtZero: true
                                        },
                                        stacked: true
                                    }]
                                },
                                legend: {
                                    display: true,
                                    position: 'top'
                                },
                                pan: {
                                    enabled: true,
                                    mode: 'x',
                                    rangeMin: {
                                        x: null,
                                        y: null
                                    },
                                    rangeMax: {
                                        x: null,
                                        y: null
                                    },
                                },
                                zoom: {
                                    enabled: true,
                                    drag: false,					
                                    mode: 'x'
                                },
                                plugins: {
                                    datalabels: {
                                        formatter: (value, ctx) => {
                                            if(ctx.chart.$totalizer.totals[ctx.dataIndex] !== 0)
                                            {
                                                const total = ctx.chart.$totalizer.totals[ctx.dataIndex];
                                                return total;
                                            }
                                        },
                                        align: 'end',
                                        anchor: 'end',
                                        offset: -4,
                                        display: function(ctx) {
                                            var index = ctx.dataIndex;
                                            var value = ctx.dataset.data[index];
                                            return ctx.datasetIndex === ctx.chart.$totalizer.utmost && value > 0;
                                        }
                                    }
                                }
                            },
                            plugins: [totalizer]
                        });
                        $('#reset_zoom_lifter_cycle_btn').click(function(){
                            barChartLifter.resetZoom();
                        });
                    }
                    else if(aggregation == 'month')
                    {
                        // All bins
                        $.each(json, function(index, element){
                            timestamps.push(moment(element.Timestamp, "YYYY-MM-DD HH:mm:ss"));
                            values_left1.push(element.Left_chair_cycle_1);
                            values_left2.push(element.Left_chair_cycle_2);
                            values_right1.push(element.Right_chair_cycle_1);
                            values_right2.push(element.Right_chair_cycle_2);
                        });
                        var barChartLifter = new Chart(lifterCycleChart, {
                            type: 'bar',
                            data: {
                                labels: timestamps,
                                datasets: [
                                    {
                                        label: 'Chaise gauche basculeur 1',
                                        backgroundColor: '#7c85ab',
                                        data: values_left1
                                    },
                                    {
                                        label: 'Chaise gauche basculeur 2',
                                        backgroundColor: '#a0cd7c',
                                        data: values_left2
                                    },
                                    {
                                        label: 'Chaise droite basculeur 1',
                                        backgroundColor: '#efc163',
                                        data: values_right1
                                    },
                                    {
                                        label: 'Chaise droite basculeur 2',
                                        backgroundColor: '#d99da6',
                                        data: values_right2
                                    }
                                ]
                            },
                            options: {
                                responsive: true, 
                                maintainAspectRatio: false,
                                scales: {
                                    xAxes: [{
                                        type: 'time',
                                        time: {
                                            displayFormats: {
                                                day: 'MMM DD'
                                            },
                                            minUnit: 'day',
                                            stepSize: 1
                                        },
                                        stacked: true
                                    }],
                                    yAxes: [{
                                        ticks: {
                                        beginAtZero: true
                                        },
                                        stacked: true
                                    }]
                                },
                                legend: {
                                    display: true,
                                    position: 'top'
                                },
                                pan: {
                                    enabled: true,
                                    mode: 'x',
                                    rangeMin: {
                                        x: null,
                                        y: null
                                    },
                                    rangeMax: {
                                        x: null,
                                        y: null
                                    },
                                },
                                zoom: {
                                    enabled: true,
                                    drag: false,					
                                    mode: 'x'
                                },
                                plugins: {
                                    datalabels: {
                                        formatter: (value, ctx) => {
                                            if(ctx.chart.$totalizer.totals[ctx.dataIndex] !== 0)
                                            {
                                                const total = ctx.chart.$totalizer.totals[ctx.dataIndex];
                                                return total;
                                            }
                                        },
                                        align: 'end',
                                        anchor: 'end',
                                        offset: -4,
                                        display: function(ctx) {
                                            var index = ctx.dataIndex;
                                            var value = ctx.dataset.data[index];
                                            return ctx.datasetIndex === ctx.chart.$totalizer.utmost && value > 0;
                                        }
                                    }
                                }
                            },
                            plugins: [totalizer]
                        });
                        $('#reset_zoom_lifter_cycle_btn').click(function(){
                            barChartLifter.resetZoom();
                        });
                    }
                }
            }
        },
        // Fonction permettant d'afficher l'indicateur du nombre de bacs leves
        displayAverageSpeed: function(selected_vehicle_id) {
            $('#averageSpeedChart').remove();
            $('#average_speed_div').append('<canvas id="averageSpeedChart"></canvas>');
            var averageSpeedChart = document.getElementById("averageSpeedChart").getContext("2d");
            averageSpeedChart.canvas.height = 275;
            var aggregation = localStorage.aggregationValue || 'day';
            var start_timestamp = $('#end-timestamp-data').val() + ' ' + '00:00:00';
            var end_timestamp = $('#end-timestamp-data').val() + ' ' + '23:59:59';
            var url = 'https://connect.faun.fr/api/public';
            $.ajax({
                type: 'POST',
                url: url+'/average_speed_indic/'+selected_vehicle_id,
                dataType: 'json',
                data: {timezone: localStorage.timezone, aggregation: aggregation, start_timestamp: start_timestamp, end_timestamp: end_timestamp},
                headers: {
                    "faun-token":token
                },
                success: function(rslt){
                    displayAverageSpeedTruck(rslt);
                },
                error: function(err){
                    console.log(err);
                }
            });
            function displayAverageSpeedTruck(json){
                if($.isEmptyObject(json))
                {
                    var modal = '<div class="modal" id="myModal">\
                                    <div class="modal-dialog">\
                                        <div class="modal-content">\
                                            <div class="modal-header">\
                                                <h5 class="modal-title trn" style="font-weight: normal; margin-left: auto">modal.Info</h5>\
                                                <button type="button" class="close" data-dismiss="modal">&times;</button>\
                                            </div>\
                                            <div class="modal-body">\
                                            <i class="fa fa-exclamation-circle fa-fw" style="color: red;"></i>&nbsp;<span class="trn">error.noData</span>\
                                            </div>\
                                            <div class="modal-footer">\
                                                <button type="button" class="btn btn-primary trn" data-dismiss="modal">button.Close</button>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>'
                    $('#ErrorBox').append(modal);
                    $("#myModal").modal();
                    $('#myModal').trigger('traduction');
                }
                else
                {
                    var timestamps = [];
                    var average_speed_day = [];
                    var average_speed_week = [];
                    var average_speed_month = [];
                    const totalizer = {
                        id: 'totalizer',
                        beforeUpdate: averageSpeedChart => {
                            var totals = {};
                            var utmost = 0;
                            averageSpeedChart.data.datasets.forEach((dataset, datasetIndex) => {
                                if(dataset.data.every(item => item === 0))
                                {
                                    dataset.hidden = true;
                                }
                                if (averageSpeedChart.isDatasetVisible(datasetIndex)) {
                                    utmost = datasetIndex
                                    dataset.data.forEach((value, index) => {
                                        totals[index] = (totals[index] || 0) + value
                                    })
                                }
                            });
                            averageSpeedChart.$totalizer = {
                                totals: totals,
                                utmost: utmost
                            }
                        }
                    };
                    if(aggregation == 'day')
                    {
                        // All bins
                        $.each(json, function(index, element){
                            timestamps.push(moment(element.Timestamp, "YYYY-MM-DD HH:mm:ss"));
                            average_speed_day.push(element.Average_speed_day);
                        });
                        var barChart = new Chart(averageSpeedChart, {
                            type: 'bar',
                            data: {
                                labels: timestamps,
                                datasets: [
                                    {
                                        label: 'Vitesse moyenne (km/h)',
                                        backgroundColor: '#7c85ab',
                                        data: average_speed_day
                                    }
                                ]
                            },
                            options: {
                                responsive: true, 
                                maintainAspectRatio: false,
                                scales: {
                                    xAxes: [{
                                        type: 'time',
                                        time: {
                                            displayFormats: {
                                                hour: 'H',
                                            },
                                            minUnit: 'hour',
                                            stepSize: 1,
                                        },
                                        ticks: {
                                            callback: function(label, index, labels) {
                                                return label + 'h';
                                            },
                                        },
                                        stacked: true
                                    }],
                                    yAxes: [{
                                        ticks: {
                                        beginAtZero: true
                                        },
                                        stacked: true
                                    }]
                                },
                                legend: {
                                    display: true,
                                    position: 'top',
                                },
                                pan: {
                                    enabled: true,
                                    mode: 'x',
                                    rangeMin: {
                                        x: null,
                                        y: null
                                    },
                                    rangeMax: {
                                        x: null,
                                        y: null
                                    },
                                },
                                zoom: {
                                    enabled: true,
                                    drag: false,					
                                    mode: 'x'
                                },
                                plugins: {
                                    datalabels: {
                                        formatter: (value, ctx) => {
                                            if(ctx.chart.$totalizer.totals[ctx.dataIndex] !== 0)
                                            {
                                                const total = ctx.chart.$totalizer.totals[ctx.dataIndex];
                                                return total;
                                            }
                                        },
                                        align: 'end',
                                        anchor: 'end',
                                        offset: -4,
                                        display: function(ctx) {
                                            var index = ctx.dataIndex;
                                            var value = ctx.dataset.data[index];
                                            return ctx.datasetIndex === ctx.chart.$totalizer.utmost && value > 0;
                                        }
                                    }
                                }
                            },
                            plugins: [totalizer]
                        });
                        $('#reset_zoom_average_speed_btn').click(function(){
                            barChart.resetZoom();
                        });
                    }
                    else if(aggregation == 'week')
                    {
                        // All bins
                        $.each(json, function(index, element){
                            timestamps.push(moment(element.Timestamp, "YYYY-MM-DD HH:mm:ss"));
                            average_speed_week.push(element.Average_speed_week);
                        });
        
                        var barChart = new Chart(averageSpeedChart, {
                            type: 'bar',
                            data: {
                                labels: timestamps,
                                datasets: [
                                    {
                                        label: 'Vitesse moyenne (km/h)',
                                        backgroundColor: '#7c85ab',
                                        data: average_speed_week
                                    }
                                ]
                            },
                            options: {
                                responsive: true, 
                                maintainAspectRatio: false,
                                scales: {
                                    xAxes: [{
                                        type: 'time',
                                        time: {
                                            displayFormats: {
                                                day: 'MMM DD'
                                            },
                                            minUnit: 'day',
                                            stepSize: 1,
                                        },
                                        stacked: true
                                    }],
                                    yAxes: [{
                                        ticks: {
                                        beginAtZero: true
                                        },
                                        stacked: true
                                    }]
                                },
                                legend: {
                                    display: true,
                                    position: 'top',
                                },
                                pan: {
                                    enabled: true,
                                    mode: 'x',
                                    rangeMin: {
                                        x: null,
                                        y: null
                                    },
                                    rangeMax: {
                                        x: null,
                                        y: null
                                    },
                                },
                                zoom: {
                                    enabled: true,
                                    drag: false,					
                                    mode: 'x'
                                },
                                plugins: {
                                    datalabels: {
                                        formatter: (value, ctx) => {
                                            if(ctx.chart.$totalizer.totals[ctx.dataIndex] !== 0)
                                            {
                                                const total = ctx.chart.$totalizer.totals[ctx.dataIndex];
                                                return total;
                                            }
                                        },
                                        align: 'end',
                                        anchor: 'end',
                                        offset: -4,
                                        display: function(ctx) {
                                            var index = ctx.dataIndex;
                                            var value = ctx.dataset.data[index];
                                            return ctx.datasetIndex === ctx.chart.$totalizer.utmost && value > 0;
                                        }
                                    }
                                }
                            },
                            plugins: [totalizer]
                        });
                        $('#reset_zoom_average_speed_btn').click(function(){
                            barChart.resetZoom();
                        });
                    }
                    else
                    {
                        // Aggregation : 'month'
                        $.each(json, function(index, element){
                            timestamps.push(moment(element.Timestamp, "YYYY-MM-DD HH:mm:ss"));
                            average_speed_month.push(element.Average_speed_month);
                        });
        
                        var barChart = new Chart(averageSpeedChart, {
                            type: 'bar',
                            data: {
                                labels: timestamps,
                                datasets: [
                                    {
                                        label: 'Vitesse moyenne (km/h)',
                                        backgroundColor: '#7c85ab',
                                        data: average_speed_month
                                    }
                                ]
                            },
                            options: {
                                responsive: true, 
                                maintainAspectRatio: false,
                                scales: {
                                    xAxes: [{
                                        type: 'time',
                                        time: {
                                            displayFormats: {
                                                day: 'MMM DD'
                                            },
                                            minUnit: 'day',
                                            stepSize: 1,
                                        },   
                                        stacked: true
                                    }],
                                    yAxes: [{
                                        ticks: {
                                        beginAtZero: true
                                        },
                                        stacked: true
                                    }]
                                },
                                legend: {
                                    display: true,
                                    position: 'top',
                                },
                                pan: {
                                    enabled: true,
                                    mode: 'x',
                                    rangeMin: {
                                        x: null,
                                        y: null
                                    },
                                    rangeMax: {
                                        x: null,
                                        y: null
                                    },
                                },
                                zoom: {
                                    enabled: true,
                                    drag: false,					
                                    mode: 'x'
                                },
                                plugins: {
                                    datalabels: {
                                        formatter: (value, ctx) => {
                                            if(ctx.chart.$totalizer.totals[ctx.dataIndex] !== 0)
                                            {
                                                const total = ctx.chart.$totalizer.totals[ctx.dataIndex];
                                                return total;
                                            }
                                        },
                                        align: 'end',
                                        anchor: 'end',
                                        offset: -4,
                                        display: function(ctx) {
                                            var index = ctx.dataIndex;
                                            var value = ctx.dataset.data[index];
                                            return ctx.datasetIndex === ctx.chart.$totalizer.utmost && value > 0;
                                        }
                                    }
                                }
                            },
                            plugins: [totalizer]
                        });
                        $('#reset_zoom_average_speed_btn').click(function(){
                            barChart.resetZoom();
                        });
                    }
                }
            }
        },
    }
}