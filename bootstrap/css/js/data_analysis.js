$(function(){
    setTimeout(removeLoader, 1500);
    function removeLoader(){
        $("#loadingDiv").fadeOut(200, function() {
            $("#loadingDiv").hide();
        });
    }

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
                FaunUtilityModule.get.timezone();
                /* * * * * * * * * * * * * * * * * * * *
                /*  Determiner les infos utilisateur   *
                /* * * * * * * * * * * * * * * * * * * */
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
            
                $('#measureChart').remove();
                $('#measure_chart_div').append('<canvas id="measureChart"></canvas>');
            
                var measureChart = document.getElementById("measureChart").getContext("2d");
                measureChart.canvas.height = 450;
            
                /* * * * * * * * * * * * * * * * * * *
                /*  Affiche la liste des véhicules   *
                /* * * * * * * * * * * * * * * * * * */
                var url = 'https://connect.faun.fr/api/public';
                islistAuthorizedVehicle = false;
                $.ajax({
                    type: 'POST',
                    url: url+'/geolocations_last_auth_vehicles',
                    dataType: 'json',
                    data :{timezone: localStorage.timezone},
                    headers: {
                        "faun-token":token
                    },
                    timeout: 10000,
                    success: function(resultat){
                        FaunUtilityModule.stock.listAuthorizedVehicle(resultat);
                    },
                    error: function(err){
                        console.log(err);
                    }
                });
                /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
                /*  Initialisation des variables pour les indicateurs  *
                /* * * * * * * * * * * * * * * * * * * * * * * * * * * */
                // Detecter le francais pour afficher les mois et jours en francais
                var lang = localStorage.language;
                if(lang==="fr")
                {
                    $("#end-timestamp-data").datepicker({
                        dateFormat:'yy-mm-dd',
                        minDate: '2018-06-01',
                        maxDate: '2098-06-01',
                        defaultDate:new Date(),
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
                    $("#end-timestamp-data").datepicker({
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
            
                $("#end-timestamp-data").datepicker("setDate", new Date());
            
                $("#plus_one").on("click", function(){
                    var date2 = $('#end-timestamp-data').datepicker('getDate', '+1d'); 
                    date2.setDate(date2.getDate()+1); 
                    $('#end-timestamp-data').datepicker('setDate', date2);
                });
                $("#minus_one").on("click", function(){
                    var date2 = $('#end-timestamp-data').datepicker('getDate', '+1d'); 
                    date2.setDate(date2.getDate()-1); 
                    $('#end-timestamp-data').datepicker('setDate', date2);
                });
                
                var url = 'https://connect.faun.fr/api/public';
                if (localStorage.selectedVehicletab) {
                    var selected_vehicle_name = JSON.parse(localStorage.selectedVehicletab).name;
                    var rcv_num_id = JSON.parse(localStorage.truckList);
                    for (rcv_num_id.index = 0; rcv_num_id.index < rcv_num_id.length; rcv_num_id.index++) {
                        if(selected_vehicle_name==rcv_num_id[rcv_num_id.index].rcv_number) {
                            selected_vehicle_id = rcv_num_id[rcv_num_id.index].vehicle_id;
                        }
                    }
                    localStorage.selectedVehicletab = JSON.stringify({name: selected_vehicle_name, id:selected_vehicle_id});
                }
                else {
                    var selected_vehicle_id = 0;
                }
                var start_date = new Date();
                var month = start_date.getMonth();
                var day = start_date.getDate();
                var year = start_date.getFullYear();
                var hour = start_date.getHours();
                var minute = start_date.getMinutes();
                var second = start_date.getSeconds();
                
                FaunDataAnalysisModule.indicators.displayEmptyiedBins(selected_vehicle_id);
                FaunDataAnalysisModule.indicators.displayLifterCycles(selected_vehicle_id);
                FaunDataAnalysisModule.indicators.displayAverageSpeed(selected_vehicle_id);
                
                // Affiche les indicateurs suivant leurs categories
                var dataType = localStorage.dataType || $('#selectData').find("option:selected")[0].id;
                FaunDataAnalysisModule.dataType.getDataType(dataType);
                
                // Change les indicateurs suivant la categorie selectionnee par l'utilisateur
                $('#selectData').change(function(){
                    var dataType = $(this).find("option:selected")[0].id;
                    localStorage.dataType = dataType;
                    FaunDataAnalysisModule.dataType.getDataType(dataType);
                });
            
                // Affiche les donnees brutes sous forme de graphique lineaire
                $.ajax({
                    type: 'POST',
                    url: url+'/measure_type',
                    dataType: 'json',
                    data :{timezone: localStorage.timezone},
                    headers: {
                        "faun-token":token
                    },
                    success: function(resultat){
                        $('#selectMeasureOption').remove();
                        $.each(resultat, function(index, element){
                            $('#selectMeasure').append('<option>'+element.name+'</option>');
                        });
                        // Trie la liste des mesures
                        var select = $('#selectMeasure');
                        select.html(select.find('option').sort(function(x, y) {
                            // Pour changer le tri en ordre descendant remplacer "<" par ">"
                            return $(x).text() > $(y).text() ? 1 : -1;
                        }));
                        $('#selectMeasure').get(0).selectedIndex = 0;
                    },
                    error: function(err){
                        console.log(err);
                    }
                });
            
                // Detecter le francais pour afficher les mois et jours en francais
                var lang = localStorage.language;
                if(lang==="fr")
                {
                    $("#start-timestamp, #end-timestamp").datetimepicker({
                        format:'Y-m-d H:i:s',
                        minDate: '2018-06-01',
                        maxDate: '2118-06-01',
                        startDate:new Date(),
                        defaultDate:new Date(),
                        weeks: true,
                        step: 15
                    });
                }
                else 
                {
                    $("#start-timestamp, #end-timestamp").datetimepicker({
                        format:'Y-m-d H:i:s',
                        minDate: '2018-06-01',
                        maxDate: '2118-06-01',
                        startDate:new Date(),
                        defaultDate:new Date(),
                        weeks: true,
                        step: 15
                    });
                }
            
                $('#select_affichage_btn').change(function() {
                    var liste = $(this).prev('#select_affichage_btn');
                    var objectSelect = $(this).find("option:selected");
                    var selectedDisplayValue = objectSelect[0].innerHTML;
                    localStorage.selectedDisplayValue = selectedDisplayValue;
                    $('#plot-btn').trigger('click');
                });
            
                // Traduit l'agregation selectionnee avec le bouton en valeur comprise par l'API
                $("#btn-group-affichage > label.btn").on("click", function(){
                    $("#loadingDiv").show();
                    setTimeout(removeLoader, 1500);
                    function removeLoader(){
                        $( "#loadingDiv" ).fadeOut(200, function() {
                            $( "#loadingDiv" ).hide();
                        });  
                    }
                    var aggregation = $(this).find(".trn").html();
                    if(localStorage.language == 'fr') {
                        if(aggregation == 'Jour')
                        {
                            localStorage.aggregationValue = 'day';
                        }
                        else if(aggregation == 'Semaine')
                        {
                            localStorage.aggregationValue = 'week';
                        }
                        else if(aggregation == 'Mois')
                        {
                            localStorage.aggregationValue = 'month';
                        }
                        else
                        {
                            localStorage.aggregationValue = 'week';
                        }
                    }
                    else
                    {
                        localStorage.aggregationValue = aggregation;
                    }
                    FaunDataAnalysisModule.indicators.displayEmptyiedBins(selected_vehicle_id);
                    FaunDataAnalysisModule.indicators.displayLifterCycles(selected_vehicle_id);
                    FaunDataAnalysisModule.indicators.displayAverageSpeed(selected_vehicle_id);
                });
            
                $('#selectVehicleIdx').change(function() {
                    $("#loadingDiv").show();
                    setTimeout(removeLoader, 1500);
                    function removeLoader(){
                        $( "#loadingDiv" ).fadeOut(200, function() {
                            $( "#loadingDiv" ).hide();
                        });  
                    }
                    // Change le vehicule selectionne dans le local storage
                    var selected_vehicle_name = $("#selectVehicleIdx").val();
                    var rcv_num_id = JSON.parse(localStorage.truckList);
                    for (rcv_num_id.index = 0; rcv_num_id.index < rcv_num_id.length; rcv_num_id.index++) {
                        if(selected_vehicle_name==rcv_num_id[rcv_num_id.index].rcv_number) {
                            selected_vehicle_id = rcv_num_id[rcv_num_id.index].vehicle_id;
                        }
                    }
                    localStorage.selectedVehicletab = JSON.stringify({name: selected_vehicle_name, id:selected_vehicle_id});
                    // Execution des fonctions statistiques indicateurs
                    FaunDataAnalysisModule.indicators.displayEmptyiedBins(selected_vehicle_id);
                    FaunDataAnalysisModule.indicators.displayLifterCycles(selected_vehicle_id);
                    FaunDataAnalysisModule.indicators.displayAverageSpeed(selected_vehicle_id);
                });
            
                $('#end-timestamp-data').change(function() {
                    $("#loadingDiv").show();
                    setTimeout(removeLoader, 1500);
                    function removeLoader(){
                        $( "#loadingDiv" ).fadeOut(200, function() {
                            $( "#loadingDiv" ).hide();
                        });  
                    }
                    FaunDataAnalysisModule.indicators.displayEmptyiedBins(selected_vehicle_id);
                    FaunDataAnalysisModule.indicators.displayLifterCycles(selected_vehicle_id);
                    FaunDataAnalysisModule.indicators.displayAverageSpeed(selected_vehicle_id);
                });
            
                // Definit par defaut une plage de date d'une journee
                $("#end-timestamp").datetimepicker({value: new Date()});
                $("#start-timestamp").datetimepicker({value: (function(d){ d.setDate(d.getDate()-1); return d})(new Date)});
            
                $("#plot-btn").on('click', function(){
                    $("#loadingDiv").show();
                    setTimeout(removeLoader, 1500);
                    function removeLoader(){
                        $( "#loadingDiv" ).fadeOut(200, function() {
                            $( "#loadingDiv" ).hide();
                        });
                    }
                    $('#tr-measures').remove();
                    $('#measureChart').remove();
                    $('#measure_chart_div').append('<canvas id="measureChart"></canvas>');
            
                    var measureChart = document.getElementById("measureChart").getContext("2d");
                    measureChart.canvas.height = 450;
                    var selected_vehicle_id = JSON.parse(localStorage.selectedVehicletab).id;
                    var measure_name = $( "#selectMeasure option:selected" ).text();
                    var start_timestamp = $('#start-timestamp').val();
                    var end_timestamp = $('#end-timestamp').val();
                    var month = new Date(end_timestamp).toLocaleDateString(localStorage.language, { month: 'long' });
                    var url = 'https://connect.faun.fr/api/public';
                    $.ajax({
                        type: 'POST',
                        url: url+'/measures/'+selected_vehicle_id,
                        dataType: 'json',
                        data: {timezone: localStorage.timezone, measure_name: measure_name, start_timestamp: start_timestamp, end_timestamp: end_timestamp},
                        headers: {
                            "faun-token":token
                        },
                        success: function(rslt){
                            afficheMeasure(rslt);
                        },
                        error: function(err){
                            console.log(err);
                        }
                    });
                    function afficheMeasure(obj){
                        var timestamps = [];
                        var values = [];
                        if(obj != 0)
                        {
                            $.each(obj, function(index, element){
                                $('#tbody-measures').append('<tr id="tr-measures"><td class="trn">'+element.timestamp+'</td><td class="trn">'+element.name+'</td><td class="trn">'+element.value+'</td><td class="trn">'+element.unit+'</td></tr>');
                                timestamps.push(element.timestamp);
                                values.push(element.value);
                            });
                            $('#MeasureTable').DataTable({
                                responsive: true
                            });
                            var chart = new Chart(measureChart, {
                                type: 'line',
                                data: {
                                    labels: timestamps,
                                    datasets: [{
                                        label: measure_name,
                                        backgroundColor: 'rgba(100, 200, 255, 0)',
                                        borderColor: 'rgba(0, 100, 200, 0.75)',
                                        hoverBackgroundColor: 'rgba(200, 200, 200, 1)',
                                        hoverBorderColor: 'rgba(200, 200, 200, 1)',
                                        data: values
                                    }]
                                },
                                options: {
                                    responsive: true, 
                                    maintainAspectRatio: false,
                                    elements: {
                                        line: {
                                            tension: 0 // Supprime le smoothing de la courbe
                                        }
                                    },
                                    scales: {
                                        xAxes: [{
                                            type: 'time',
                                            distribution: 'linear',
                                            time: {
                                                displayFormats: {
                                                    millisecond: 'DD-MM-YYYY HH:mm:ss',
                                                    second: 'YYYY-MM-DD HH:mm:ss',
                                                    minute: 'YYYY-MM-DD HH:mm:ss',
                                                    hour: 'YYYY-MM-DD HH:mm:ss',
                                                    day: 'YYYY-MM-DD HH:mm:ss',
                                                    week: 'YYYY-MM-DD HH:mm:ss',
                                                    month: 'YYYY-MM-DD HH:mm:ss',
                                                    quarter: 'YYYY-MM-DD HH:mm:ss',
                                                    ear: 'YYYY-MM-DD HH:mm:ss'
                                                }
                                            }
                                        }]
                                    },
                                    legend: {
                                        display: true,
                                        position: 'top',
                                    },
                                    pan: {
                                        enabled: true,
                                        mode: 'xy',
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
                                        mode: 'xy'
                                    },
                                    plugins: {
                                        datalabels: {
                                            display: false
                                        }
                                    }
                                }
                            });
                            $('#reset_zoom_btn').click(function(){
                                chart.resetZoom();
                            });
                        }
                        else
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
                    }
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