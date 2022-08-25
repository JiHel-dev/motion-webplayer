// Module de recherche de bennes
// Namespace: FaunSearchModule
var url = 'https://connect.faun.fr/api/public';
var total_distance = 0;
var FaunSearchModule = {

    // A props du module
    version: 1.0,
    description: 'Main module which contains search functions',

    // Sous namespace des fonctions d'initialisation
    init: {

    },

    // Sous namespace des fonctions de collecte d'information
    get: {

        searchVehicle: function (search_string) {
            $('#search_park_number').remove();
            $('#search_plate_number').remove();
            $('#search_chassis_number').remove();
            $('#search_rcv_number').remove();
            $('#search_driver_name').remove();
            $('#search_last_collection_tour').remove();
            $('#search_vehicle_status').remove();
            $.ajax({
                type: 'POST',
                url: url+'/search_vehicle',
                dataType: 'json',
                data: {search: search_string},
                headers: {
                    "faun-token":token
                },
                success: function(json){
                    foundVehicles(json);
                },
                error: function(err){
                    console.log(err);
                }
            });
            function foundVehicles(vehicles){
                if(vehicles != 0)
                {
                    $('#search_park_number_div').append('<span id="search_park_number" style="float: right">'+vehicles[0].park_number+'</span>');
                    $('#search_chassis_number_div').append('<span id="search_chassis_number" style="float: right">'+vehicles[0].chassis_number+'</span>');
                    $('#search_plate_number_div').append('<span id="search_plate_number" style="float: right">'+vehicles[0].plate_number+'</span>');
                    $('#search_rcv_number_div').append('<span id="search_rcv_number" style="float: right">'+vehicles[0].rcv_number+'</span>');
                    $('#search_driver_name_div').append('<span id="search_driver_name" style="float: right">'+vehicles[0].driver_name+'</span>');
                    $('#search_last_collection_tour_div').append('<span id="search_last_collection_tour" style="float: right">'+vehicles[0].last_collection_tour+'</span>');
                    $('#search_vehicle_status_div').append('<span id="search_vehicle_status" style="float: right">'+vehicles[0].vehicle_status+'</span>');
                }
                else
                {
                    console.log('No data to draw.');
                }
            }
        }
    }
}