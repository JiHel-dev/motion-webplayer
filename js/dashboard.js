$(window).on('load', function() {
    setTimeout(removeLoader,3000);
    function removeLoader(){
        $( "#loadingDiv" ).fadeOut(200, function() {
            $( "#loadingDiv" ).hide();
        });
    }
});
$(function(){
    // Check token validity
    if($.isEmptyObject(localStorage.token)) {
        console.log('Error: token is missing.');
        $('#logout').trigger('click');
        return true;
    } else {
        // Determiner les infos utilisateur
        var url = 'https://connect.faun.fr/api/public';
        $.ajax({
            type: 'GET',
            url: url+'/user_info',
            dataType: 'json',
            data :{},
            headers: {
                "faun-token":token
            },
            success: function(resultat){
                // Determiner les infos utilisateur
                FaunUtilityModule.stock.userInfo(resultat);
                
                $('#statusChart').remove();
                $('#status_chart_div').append('<canvas id="statusChart"></canvas>');

                $('#lastComChart').remove();
                $('#last_com_chart_div').append('<canvas id="lastComChart"></canvas>');

                $('#emptyiedBinsDetailChart').remove();
                $('#perf_bins_indicator_div').append('<canvas id="emptyiedBinsDetailChart"></canvas>');

                $('#perfChart').remove();
                $('#perf_indicator_div').append('<canvas id="perfChart"></canvas>');

                $('#park_card').remove();
                $('#divTruckPosition').append('<div id="park_card"></div>');

                resetAccordion();
                parseAccordion();
                
                // Get timezone
                FaunUtilityModule.get.timezone();
                
                // Identification du nom de la div du graph doughnut
                var statusChart = document.getElementById("statusChart").getContext("2d");
                statusChart.canvas.height = 180;
                var lastComChart = document.getElementById("lastComChart").getContext("2d");
                lastComChart.canvas.height = 180;
                var emptyiedBinsDetailChart = document.getElementById("emptyiedBinsDetailChart").getContext("2d");
                emptyiedBinsDetailChart.canvas.height = 180;

                // Determiner quels vehicules peuvent etre affiches sur la carte, puis les afficher avec des marqueurs
                // Determiner la derniere position geoloc et afficher le graph derniere com
                var url = 'https://connect.faun.fr/api/public';
                $.ajax({
                    type: 'POST',
                    url: url+'/geolocations_last_auth_vehicles',
                    dataType: 'json',
                    data :{timezone: localStorage.timezone},
                    headers: {
                        "faun-token":token
                    },
                    success: function(resultat){
                        FaunUtilityModule.stock.listAuthorizedVehicle(resultat);
                        FaunDashboardModule.map.lastKnownPosition(resultat);
                        FaunDashboardModule.indicators.lastCommunicationDate(resultat);
                    },
                    error: function(err){
                        console.log(err);
                    }
                });

                // Requete pour determiner quels vehicules sont en ligne
                $.ajax({
                    type: 'GET',
                    url: url+'/status_auth_vehicles',
                    dataType: 'json',
                    data :{timezone: localStorage.timezone},
                    headers: {
                        "faun-token":token
                    },
                    success: function(resultat){
                        FaunDashboardModule.indicators.connectedTrucks(resultat);
                    },
                    error: function(err){
                        console.log(err);
                    }
                });
                // Donnees du jour
                FaunDashboardModule.indicators.totalDistanceDay();
                FaunDashboardModule.indicators.averageSpeedDay();
                FaunDashboardModule.indicators.emptyiedBinsDay();
                FaunDashboardModule.indicators.collectionTimeDay();
                FaunDashboardModule.indicators.maxSpeedDay();
                FaunDashboardModule.indicators.emptyiedBinsDetail();
                // Donnees d'hier
                FaunDashboardModule.indicators.totalDistanceYesterday();
                FaunDashboardModule.indicators.averageSpeedYesterday();
                FaunDashboardModule.indicators.emptyiedBinsYesterday();
                FaunDashboardModule.indicators.collectionTimeYesterday();
                FaunDashboardModule.indicators.maxSpeedYesterday();

                $('a[href="#today-summary"]').on('shown.bs.tab', function (e) {
                    FaunDashboardModule.indicators.maxSpeedDay();
                });
                $('a[href="#yesterday-summary"]').on('shown.bs.tab', function (e) {
                    FaunDashboardModule.indicators.maxSpeedYesterday();
                });

                $('a[href="#perf-emptyied-bins-today-summary"]').on('shown.bs.tab', function (e) {
                    FaunDashboardModule.indicators.emptyiedBinsDetail();
                });
                $('a[href="#perf-max-speed-today-summary"]').on('shown.bs.tab', function (e) {
                    FaunDashboardModule.indicators.maxSpeedDay();
                });

                $('#selectVehicleIdx').change(function() {
                    // Change le vehicule selectionne dans le local storage
                    var selected_vehicle_name = $("#selectVehicleIdx").val();
                    var rcv_num_id = JSON.parse(localStorage.truckList);
                    for (rcv_num_id.index = 0; rcv_num_id.index < rcv_num_id.length; rcv_num_id.index++) {
                        if(selected_vehicle_name==rcv_num_id[rcv_num_id.index].rcv_number) {
                            selected_vehicle_id = rcv_num_id[rcv_num_id.index].vehicle_id;
                            var last_collect = rcv_num_id[rcv_num_id.index].lastCollect;
                        }
                    }
                    localStorage.selectedVehicletab = JSON.stringify({name: selected_vehicle_name, id:selected_vehicle_id, lastCollect: last_collect});
                    // Execute les fonctions statistiques
                    FaunDashboardModule.indicators.totalDistanceDay();
                    FaunDashboardModule.indicators.averageSpeedDay();
                    FaunDashboardModule.indicators.maxSpeedDay();
                    FaunDashboardModule.indicators.emptyiedBinsDay();
                    FaunDashboardModule.indicators.collectionTimeDay();
                    FaunDashboardModule.indicators.emptyiedBinsDetail();
                    FaunDashboardModule.indicators.totalDistanceYesterday();
                    FaunDashboardModule.indicators.averageSpeedYesterday();
                    FaunDashboardModule.indicators.emptyiedBinsYesterday();
                    FaunDashboardModule.indicators.collectionTimeYesterday();
                    $("#selectVehicleIdx").selectpicker("refresh");
                });

                // Parse Accordion list
                function parseAccordion() {
                    var acc = document.getElementsByClassName("accordion");
                    var i;
                    for (i = 0; i < acc.length; i++) {
                        acc[i].addEventListener("click", function() {
                            this.classList.toggle("active");
                            var panel = this.nextElementSibling;
                            if (panel.style.display === "block") {
                                panel.style.display = "none";
                            } else {
                                panel.style.display = "block";
                            }
                        });
                    }
                }

                // Reset Accordion list
                function resetAccordion() {
                    var pan = document.getElementsByClassName("panel");
                    var j;
                    for (j = 0; j < pan.length; j++) {
                        pan[j].style.display = "none";
                    }
                    var acc = document.getElementsByClassName("accordion");
                    var i;
                    for (i = 0; i < acc.length; i++) {
                        acc[i].classList.remove("active");
                    }
                }

                // Flip action for index cards 
                $('#btn-flip-to-front-available-trucks').click(function(){
                    $('#available-trucks').toggleClass('flipped');
                    resetAccordion();
                });
                $('#btn-flip-to-back-available-trucks').click(function(){
                    $('#available-trucks').toggleClass('flipped');
                    resetAccordion();
                });
                $('#btn-flip-to-front-last-com').click(function(){
                    $('#last-coms').toggleClass('flipped');
                    resetAccordion();
                });
                $('#btn-flip-to-back-last-com').click(function(){
                    $('#last-coms').toggleClass('flipped');
                    resetAccordion();
                });
            },
            error: function(err){
                console.log(err);
                $("#disconnectModal").modal('show');
                setTimeout(disconnect, 2000);
                function disconnect() {
                    $("#disconnectModal").fadeOut(2000, function() {
                        $("#disconnectModal").modal('show');
                    });
                    $('#logout').trigger('click');
                }
                return false;
            }
        });
    }
});