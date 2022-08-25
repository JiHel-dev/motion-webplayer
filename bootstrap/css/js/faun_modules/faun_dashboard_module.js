// Module des fonctions du tableau de bord
// Namespace: FaunDashboardModule
var url = 'https://connect.faun.fr/api/public';
var FaunDashboardModule = {

    // A props du module
    version: 1.1,
    description: 'Module which contains dashboard functions such as indicators and map',

    // Sous module de fonctions qui affichent des cartes openstreetmap avec diverses informations
    map: {
        // Affiche la derniere position connue de chaque camion
        lastKnownPosition: function(json){
            if($.isEmptyObject(json))
            {
                console.log('Error: no data.');
            }
            else
            {
                // Centrer la carte sur la France
                var lat = 46.5418955;
                var lon = 2.2833633;
                var macarte = L.map('park_card').setView([lat,lon], 6);
                // On cree des marqueurs perso
                var greenMarker = L.AwesomeMarkers.icon({
                    icon: 'truck',
                    prefix: 'fa',
                    markerColor: 'green'
                });
                var blueMarker = L.AwesomeMarkers.icon({
                    icon: 'truck',
                    prefix: 'fa',
                    markerColor: 'blue'
                });
                var redMarker = L.AwesomeMarkers.icon({
                    icon: 'truck',
                    prefix: 'fa',
                    markerColor: 'red'
                });
                L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                    // On laisse le lien vers la source des donnees
                    attribution: 'Powered by © <a href="//osm.org/copyright">OpenStreetMap</a>',
                    minZoom: 2,
                    maxZoom: 18
                }).addTo(macarte);
                // Ajout de l'icone fullscreen a la carte
                macarte.addControl(new L.Control.Fullscreen());
                // Ajout de l'echelle a la carte
                L.control.scale({imperial: false}).addTo(macarte);
                // Regroupe les markers proches geographiquement
                var markerClusters = L.markerClusterGroup({
                    maxClusterRadius: 80
                });
                var tab = [];
                $.each(json, function(index, element){
                    var rcv = element.rcv_number;
                    // On cherche la derniere donnees de geolocalisation de chaque camion
                    var html = "<b id='popupTruck' class='trn'>popup.Truck</b><b id='rcv_num'>"+rcv+"</b></br>Status: "+element.status+"</br> Last com: "+element.timestamp+"</br><a href='truck_tracking.php' class='trn'>see.Collection</a></p>";
                    if(element.status === "online")
                    {
                        // Marqueur vert si online
                        var marker = L.marker([element.latitude, element.longitude], {icon: greenMarker});
                        markerClusters.addLayer(marker);
                    }
                    else if(element.status === "offline")
                    {
                        var marker = L.marker([element.latitude, element.longitude], {icon: blueMarker});
                        markerClusters.addLayer(marker);
                    }
                    else
                    {
                        var marker = L.marker([element.latitude, element.longitude], {icon: redMarker});
                        markerClusters.addLayer(marker);
                    }
                    marker.bindPopup(html);
                    tab.push(marker);
                    marker.on('click', function(e) {
                        var rcv_num = $('#rcv_num').text();
                        localStorage.setItem('selectedVehicletab', JSON.stringify({name: rcv_num, id: element.vehicle_id, lastCollect: element.timestamp}));
                    });
                });
                
                macarte.addLayer(markerClusters);
                // var bounds = new L.LatLngBounds(tab);
                // if (bounds.isValid())
                // {               
                //     macarte.fitBounds(bounds);
                // }
            }
        }
    },

    // Sous module de fonctions des indicateurs du tableau de bord
    indicators: {
        // Affiche la date de la derniere communication de chaque camion
        lastCommunicationDate: function(json){
            if($.isEmptyObject(json))
            {
                console.log('Error: no data.');
            }
            else
            {
                var rcv_number_today = [];
                var rcv_number_this_week = [];
                var rcv_number_last_week = [];
                var rcv_number_last_month = [];
                var rcv_number_old = [];
                var counter_today_data = 0;
                var counter_this_week_data = 0;
                var counter_last_week_data = 0;
                var counter_last_month_data = 0;
                var counter_old_data = 0;
                var timestamp = [];
                var Colors = ['#5cd65c', '#5397a3', '#a68500', '#ff4d4d', '#7f7f7f'];
                var Labels = ["Aujourd'hui", 'Cette semaine', 'Semaine dernière', 'Mois dernier', 'Plus ancien'];
                $('#today-com-p').remove();
                $('#this-week-com-p').remove();
                $('#last-week-com-p').remove();
                $('#last-month-com-p').remove();
                $('#older-com-p').remove();
                $('#today-number').remove();
                $('#this-week-number').remove();
                $('#last-week-number').remove();
                $('#last-month-number').remove();
                $('#older-number').remove();

                // Calcule de la date du jour
                var d = new Date();
                var month = d.getMonth()+1;
                var day = d.getDate();
                var today = d.getFullYear() + '-' + ((''+month).length<2 ? '0' : '') + month + '-' + ((''+day).length<2 ? '0' : '') + day;
                var yesterday = d.getFullYear() + '-' + ((''+month).length<2 ? '0' : '') + month + '-' + ((''+(day - 1)).length<2 ? '0' : '') + (day - 1);
                // Construction de la date du jour a minuit
                var date_limit_today = new Date(today+" "+"00:00:00.0");
                // Construction de la limite hier
                var date_limit_yesterday = new Date(yesterday+" "+"00:00:00.0");

                // Calcule de la semaine derniere
                function getLastWeek() {
                    var today = new Date();
                    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                    return lastWeek;
                }
                var lastWeek = getLastWeek();
                var lastWeekMonth = lastWeek.getMonth() + 1;
                var lastWeekDay = lastWeek.getDate();
                var lastWeekYear = lastWeek.getFullYear();
                var date_limit_last_week = new Date(lastWeekMonth + "/" + lastWeekDay + "/" + lastWeekYear+" "+"00:00:00.0");

                // Calcule du mois dernier
                function getLastMonth() {
                    var today = new Date();
                    var lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                    return lastMonth;
                }
                var lastMonth = getLastMonth();
                var lastMonthMonth = lastMonth.getMonth() + 1;
                var lastMonthDay = lastMonth.getDate();
                var lastMonthYear = lastMonth.getFullYear();
                var date_limit_last_month = new Date(lastMonthMonth + "/" + lastMonthDay + "/" + lastMonthYear+" "+"00:00:00.0");

                // Get week number
                Date.prototype.getWeek = function (dowOffset) 
                {
                    dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 1; //default dowOffset to one (Monday)
                    var newYear = new Date(this.getFullYear(),0,1);
                    var day = newYear.getDay() - dowOffset; //the day of week the year begins on
                    day = (day >= 0 ? day : day + 7);
                    var daynum = Math.floor((this.getTime() - newYear.getTime() -
                    (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
                    var weeknum;
                    //if the year starts before the middle of a week
                    if(day < 4) {
                        weeknum = Math.floor((daynum+day-1)/7) + 1;
                        if(weeknum > 52) {
                            nYear = new Date(this.getFullYear() + 1,0,1);
                            nday = nYear.getDay() - dowOffset;
                            nday = nday >= 0 ? nday : nday + 7;
                            /*if the next year starts before the middle of
                            the week, it is week #1 of that year*/
                            weeknum = nday < 4 ? 1 : 53;
                        }
                    }
                    else {
                        weeknum = Math.floor((daynum+day-1)/7);
                    }
                    return weeknum;
                };

                $.each(json, function(index, element){
                    // Recuperation du timestamp de la donnee
                    var data_timestamp = new Date(element.timestamp);
                    // Comparaison date du jour et timestamp de la donnees
                    if(data_timestamp >= date_limit_today)
                    {
                        // Today
                        counter_today_data += 1;
                        rcv_number_today.push(element.rcv_number);
                        $('#today-com').append('<a style="font-size: 12px; text-decoration: underline; color: #009fe5;" href="truck_tracking.php"<label id="today-com-p" style="font-size: 12px; text-decoration: underline; color: #333;">'+element.rcv_number+'</label></a>&nbsp;<label style="font-size: 12px; color: #333;"> - <span class="trn">last.Message</span>: '+element.timestamp+' </label><hr id="hr-accordion">');
                        $('#today-com').trigger('traduction');
                        $('#today-com').on('click', "a", function() {
                            var rcv = $(this).text();
                            var last_collect = element.timestamp;
                            localStorage.setItem('selectedVehicletab', JSON.stringify({name: rcv, id: element.vehicle_id, lastCollect: last_collect}));
                        });
                    }
                    else if(d.getWeek() - data_timestamp.getWeek() === 0 && data_timestamp < date_limit_yesterday)
                    {
                        // This week
                        counter_this_week_data += 1;
                        rcv_number_this_week.push(element.rcv_number);
                        $('#this-week-com').append('<a style="font-size: 12px; text-decoration: underline; color: #009fe5;" href="truck_tracking.php"<label id="last-week-com-p" style="font-size: 12px; text-decoration: underline; color: #333;">'+element.rcv_number+'</label></a>&nbsp;<label style="font-size: 12px; color: #333;"> - <span class="trn">last.Message</span>: '+element.timestamp+' </label><hr id="hr-accordion">');
                        $('#this-week-com').trigger('traduction');
                        $('#this-week-com').on('click', "a", function() {
                            var rcv = $(this).text();
                            var last_collect = element.timestamp;
                            localStorage.setItem('selectedVehicletab', JSON.stringify({name: rcv, id: element.vehicle_id, lastCollect: last_collect}));
                        });
                    }
                    else if(d.getWeek() - data_timestamp.getWeek() === 1)
                    {
                        // Last week
                        counter_last_week_data += 1;
                        rcv_number_last_week.push(element.rcv_number);
                        $('#last-week-com').append('<a style="font-size: 12px; text-decoration: underline; color: #009fe5;" href="truck_tracking.php"<label id="last-week-com-p" style="font-size: 12px; text-decoration: underline; color: #333;">'+element.rcv_number+'</label></a>&nbsp;<label style="font-size: 12px; color: #333;"> - <span class="trn">last.Message</span>: '+element.timestamp+' </label><hr id="hr-accordion">');
                        $('#last-week-com').trigger('traduction');
                        $('#last-week-com').on('click', "a", function() {
                            var rcv = $(this).text();
                            var last_collect = element.timestamp;
                            localStorage.setItem('selectedVehicletab', JSON.stringify({name: rcv, id: element.vehicle_id, lastCollect: last_collect}));
                        });
                    }
                    else if(data_timestamp >= date_limit_last_month && data_timestamp < date_limit_last_week)
                    {
                        // Last month
                        counter_last_month_data += 1;
                        rcv_number_last_month.push(element.rcv_number);
                        $('#last-month-com').append('<a style="font-size: 12px; text-decoration: underline; color: #009fe5;" href="truck_tracking.php"<label id="last-month-com-p" style="font-size: 12px; text-decoration: underline; color: #333;">'+element.rcv_number+'</label></a>&nbsp;<label style="font-size: 12px; color: #333;"> - <span class="trn">last.Message</span>: '+element.timestamp+' </label><hr id="hr-accordion">');
                        $('#last-month-com').trigger('traduction');
                        $('#last-month-com').on('click', "a", function() {
                            var rcv = $(this).text();
                            var last_collect = element.timestamp;
                            localStorage.setItem('selectedVehicletab', JSON.stringify({name: rcv, id: element.vehicle_id, lastCollect: last_collect}));
                        });
                    }
                    else
                    {
                        // Older
                        counter_old_data += 1;
                        rcv_number_old.push(element.rcv_number);
                        $('#older-com').append('<a style="font-size: 12px; text-decoration: underline; color: #333;" href="truck_tracking.php"<label id="older-com-p" style="font-size: 12px; text-decoration: underline; color: #333;">'+element.rcv_number+'</label></a>&nbsp;<label style="font-size: 12px; color: #333;"> - <span class="trn">last.Message</span>: '+element.timestamp+' </label><hr id="hr-accordion">');
                        $('#older-com').trigger('traduction');
                        $('#older-com').on('click', "a", function() {
                            var rcv = $(this).text();
                            var last_collect = element.timestamp;
                            localStorage.setItem('selectedVehicletab', JSON.stringify({name: rcv, id: element.vehicle_id, lastCollect: last_collect}));
                        });
                    }
                });
                timestamp.push(counter_today_data);
                timestamp.push(counter_this_week_data);
                timestamp.push(counter_last_week_data);
                timestamp.push(counter_last_month_data);
                timestamp.push(counter_old_data);
                $('#accordion-today').append('<span id="today-number" class="pull-left trn">card.Today</span><span class="pull-right trn">'+counter_today_data+'</span>');
                $('#accordion-this-week').append('<span id="this-week-number" class="pull-left trn">card.ThisWeek</span><span class="pull-right trn">'+counter_this_week_data+'</span>');
                $('#accordion-last-week').append('<span id="last-week-number" class="pull-left trn">card.LastWeek</span><span class="pull-right trn">'+counter_last_week_data+'</span>');
                $('#accordion-last-month').append('<span id="last-month-number" class="pull-left trn">card.LastMonth</span><span class="pull-right trn">'+counter_last_month_data+'</span>');
                $('#accordion-older').append('<span id="older-number" class="pull-left trn">card.Older</span><span class="pull-right trn">'+counter_old_data+'</span>');
                $('#accordion-today').trigger('traduction');
                // Grap des dernieres communications enregistrees
                var lastComChart = document.getElementById("lastComChart").getContext("2d");
                lastComChart.canvas.height = 180;
                comChart = new Chart(lastComChart, {
                    type: 'doughnut',
                    data: {
                        labels: Labels,
                        datasets: [{
                            backgroundColor: Colors,
                            data: timestamp
                        }]
                    },
                    options: {
                        responsive: true, 
                        maintainAspectRatio: false,
                        legend: {
                            display: true,
                            position: 'right',
                        },
                        plugins: {
                            labels: {
                                render: 'value',
                                fontSize: 14,
                                fontColor: '#fff' 
                            }
                        },
                        onClick: lastCommunicationDateCLickEvent
                    }
                });
                function lastCommunicationDateCLickEvent(evt) {
                    var activePoints = comChart.getElementsAtEvent(evt);
                    if (activePoints[0]) {
                        var chartData = activePoints[0]['_chart'].config.data;
                        var idx = activePoints[0]['_index'];
        
                        var label = chartData.labels[idx];
                        var value = chartData.datasets[0].data[idx];
        
                        $('#btn-flip-to-front-last-com').trigger('click');
                        if(label==="Today" || label==="Aujourd'hui") {
                            $('#accordion-today').trigger('click');
                        }
                        else if(label==="This Week" || label==="Cette semaine") {
                            $('#accordion-this-week').trigger('click');
                        }
                        else if(label==="Last Week" || label==="Semaine dernière") {
                            $('#accordion-last-week').trigger('click');
                        }
                        else if(label==="Last Month" || label==="Mois dernier") {
                            $('#accordion-last-month').trigger('click');
                        }
                        else if(label==="Older" || label==="Plus ancien") {
                            $('#accordion-older').trigger('click');
                        }
                        else {
                            // do nothing
                        }
                    }
                };
            }
        },

        // Affiche les camions connectes au serveur faun
        connectedTrucks: function(json) {
            if($.isEmptyObject(json))
            {
                console.log('Error: no data.');
            }
            else
            {
                var status = [];
                var counter_offline = 0;
                var counter_online = 0;
                var timestamp = [];
                var Colors = ['#5cd65c', '#009fe5'];
                var Labels = ['En-ligne', 'Hors-ligne'];
                $('#online-truck-details').remove();
                $('#offline-truck-details').remove();
                $.each(json, function(index, element){
                    if(element.status === 'online')
                    {
                        // Ajoute un element online
                        counter_online += 1;
                        $('#online-truck-list').append('<a style="font-size: 12px; text-decoration: underline; color: #009fe5;" href="truck_tracking.php"<label id="online-truck-details" style="font-size: 12px; text-decoration: underline; color: #333;">'+element.rcv_number+'</label></a>&nbsp;<label class="trn" style="font-size: 12px; color: #333;">is.Online</label><hr id="hr-accordion">');
                        $('#online-truck-list').trigger('traduction');
                        $('#online-truck-list').on('click', "a", function() {
                            var rcv = $(this).text();
                            localStorage.setItem('selectedVehicletab', JSON.stringify({name: rcv, id: element.vehicle_id}));
                        });
                    }
                    else
                    {
                        // Ajoute un element offline
                        counter_offline += 1;
                        $('#offline-truck-list').append('<a style="font-size: 12px; text-decoration: underline; color: #009fe5;" href="truck_tracking.php"<label id="offline-truck-details" style="font-size: 12px; text-decoration: underline; color: #333;">'+element.rcv_number+'</label></a>&nbsp;<label class="trn" style="font-size: 12px; color: #333;">is.Offline</label><hr id="hr-accordion">');
                        $('#offline-truck-list').trigger('traduction');
                        $('#offline-truck-list').on('click', "a", function() {
                            var rcv = $(this).text();
                            localStorage.setItem('selectedVehicletab', JSON.stringify({name: rcv, id: element.vehicle_id}));
                        });
                    }
                    timestamp.push(element.timestamp);
                });
                // Set value equal to 0 to undefined in order to hide data from Chart
                if(counter_online === 0) {
                    counter_online = undefined;
                }
                if(counter_offline === 0) {
                    counter_offline = undefined;
                }
                status.push(counter_online);
                status.push(counter_offline);
                $('#accordion-online').append('<span id="online-number" class="pull-left trn">available.Trucks</span><span class="pull-right">'+counter_online+'</span>');
                $('#accordion-offline').append('<span id="offline-number" class="pull-left trn">unavailable.Trucks</span><span class="pull-right">'+counter_offline+'</span>');
                $('#accordion-online').trigger('traduction');
                statChart = new Chart(statusChart, {
                    type: 'doughnut',
                    data: {
                        labels: Labels,
                        datasets: [{
                            backgroundColor: Colors,
                            data: status
                        }]
                    },
                    options: {
                        responsive: true, 
                        maintainAspectRatio: false,
                        legend: {
                            display: true,
                            position: 'right',
                        },
                        plugins: {
                            labels: {
                                render: 'value',
                                fontSize: 14,
                                fontColor: '#fff' 
                            }
                        },
                        onClick: connectedTrucksCLickEvent
                    }
                });
                function connectedTrucksCLickEvent(evt) {
                    var activePoints = statChart.getElementsAtEvent(evt);
                    if (activePoints[0]) {
                        var chartData = activePoints[0]['_chart'].config.data;
                        var idx = activePoints[0]['_index'];
            
                        var label = chartData.labels[idx];
                        var value = chartData.datasets[0].data[idx];
            
                        $('#btn-flip-to-front-available-trucks').trigger('click');
                        if(label==="Online" || label==="En-ligne") {
                            $('#accordion-online').trigger('click');
                        }
                        else if(label==="Offline" || label==="Hors-ligne") {
                            $('#accordion-offline').trigger('click');
                        }
                        else{
                            // do nothing
                        }
                    }
                };
            }
        },

        // Affiche la distance parcourue pour le journee en cours
        totalDistanceDay: function() {
            var start_date = new Date();
            var month = start_date.getMonth();
            var day = start_date.getDate();
            var year = start_date.getFullYear();
            var selected_vehicle_id;
            var start_timestamp = moment(new Date(year, month, day, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss');
            var end_timestamp = moment(new Date(year, month, day, 23, 59, 59)).format('YYYY-MM-DD HH:mm:ss');
            if (localStorage.selectedVehicletab && localStorage.truckList) {
                selected_vehicle_id = JSON.parse(localStorage.selectedVehicletab).id;
            }
            else {
                selected_vehicle_id = 0;
            }
            $('#today-distance-indicator-details').remove();
            $('#hr-distance').remove();
            $('#hr-consumption').remove();
            $.ajax({
                type: 'POST',
                url: url+'/vehicle_total_distance_indic/'+selected_vehicle_id,
                dataType: 'json',
                data: {timezone: localStorage.timezone, aggregation: 'day', start_timestamp: start_timestamp, end_timestamp: end_timestamp},
                headers: {
                    "faun-token":token
                },
                success: function(json){
                    totalDistanceDayTruck(json);
                },
                error: function(err){
                    console.log(err);
                }
            });
            function totalDistanceDayTruck(resultat){
                var total_distance = 0;
                if(resultat != 0)
                {
                    total_distance = resultat.Vehicle_total_distance;
                    $('#today-indicator-list').append('<div class="row" id="today-distance-indicator-details"><div class="col-md-12"><i class="fas fa-road fa-fw"></i>&nbsp;&nbsp;&nbsp;<span><span class="trn">total.Distance</span><span class="float-right"> '+total_distance+' km</span></span></div></div><hr id="hr-distance">');
                    $('#today-indicator-list').trigger('traduction');
                }
                else
                {
                    console.log('No data to draw.');
                }
            }
        },

        // Affiche la distance parcourue pour le journee precedente
        totalDistanceYesterday: function(){
            // Requete pour determiner quels vehicules sont en ligne
            var start_date = new Date();
            var month = start_date.getMonth();
            var day = start_date.getDate()-1;
            var year = start_date.getFullYear();
            var selected_vehicle_id;
            var start_timestamp = moment(new Date(year, month, day, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss');
            var end_timestamp = moment(new Date(year, month, day, 23, 59, 59)).format('YYYY-MM-DD HH:mm:ss');
            if (localStorage.selectedVehicletab && localStorage.truckList) {
                selected_vehicle_id = JSON.parse(localStorage.selectedVehicletab).id;
            }
            else {
                selected_vehicle_id = 0;
            }
            $('#yesterday-distance-indicator-details').remove();
            $('#hr-distance').remove();
            $('#hr-consumption').remove();
            $.ajax({
                type: 'POST',
                url: url+'/vehicle_total_distance_indic/'+selected_vehicle_id,
                dataType: 'json',
                data: {timezone: localStorage.timezone, aggregation: 'day', start_timestamp: start_timestamp, end_timestamp: end_timestamp},
                headers: {
                    "faun-token":token
                },
                success: function(resultat){
                    totalDistanceYesterdayTruck(resultat);
                },
                error: function(err){
                    console.log(err);
                }
            });
            function totalDistanceYesterdayTruck(json){
                var total_distance = 0;
                if(json != 0)
                {
                    total_distance = json.Vehicle_total_distance;
                    $('#yesterday-indicator-list').append('<div class="row" id="yesterday-distance-indicator-details"><div class="col-md-12"><i class="fas fa-road fa-fw"></i>&nbsp;&nbsp;&nbsp;<span><span class="trn">total.Distance</span><span class="float-right"> '+total_distance+' km</span></span></div></div><hr id="hr-distance">');
                    $('#yesterday-indicator-list').trigger('traduction');
                }
                else
                {
                    console.log('No data to draw.');
                }
            }
        },

        // Affiche la vitesse moyenne pour la journee en cours
        averageSpeedDay: function(){
            // Requete pour determiner quels vehicules sont en ligne
            var start_date = new Date();
            var month = start_date.getMonth();
            var day = start_date.getDate();
            var year = start_date.getFullYear();
            var selected_vehicle_id;
            var start_timestamp = moment(new Date(year, month, day, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss');
            var end_timestamp = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            if (localStorage.selectedVehicletab && localStorage.truckList) {
                selected_vehicle_id = JSON.parse(localStorage.selectedVehicletab).id;
            }
            else {
                selected_vehicle_id = 0;
            }
            $('#today-average-speed-indicator-details').remove();
            $('#hr-speed').remove();
            $.ajax({
                type: 'POST',
                url: url+'/average_speed_indic/'+selected_vehicle_id,
                dataType: 'json',
                data: {timezone: localStorage.timezone, aggregation: 'day', start_timestamp: start_timestamp, end_timestamp: end_timestamp},
                headers: {
                    "faun-token":token
                },
                success: function(resultat){
                    averageSpeedDayTruck(resultat);
                },
                error: function(err){
                    console.log(err);
                }
            });
            function averageSpeedDayTruck(json){
                var sum_speed = 0;
                if(json != 0)
                {
                    $.each(json, function(index, element){
                        sum_speed += element.Average_speed_day;
                    });
                    rounded_average_speed = Math.round(sum_speed/json.length);
                    $('#today-indicator-list').append('<div class="row" id="today-average-speed-indicator-details"><div class="col-md-12"><i class="fas fa-tachometer-alt fa-fw"></i>&nbsp;&nbsp;&nbsp;<span><span class="trn">average.Speed</span><span class="float-right">'+rounded_average_speed+' km/h</span></span></div></div><hr id="hr-speed">');
                    $('#today-indicator-list').trigger('traduction');
                }
                else
                {
                    console.log('No data to draw.');
                }
            }
        },

        // Affiche la vitesse moyenne pour la journee precedente
        averageSpeedYesterday: function() {
            // Requete pour determiner la vitesse moyenne du vehicule
            var start_date = new Date();
            var month = start_date.getMonth();
            var day = start_date.getDate()-1;
            var year = start_date.getFullYear();
            var selected_vehicle_id;
            var start_timestamp = moment(new Date(year, month, day, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss');
            var end_timestamp = moment(new Date(year, month, day, 23, 59, 59)).format('YYYY-MM-DD HH:mm:ss');
            if (localStorage.selectedVehicletab && localStorage.truckList) {
                selected_vehicle_id = JSON.parse(localStorage.selectedVehicletab).id;
            }
            else {
                selected_vehicle_id = 0;
            }
            var Colors = ['#5cd65c', '#009fe5'];
            var Labels = ['Online', 'Offline'];
            $('#yesterday-average-speed-indicator-details').remove();
            $('#hr-speed').remove();
            $.ajax({
                type: 'POST',
                url: url+'/average_speed_indic/'+selected_vehicle_id,
                dataType: 'json',
                data: {timezone: localStorage.timezone, aggregation: 'day', start_timestamp: start_timestamp, end_timestamp: end_timestamp},
                headers: {
                    "faun-token":token
                },
                success: function(resultat){
                    averageSpeedYesterdayTruck(resultat);
                },
                error: function(err){
                    console.log(err);
                }
            });
            function averageSpeedYesterdayTruck(json){
                var sum_speed = 0;
                if(json != 0)
                {
                    $.each(json, function(index, element){
                        sum_speed += element.Average_speed_day;
                    });
                    rounded_average_speed = Math.round(sum_speed/json.length);
                    $('#yesterday-indicator-list').append('<div class="row" id="yesterday-average-speed-indicator-details"><div class="col-md-12"><i class="fas fa-tachometer-alt fa-fw"></i>&nbsp;&nbsp;&nbsp;<span><span class="trn">average.Speed</span><span class="float-right">'+rounded_average_speed+' km/h</span></span></div></div><hr id="hr-speed">');
                    $('#yesterday-indicator-list').trigger('traduction');
                }
                else
                {
                    console.log('No data to draw.');
                }
            }
        },

        // Affiche le nombre de bacs vides pour la journee en cours
        emptyiedBinsDay: function() {
            var start_date = new Date();
            var month = start_date.getMonth();
            var day = start_date.getDate();
            var year = start_date.getFullYear();
            var selected_vehicle_id;
            var start_timestamp = moment(new Date(year, month, day, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss');
            var end_timestamp = moment(new Date(year, month, day, 23, 59, 59)).format('YYYY-MM-DD HH:mm:ss');
            if (localStorage.selectedVehicletab && localStorage.truckList) {
                selected_vehicle_id = JSON.parse(localStorage.selectedVehicletab).id;
            }
            else {
                selected_vehicle_id = 0;
            }
            $('#today-nb-emptied-bin-indicator-details').remove();
            $('#hr-speed').remove();
            $.ajax({
                type: 'POST',
                url: url+'/emptied_bin_indic/'+selected_vehicle_id,
                dataType: 'json',
                data: {timezone: localStorage.timezone, aggregation: 'day', start_timestamp: start_timestamp, end_timestamp: end_timestamp},
                headers: {
                    "faun-token":token
                },
                success: function(resultat){
                    emptyiedBinsDayTruck(resultat);
                },
                error: function(err){
                    console.log(err);
                }
            });
            function emptyiedBinsDayTruck(json){
                if(json != 0)
                {
                    var nb_emptied_bins = 0;
                    $.each(json, function(index, element){
                        nb_emptied_bins += element.Left_Emptied_bins + element.Right_Emptied_bins
                                        + element.Middle_Emptied_bins + element.Large_Emptied_bins;
                    });
                    $('#today-indicator-list').append('<div class="row" id="today-nb-emptied-bin-indicator-details"><div class="col-md-12"><i class="fas fa-trash fa-fw"></i>&nbsp;&nbsp;&nbsp;<span><span class="trn">emptied.Bin</span><span class="float-right">'+nb_emptied_bins+'</span></span></div></div><hr id="hr-speed">');
                    $('#today-indicator-list').trigger('traduction');
                }
                else
                {
                    console.log('No data to draw.');
                }
            }
        },

        // Affiche le nombre de bacs vides pour la journee precedente
        emptyiedBinsYesterday: function() {
            var start_date = new Date();
            var month = start_date.getMonth();
            var day = start_date.getDate()-1;
            var year = start_date.getFullYear();
            var selected_vehicle_id;
            var start_timestamp = moment(new Date(year, month, day, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss');
            var end_timestamp = moment(new Date(year, month, day, 23, 59, 59)).format('YYYY-MM-DD HH:mm:ss');
            if (localStorage.selectedVehicletab && localStorage.truckList) {
                selected_vehicle_id = JSON.parse(localStorage.selectedVehicletab).id;
            }
            else {
                selected_vehicle_id = 0;
            }
            $('#yesterday-nb-emptied-bin-indicator-details').remove();
            $('#hr-speed').remove();
            $.ajax({
                type: 'POST',
                url: url+'/emptied_bin_indic/'+selected_vehicle_id,
                dataType: 'json',
                data: {timezone: localStorage.timezone, aggregation: 'day', start_timestamp: start_timestamp, end_timestamp: end_timestamp},
                headers: {
                    "faun-token":token
                },
                success: function(resultat){
                    emptyiedBinsYesterdayTruck(resultat);
                },
                error: function(err){
                    console.log(err);
                }
            });
            function emptyiedBinsYesterdayTruck(json){
                if(json != 0)
                {
                    var nb_emptied_bins = 0;
                    $.each(json, function(index, element){
                        nb_emptied_bins += element.Left_Emptied_bins + element.Right_Emptied_bins
                                        + element.Middle_Emptied_bins + element.Large_Emptied_bins;
                    });
                    $('#yesterday-indicator-list').append('<div class="row" id="yesterday-nb-emptied-bin-indicator-details"><div class="col-md-12"><i class="fas fa-trash fa-fw"></i>&nbsp;&nbsp;&nbsp;<span><span class="trn">emptied.Bin</span><span class="float-right">'+nb_emptied_bins+'</span></span></div></div><hr id="hr-speed">');
                    $('#yesterday-indicator-list').trigger('traduction');
                }
                else
                {
                    console.log('No data to draw.');
                }
            }
        },

        // Affiche la duree de collecte du jour
        collectionTimeDay: function() {
            var start_date = new Date();
            var month = start_date.getMonth();
            var day = start_date.getDate();
            var year = start_date.getFullYear();
            var selected_vehicle_id;
            var start_timestamp = moment(new Date(year, month, day, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss');
            var end_timestamp = moment(new Date(year, month, day, 23, 59, 59)).format('YYYY-MM-DD HH:mm:ss');
            if (localStorage.selectedVehicletab && localStorage.truckList) {
                selected_vehicle_id = JSON.parse(localStorage.selectedVehicletab).id;
            }
            else {
                selected_vehicle_id = 0;
            }
            $('#today-collection-time-indicator-details').remove();
            $('#hr-speed').remove();
            $.ajax({
                type: 'POST',
                url: url+'/total_collect_time_indic/'+selected_vehicle_id,
                dataType: 'json',
                data: {timezone: localStorage.timezone, aggregation: 'day', start_timestamp: start_timestamp, end_timestamp: end_timestamp},
                headers: {
                    "faun-token":token
                },
                success: function(resultat){
                    collectionTimeDayTruck(resultat);
                },
                error: function(err){
                    console.log(err);
                }
            });
            function collectionTimeDayTruck(json){
                if(json != 0)
                {
                    var collection_time = 0;
                    var hours = 0;
                    var minutes = 0;
                    collection_time = json.Total_collect_time;
                    hours = Math.floor(collection_time / 60);
                    minutes = collection_time % 60;
                    $('#today-indicator-list').append('<div class="row" id="today-collection-time-indicator-details"><div class="col-md-12"><i class="fas fa-clock fa-fw"></i>&nbsp;&nbsp;&nbsp;<span><span class="trn">card.Collect.Time</span><span class="float-right">'+hours+'h '+minutes+'m</span></span></div></div><hr id="hr-speed">');
                    $('#today-indicator-list').trigger('traduction');
                }
                else
                {
                    console.log('No data to draw.');
                }
            }
        },
        // Affiche la duree de collecte
        collectionTimeYesterday: function() {
            var start_date = new Date();
            var month = start_date.getMonth();
            var day = start_date.getDate()-1;
            var year = start_date.getFullYear();
            var selected_vehicle_id;
            var start_timestamp = moment(new Date(year, month, day, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss');
            var end_timestamp = moment(new Date(year, month, day, 23, 59, 59)).format('YYYY-MM-DD HH:mm:ss');
            if (localStorage.selectedVehicletab && localStorage.truckList) {
                selected_vehicle_id = JSON.parse(localStorage.selectedVehicletab).id;
            }
            else {
                selected_vehicle_id = 0;
            }
            $('#yesterday-collection-time-indicator-details').remove();
            $('#hr-speed').remove();
            $.ajax({
                type: 'POST',
                url: url+'/total_collect_time_indic/'+selected_vehicle_id,
                dataType: 'json',
                data: {timezone: localStorage.timezone, aggregation: 'day', start_timestamp: start_timestamp, end_timestamp: end_timestamp},
                headers: {
                    "faun-token":token
                },
                success: function(resultat){
                    collectionTimeYesterdayTruck(resultat);
                },
                error: function(err){
                    console.log(err);
                }
            });
            function collectionTimeYesterdayTruck(json){
                if(json != 0)
                {
                    var collection_time = 0;
                    var hours = 0;
                    var minutes = 0;
                    collection_time = json.Total_collect_time;
                    hours = Math.floor(collection_time / 60);
                    minutes = collection_time % 60;
                    $('#yesterday-indicator-list').append('<div class="row" id="yesterday-collection-time-indicator-details"><div class="col-md-12"><i class="fas fa-clock fa-fw"></i>&nbsp;&nbsp;&nbsp;<span><span class="trn">card.Collect.Time</span><span class="float-right">'+hours+'h '+minutes+'m</span></span></div></div><hr id="hr-speed">');
                    $('#yesterday-indicator-list').trigger('traduction');
                }
                else
                {
                    console.log('No data to draw.');
                }
            }
        },

        // Affiche la vitesse maximale de le journée en cours
        maxSpeedDay: function() {
            var start_date = new Date();
            var month = start_date.getMonth();
            var day = start_date.getDate();
            var year = start_date.getFullYear();
            var selected_vehicle_id;
            var start_timestamp = moment(new Date(year, month, day, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss');
            var end_timestamp = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            if (localStorage.selectedVehicletab && localStorage.truckList) {
                selected_vehicle_id = JSON.parse(localStorage.selectedVehicletab).id;
            }
            else {
                selected_vehicle_id = 0;
            }
            $.ajax({
                type: 'POST',
                url: url+'/max_speed_indic/'+selected_vehicle_id,
                dataType: 'json',
                data: {timezone: localStorage.timezone, aggregation: 'day', start_timestamp: start_timestamp, end_timestamp: end_timestamp},
                headers: {
                    "faun-token":token
                },
                success: function(resultat){
                    maxSpeedDayTruck(resultat);
                },
                error: function(err){
                    console.log(err);
                }
            });
            function maxSpeedDayTruck(json){
                var max_speed = 0;
                if(json != 0)
                {
                    max_speed = json.Max_speed_day;
                    $('#perfChartLabel').remove();
                    $('#perf_indicator_div').append('<label id="perfChartLabel">'+max_speed+' km/h</label>');
                    var opts = {
                        angle: -0.2, // The span of the gauge arc
                        lineWidth: 0.2, // The line thickness
                        radiusScale: 1, // Relative radius
                        pointer: {
                            length: 0.6, // // Relative to gauge radius
                            strokeWidth: 0.035, // The thickness
                            color: '#000000' // Fill color
                        },
                        staticZones: [
                            {strokeStyle: "#5cd65c", min: 0, max: 70}, // Red from 100 to 130
                            {strokeStyle: "#ffaa12", min: 70, max: 90}, // Yellow
                            {strokeStyle: "#ff4d4d", min: 90, max: 110}, // Green
                        ],
                        staticLabels: {
                            font: "10px sans-serif",  // Specifies font
                            labels: [0, 70, 90, 110],  // Print labels at these values
                            color: "#000000",  // Optional: Label text color
                            fractionDigits: 0  // Optional: Numerical precision. 0=round off.
                        },
                        limitMax: false,     // If false, max value increases automatically if value > maxValue
                        limitMin: false,     // If true, the min value of the gauge will be fixed
                        colorStart: '#ff4d4d',   // Colors
                        colorStop: '#5cd65c',    // just experiment with them
                        strokeColor: '#EEEEEE',  // to see which ones work best for you
                        generateGradient: true,
                        highDpiSupport: true,     // High resolution support
                    
                    };
                    var target = document.getElementById('perfChart'); // your canvas element
                    var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
                    gauge.maxValue = 110; // set max gauge value
                    gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
                    gauge.animationSpeed = 32; // set animation speed (32 is default value)
                    gauge.set(max_speed);
                }
                else
                {
                    console.log('No data to draw.');
                }
            }
        },

        // Affiche la vitesse maximale de le journée précédente
        maxSpeedYesterday: function() {
            var start_date = new Date();
            var month = start_date.getMonth();
            var day = start_date.getDate()-1;
            var year = start_date.getFullYear();
            var selected_vehicle_id;
            var start_timestamp = moment(new Date(year, month, day, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss');
            var end_timestamp = moment(new Date(year, month, day, 23, 59, 59)).format('YYYY-MM-DD HH:mm:ss');
            if (localStorage.selectedVehicletab && localStorage.truckList) {
                selected_vehicle_id = JSON.parse(localStorage.selectedVehicletab).id;
            }
            else {
                selected_vehicle_id = 0;
            }
            $.ajax({
                type: 'POST',
                url: url+'/max_speed_indic/'+selected_vehicle_id,
                dataType: 'json',
                data: {timezone: localStorage.timezone, aggregation: 'day', start_timestamp: start_timestamp, end_timestamp: end_timestamp},
                headers: {
                    "faun-token":token
                },
                success: function(resultat){
                    maxSpeedYesterdayTruck(resultat);
                },
                error: function(err){
                    console.log(err);
                }
            });
            function maxSpeedYesterdayTruck(json){
                var max_speed = 0;
                if(json != 0)
                {
                    max_speed = json.Max_speed_day;
                }
                else
                {
                    console.log('No data to draw.');
                }
            }
        },

        // Affiche le detail des bacs leves : gauche, droite, etc
        emptyiedBinsDetail: function() {
            $('#emptyiedBinsDetailChart').remove();
            $('#perf_bins_indicator_div').append('<canvas id="emptyiedBinsDetailChart"></canvas>');
            var start_date = new Date();
            var month = start_date.getMonth();
            var day = start_date.getDate();
            var year = start_date.getFullYear();
            var selected_vehicle_id;
            var start_timestamp = moment(new Date(year, month, day, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss');
            var end_timestamp = moment(new Date(year, month, day, 23, 59, 59)).format('YYYY-MM-DD HH:mm:ss');
            var emptyiedBinsDetailChart = document.getElementById("emptyiedBinsDetailChart").getContext("2d");
            emptyiedBinsDetailChart.canvas.height = 180;
            if (localStorage.selectedVehicletab && localStorage.truckList) {
                selected_vehicle_id = JSON.parse(localStorage.selectedVehicletab).id;
            }
            else {
                selected_vehicle_id = 0;
            }
            $.ajax({
                type: 'POST',
                url: url+'/emptied_bin_indic/'+selected_vehicle_id,
                dataType: 'json',
                data: {timezone: localStorage.timezone, aggregation: 'day', start_timestamp: start_timestamp, end_timestamp: end_timestamp},
                headers: {
                    "faun-token":token
                },
                success: function(resultat){
                    emptyiedBinsDetailDay(resultat);
                },
                error: function(err){
                    console.log(err);
                }
            });
            function emptyiedBinsDetailDay(json) {
                var nb_emptied_bins_left = 0;
                var nb_emptied_bins_right = 0;
                var nb_emptied_bins_middle = 0;
                var nb_emptied_bins_large = 0;
                var Labels = ['Bacs gauche', 'Bacs droit', 'Bacs milieu', 'Bacs 4 roues'];
                var Colors = ['#7c85ab', '#a0cd7c', '#efc163', '#d99da6'];
                $.each(json, function(index, element){
                    nb_emptied_bins_left += element.Left_Emptied_bins 
                    nb_emptied_bins_right += element.Right_Emptied_bins
                    nb_emptied_bins_middle += element.Middle_Emptied_bins
                    nb_emptied_bins_large += element.Large_Emptied_bins;
                });
                // Set value equal to 0 to undefined in order to hide data from Chart
                if(nb_emptied_bins_left === 0) {
                    nb_emptied_bins_left = undefined;
                }
                if(nb_emptied_bins_right === 0) {
                    nb_emptied_bins_right = undefined;
                }
                if(nb_emptied_bins_middle === 0) {
                    nb_emptied_bins_middle = undefined;
                }
                if(nb_emptied_bins_large === 0) {
                    nb_emptied_bins_large = undefined;
                }
                // Grap des dernieres communications enregistrees
                binsChart = new Chart(emptyiedBinsDetailChart, {
                    type: 'doughnut',
                    data: {
                        labels: Labels,
                        datasets: [
                            {
                                backgroundColor: Colors,
                                data: [nb_emptied_bins_left, nb_emptied_bins_right, nb_emptied_bins_middle, nb_emptied_bins_large]
                            }
                        ]
                    },
                    options: {
                        responsive: true, 
                        maintainAspectRatio: false,
                        legend: {
                            display: true,
                            position: 'right',
                        },
                        plugins: {
                            labels: {
                                render: 'value',
                                fontSize: 14,
                                fontColor: '#fff' 
                            }
                        }
                    }
                });
            }
        }
    }
}