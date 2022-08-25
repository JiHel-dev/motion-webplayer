$(window).on('load', function() {
    setTimeout(removeLoader, 200);
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
                FaunUtilityModule.get.timezone();
                // Affiche la liste des véhicules authorisés
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
                    },
                    error: function(err){
                        console.log(err);
                    }
                });

                var initialLocaleCode = localStorage.language || 'fr';
                // Detecter le francais pour afficher les mois et jours en francais
                if(initialLocaleCode==="fr")
                {
                    $("#advancedSearch_startDate").datetimepicker({
                    locale: 'fr',
                    format:'YYYY-MM-DD HH:mm',
                    minDate: '2018-06-01',
                    maxDate: '2118-06-01',
                    stepping: 1
                    });
                }
                else 
                {
                $("#advancedSearch_startDate").datetimepicker({
                    locale: 'en',
                    format:'YYYY-MM-DD hh:mm',
                    minDate: '2018-06-01',
                    maxDate: '2118-06-01',
                    defaultDate: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    stepping: 1
                });
                }

                // Advanced search
                $("#rcv_num_input").keyup(function(e){
                    if(e.keyCode == 13)
                    {
                        $("#rcv_num_input").blur(); 
                        $('#vehicle_search_btn').trigger("click");
                    }
                });
                $("#advancedSearch").click(function(){
                    var advancedSearchIsCollapsed = true;
                    $("#advancedSearch .rotate-icon").toggleClass("right");
                    // Focus on recipient element when expand advancedSearch
                    $("#advancedSearchDiv").on('shown.bs.collapse', function() {
                        if(advancedSearchIsCollapsed)
                        {
                            $("#advancedSearch_plate_number").trigger("focus");
                        }
                        advancedSearchIsCollapsed = false;
                    });
                    $("#advancedSearchDiv").on('hidden.bs.collapse', function() {
                        $("#advancedSearch .rotate-icon").toggleClass("right");
                    });
                });

                // Post la chaîne de recherche
                $('#vehicle_search_btn').on('click', function() {
                    $("#loadingDiv").show();
                    setTimeout(removeLoader, 1000);
                    function removeLoader(){
                        $( "#loadingDiv" ).fadeOut(200, function() {
                            $( "#loadingDiv" ).hide();
                        });
                    }
                    var search_string = $("#rcv_num_input").val();
                    // console.log(search_string);
                    if(search_string == 0 || search_string == "" || search_string == null)
                    {
                        console.log('No data to show.');
                        $("#noVehicleFound").modal('toggle');
                        $('#noVehicleFound').trigger('traduction');
                        $("#noVehicleFound").modal('show');
                    }
                    else
                    {
                        FaunSearchModule.get.searchVehicle(search_string);
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