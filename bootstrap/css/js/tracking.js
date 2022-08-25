$(window).on('load', function() {
    setTimeout(removeLoader, 2000);
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
                FaunUtilityModule.stock.userInfo(resultat);
                if(JSON.parse(localStorage.userInfo).type === "client")
                {
                    $("#maintenance-tab").remove();
                    $("#tech_data_nav_link").remove();
                }
                if(JSON.parse(localStorage.userInfo).type === "sav")
                {
                    $("#exploitation-tab").remove();
                    $("#tech_data_nav_link").remove();
                }
                // Detection de la Timezone du navigateur
                FaunUtilityModule.get.timezone();
                var url = 'https://connect.faun.fr/api/public';

                $('#emptyied_bins_indic').remove();
                $('#collection_time_indic').remove();
                $('#total_distance_indic').remove();
                $('#average_speed_indic').remove();
                $('#max_speed_indic').remove();
                $('#used_fuel_indic').remove();

                // Affiche la liste des véhicules authorisés
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
                    },
                    error: function(err){
                        console.log(err);
                    }
                });

                // Detecter le francais pour afficher les mois et jours en francais
                var lang = localStorage.language;
                if(lang==="fr")
                {
                    $("#start-timestamp").datepicker({
                        dateFormat:'yy-mm-dd',
                        minDate: '2018-06-01',
                        maxDate: '2098-06-01',
                        defaultDate: new Date(),
                        showWeek: true,
                        showAnim: 'clip',
                        closeText: "Fermer",
                        prevText: "Précédent",
                        nextText: "Suivant",
                        currentText: "Aujourd'hui",
                        monthNames: [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                            "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ],
                        monthNamesShort: [ "Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin",
                            "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc." ],
                        dayNames: [ "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi" ],
                        dayNamesShort: [ "Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam." ],
                        dayNamesMin: [ "D","L","M","M","J","V","S" ],
                        weekHeader: "Sem.",
                        firstDay: 1,
                        isRTL: false,
                        showMonthAfterYear: false,
                        yearSuffix: "",
                        showOtherMonths: true,
                        selectOtherMonths: true
                    });
                }
                else 
                {
                    $("#start-timestamp").datepicker({
                        dateFormat:'yy-mm-dd',
                        minDate: '2018-06-01',
                        maxDate: '2098-06-01',
                        defaultDate:new Date(),
                        showWeek: true,
                        showAnim: 'clip',
                        firstDay: 1,
                        showOtherMonths: true,
                        selectOtherMonths: true
                    });
                }

                localStorage.displayEmptyingPlace = true;
                if (localStorage.selectedVehicletab) {
                    var selected_vehicle_name = JSON.parse(localStorage.selectedVehicletab).name;
                    var rcv_num_id = JSON.parse(localStorage.truckList);
                    for (rcv_num_id.index = 0; rcv_num_id.index < rcv_num_id.length; rcv_num_id.index++) {
                        if(selected_vehicle_name==rcv_num_id[rcv_num_id.index].rcv_number) {
                            selected_vehicle_id = rcv_num_id[rcv_num_id.index].vehicle_id;
                            var last_collect = rcv_num_id[rcv_num_id.index].lastCollect;
                        }
                    }
                    localStorage.selectedVehicletab = JSON.stringify({name: selected_vehicle_name, id:selected_vehicle_id, lastCollect: last_collect});
                }
                else {
                    var selected_vehicle_id = 0;
                }
                // $("#start-timestamp").datepicker("setDate", new Date());
                $("#start-timestamp").datepicker("setDate", moment(JSON.parse(localStorage.selectedVehicletab).lastCollect).format('YYYY-MM-DD'));

                $("#plus_one").on("click", function(){
                    var date2 = $('#start-timestamp').datepicker('getDate', '+1d'); 
                    date2.setDate(date2.getDate()+1); 
                    $('#start-timestamp').datepicker('setDate', date2);
                    $('#start-timestamp').trigger('change');
                });
                $("#minus_one").on("click", function(){
                    var date2 = $('#start-timestamp').datepicker('getDate', '+1d'); 
                    date2.setDate(date2.getDate()-1); 
                    $('#start-timestamp').datepicker('setDate', date2);
                    $('#start-timestamp').trigger('change');
                });
                // var start_timestamp = $('#start-timestamp').val() + ' ' + '00:00:00';
                var start_timestamp = moment(JSON.parse(localStorage.selectedVehicletab).lastCollect).format('YYYY-MM-DD') + ' ' + '00:00:00';
                localStorage.start_timestamp = start_timestamp;
                // var end_timestamp = $('#start-timestamp').val() + ' ' + '23:59:59';
                var end_timestamp = moment(JSON.parse(localStorage.selectedVehicletab).lastCollect).format('YYYY-MM-DD') + ' ' + '23:59:59';
                localStorage.end_timestamp = end_timestamp;
                var min_slider = Date.parse(start_timestamp)/1000; // Date.parse() renvoie le nombre de millisec depuis 1/1/1970
                var max_slider = Date.parse(end_timestamp)/1000;   // Il faut donc diviser par 1000
                $("#start_intervalle").html('00:00');
                $("#end_intervalle").html('23:59');
                function zeroPad(num, places) {
                    var zero = places - num.toString().length + 1;
                    return Array(+(zero > 0 && zero)).join("0") + num;
                };
                function formatDT(__dt) {
                    var year = __dt.getFullYear();
                    var month = zeroPad(__dt.getMonth()+1, 2);
                    var date = zeroPad(__dt.getDate(), 2);
                    var hours = zeroPad(__dt.getHours(), 2);
                    var minutes = zeroPad(__dt.getMinutes(), 2);
                    return hours + ':' + minutes;
                };
                $("#geoloc-slider").slider({
                    range: true,
                    min: min_slider,
                    max: max_slider,
                    step: 600,  // step de 10 min: 60*10 = 600 sec
                    values: [ min_slider, max_slider ],
                    slide: function(event, ui) {
                        var current_from = new Date(ui.values[0]*1000);
                        var current_to = new Date(ui.values[1]*1000);
                        $("#start_intervalle").html(formatDT(current_from));
                        $("#end_intervalle").html(formatDT(current_to));
                    },
                    change: function(event, ui) {
                        $("#geoloc-slider").slider("disable");
                        $('#emptyied_bins_indic').remove();
                        $('#collection_time_indic').remove();
                        $('#total_distance_indic').remove();
                        $('#average_speed_indic').remove();
                        $('#max_speed_indic').remove();
                        $('#used_fuel_indic').remove();
                        var current_from = new Date(ui.values[0]*1000);
                        var current_to = new Date(ui.values[1]*1000);
                        start_timestamp = $('#start-timestamp').val() + ' ' + formatDT(current_from);
                        localStorage.start_timestamp = start_timestamp;
                        end_timestamp = $('#start-timestamp').val() + ' ' + formatDT(current_to);
                        localStorage.end_timestamp = end_timestamp;
                        FaunTrackingModule.init.map();
                        FaunTrackingModule.get.truckPath(start_timestamp, end_timestamp, selected_vehicle_id);
                        FaunTrackingModule.get.totalDistance(start_timestamp, end_timestamp, selected_vehicle_id);
                        FaunTrackingModule.get.maxSpeed(start_timestamp, end_timestamp, selected_vehicle_id);
                        FaunTrackingModule.get.averageSpeed(start_timestamp, end_timestamp, selected_vehicle_id);
                        FaunTrackingModule.get.collectionTime(start_timestamp, end_timestamp, selected_vehicle_id);
                        FaunTrackingModule.get.emptyiedBins(start_timestamp, end_timestamp, selected_vehicle_id);
                        setTimeout(getUsedFuel, 500);
                        function getUsedFuel(){
                            FaunTrackingModule.get.usedFuel(start_timestamp, end_timestamp, selected_vehicle_id);
                            if(JSON.parse(localStorage.displayEmptyingPlace) == true)
                            {
                                FaunTrackingModule.get.emptyingPlace(start_timestamp, end_timestamp, selected_vehicle_id);
                            }
                        }
                        setTimeout(disableSlider, 1000);
                        function disableSlider(){
                            $("#geoloc-slider").slider("enable");
                        }
                    }
                });

                $('#geoloc-slider, #start_intervalle, #end_intervalle').css('cursor', 'pointer');
                FaunTrackingModule.init.map();
                FaunTrackingModule.get.truckPath(start_timestamp, end_timestamp, selected_vehicle_id);
                FaunTrackingModule.get.totalDistance(start_timestamp, end_timestamp, selected_vehicle_id);
                FaunTrackingModule.get.maxSpeed(start_timestamp, end_timestamp, selected_vehicle_id);
                FaunTrackingModule.get.averageSpeed(start_timestamp, end_timestamp, selected_vehicle_id);
                FaunTrackingModule.get.collectionTime(start_timestamp, end_timestamp, selected_vehicle_id);
                FaunTrackingModule.get.emptyiedBins(start_timestamp, end_timestamp, selected_vehicle_id);
                setTimeout(getUsedFuel, 500);
                function getUsedFuel(){
                    FaunTrackingModule.get.usedFuel(start_timestamp, end_timestamp, selected_vehicle_id);
                    if(JSON.parse(localStorage.displayEmptyingPlace) == true)
                    {
                        FaunTrackingModule.get.emptyingPlace(start_timestamp, end_timestamp, selected_vehicle_id);
                    }
                }

                    
                $("#start-timestamp").on('change', function(){
                    $("#loadingDiv").show();
                    setTimeout(removeLoader, 2000);
                    function removeLoader(){
                        $( "#loadingDiv" ).fadeOut(200, function() {
                            $( "#loadingDiv" ).hide();
                        });  
                    }
                    var selected_vehicle_name = $("#selectVehicleIdx").val();
                    var rcv_num_id = JSON.parse(localStorage.truckList);
                    for (rcv_num_id.index = 0; rcv_num_id.index < rcv_num_id.length; rcv_num_id.index++) {
                        if(selected_vehicle_name==rcv_num_id[rcv_num_id.index].rcv_number) {
                            selected_vehicle_id = rcv_num_id[rcv_num_id.index].vehicle_id;
                            var last_collect = rcv_num_id[rcv_num_id.index].lastCollect;
                        }
                    }
                    localStorage.selectedVehicletab = JSON.stringify({name: selected_vehicle_name, id:selected_vehicle_id, lastCollect: last_collect});
                    $('#emptyied_bins_indic').remove();
                    $('#collection_time_indic').remove();
                    $('#total_distance_indic').remove();
                    $('#average_speed_indic').remove();
                    $('#max_speed_indic').remove();
                    $('#used_fuel_indic').remove();
                    var start_timestamp = $('#start-timestamp').val() + ' ' + '00:00:00';
                    localStorage.start_timestamp = start_timestamp;
                    var end_timestamp = $('#start-timestamp').val() + ' ' + '23:59:59';
                    localStorage.end_timestamp = end_timestamp;
                    FaunTrackingModule.init.map();
                    FaunTrackingModule.get.truckPath(start_timestamp, end_timestamp, selected_vehicle_id);
                    FaunTrackingModule.get.totalDistance(start_timestamp, end_timestamp, selected_vehicle_id);
                    FaunTrackingModule.get.maxSpeed(start_timestamp, end_timestamp, selected_vehicle_id);
                    FaunTrackingModule.get.averageSpeed(start_timestamp, end_timestamp, selected_vehicle_id);
                    FaunTrackingModule.get.collectionTime(start_timestamp, end_timestamp, selected_vehicle_id);
                    FaunTrackingModule.get.emptyiedBins(start_timestamp, end_timestamp, selected_vehicle_id);
                    setTimeout(getUsedFuel, 500);
                    function getUsedFuel(){
                        FaunTrackingModule.get.usedFuel(start_timestamp, end_timestamp, selected_vehicle_id);
                        if(JSON.parse(localStorage.displayEmptyingPlace) == true)
                        {
                            FaunTrackingModule.get.emptyingPlace(start_timestamp, end_timestamp, selected_vehicle_id);
                        }
                    }
                });

                $('#selectVehicleIdx').change(function() {
                    $("#loadingDiv").show();
                    setTimeout(removeLoader, 2000);
                    function removeLoader(){
                        $( "#loadingDiv" ).fadeOut(200, function() {
                            $( "#loadingDiv" ).hide();
                        });  
                    }
                    // change le vehicule selectionne dans le local storage
                    var selected_vehicle_name = $("#selectVehicleIdx").val();
                    var rcv_num_id = JSON.parse(localStorage.truckList);
                    for (rcv_num_id.index = 0; rcv_num_id.index < rcv_num_id.length; rcv_num_id.index++) {
                        if(selected_vehicle_name==rcv_num_id[rcv_num_id.index].rcv_number) {
                            selected_vehicle_id = rcv_num_id[rcv_num_id.index].vehicle_id;
                            var last_collect = rcv_num_id[rcv_num_id.index].lastCollect;
                        }
                    }
                    localStorage.selectedVehicletab = JSON.stringify({name: selected_vehicle_name, id:selected_vehicle_id, lastCollect: last_collect});
                    $('#emptyied_bins_indic').remove();
                    $('#collection_time_indic').remove();
                    $('#total_distance_indic').remove();
                    $('#average_speed_indic').remove();
                    $('#max_speed_indic').remove();
                    $('#used_fuel_indic').remove();
                    var start_timestamp = $('#start-timestamp').val() + ' ' + '00:00:00';
                    localStorage.start_timestamp = start_timestamp;
                    var end_timestamp = $('#start-timestamp').val() + ' ' + '23:59:59';
                    localStorage.end_timestamp = end_timestamp;
                    FaunTrackingModule.init.map();
                    FaunTrackingModule.get.truckPath(start_timestamp, end_timestamp, selected_vehicle_id);
                    FaunTrackingModule.get.totalDistance(start_timestamp, end_timestamp, selected_vehicle_id);
                    FaunTrackingModule.get.maxSpeed(start_timestamp, end_timestamp, selected_vehicle_id);
                    FaunTrackingModule.get.averageSpeed(start_timestamp, end_timestamp, selected_vehicle_id);
                    FaunTrackingModule.get.collectionTime(start_timestamp, end_timestamp, selected_vehicle_id);
                    FaunTrackingModule.get.emptyiedBins(start_timestamp, end_timestamp, selected_vehicle_id);
                    setTimeout(getUsedFuel, 500);
                    function getUsedFuel(){
                        FaunTrackingModule.get.usedFuel(start_timestamp, end_timestamp, selected_vehicle_id);
                        if(JSON.parse(localStorage.displayEmptyingPlace) == true)
                        {
                            FaunTrackingModule.get.emptyingPlace(start_timestamp, end_timestamp, selected_vehicle_id);
                        }
                    }
                });

                $('[data-toggle="tooltip"]').tooltip();
                $('#divChart').remove();
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