$(window).on('load', function() {
    $("#selectVehicleIdx").prop("disabled", true);
    setTimeout(removeLoader);
    function removeLoader(){
        $( "#loadingDiv" ).fadeOut(200, function() {
            $( "#loadingDiv" ).remove();
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
                var url = 'https://connect.faun.fr/vpn-api/public';
                $.ajax({
                    type: 'GET',
                    url: url+'/vpn',
                    dataType: 'json',
                    data: {},
                    headers: {
                        "faun-token":token
                    },
                    success: function(rslt){
                        afficheVPN(rslt);
                    },
                    error: function(err){
                        console.log(err);
                    }
                });
                function afficheVPN(obj){
                    if(obj != 0)
                    {
                        $('#tr-vpn').remove();
                        $.each(obj, function(index, element){
                            $('#tbody-vpn').append('<tr id="tr-vpn"><td class="trn">'+element.hostname+'</td><td class="trn">'+element.ip_address+'</td><td class="trn">'+element.updated_at+'</td></tr>');
                        });
                        $('#VPNTable').DataTable({
                            "pageLength": 10,
                            responsive: true
                        });
                    }
                    else
                    {
                        console.log('Error: No data to draw.');
                    }
                }
            
                // Requete ajax pour determiner la liste des modems par vehicule, n° de série...
                var url = 'https://connect.faun.fr/api/public';
                $.ajax({
                    type: 'GET',
                    url: url+'/modem_list',
                    dataType: 'json',
                    data: {},
                    headers: {
                        "faun-token":token
                    },
                    success: function(rslt2){
                        afficheModems(rslt2);
                    },
                    error: function(err){
                        console.log(err);
                    }
                });
                function afficheModems(json){
                    if(json != 0)
                    {
                        $('#tr-modems').remove();
                        $.each(json, function(index, element){
                            if(element.status == "online")
                            {
                                $('#tbody-modems').append('<tr id="tr-modems"><td class="trn">'+element.serial_number+'</td><td class="trn">'+element.rcv_number+'</td><td class="trn">'+element.plate_number+'</td><td class="trn">'+element.chassis_number+'</td><td class="trn">'+element.park_number+'</td><td class="trn">'+element.gsm_info+'</td><td class="trn" style="background-color: #15ed68 !important;">'+element.status+'</td><td class="trn">'+element.created_at+'</td><td class="trn">'+element.version+'</td></tr>');
                            }
                            else 
                            {
                                $('#tbody-modems').append('<tr id="tr-modems"><td class="trn">'+element.serial_number+'</td><td class="trn">'+element.rcv_number+'</td><td class="trn">'+element.plate_number+'</td><td class="trn">'+element.chassis_number+'</td><td class="trn">'+element.park_number+'</td><td class="trn">'+element.gsm_info+'</td><td class="trn">'+element.status+'</td><td class="trn">'+element.created_at+'</td><td class="trn">'+element.version+'</td></tr>');
                            }
                        });
                        $('#ModemTable').DataTable({
                            "pageLength": 10,
                            responsive: true
                        });
                    }
                    else
                    {
                        console.log('Error: No data to draw.');
                    }
                }
            
                // Requete ajax pour determiner la liste des vehicules
                var url = 'https://connect.faun.fr/api/public';
                $.ajax({
                    type: 'GET',
                    url: url+'/vehicle_list',
                    dataType: 'json',
                    data: {},
                    headers: {
                        "faun-token":token
                    },
                    success: function(rslt2){
                        afficheVehicles(rslt2);
                    },
                    error: function(err){
                        console.log(err);
                    }
                });
                function afficheVehicles(json){
                    if(json != 0)
                    {
                        $('#tr-vehicles').remove();
                        $.each(json, function(index, element){
                            $('#tbody-vehicles').append('<tr id="tr-vehicles"><td class="trn">'+element.rcv_number+
                                                        '</td><td class="trn">'+element.plate_number+
                                                        '</td><td class="trn">'+element.chassis_number+
                                                        '</td><td class="trn">'+element.park_number+
                                                        '</td><td class="trn">'+element.software_version+
                                                        '</td><td class="trn">'+element.serial_number+
                            '</td></tr>');
                        });
                        $('#VehicleTable').DataTable({
                            "pageLength": 10,
                            responsive: true
                        });
                    }
                    else
                    {
                        console.log('Error: No data to draw.');
                    }
                }
            
                var url = 'https://connect.faun.fr/api/public';
                $.ajax({
                    type: 'POST',
                    url: url+'/measure_type',
                    dataType: 'json',
                    data: {},
                    headers: {
                        "faun-token":token
                    },
                    success: function(resultat){
                        afficheMeasures(resultat);
                    },
                    error: function(err){
                        console.log(err);
                    }
                });
                function afficheMeasures(json){
                    if(json != 0)
                    {
                        $('#tr-measures').remove();
                        $.each(json, function(index, element){
                            $('#tbody-measures').append('<tr id="tr-measures"><td class="trn">'+element.name+'</td><td class="trn">'+element.unit+'</td><td class="trn">'+element.id+'</td></tr>');
                        });
                        $('#MeasureTable').DataTable({
                            "pageLength": 10,
                            responsive: true
                        });
                    }
                    else
                    {
                        console.log('Error: No data to draw.');
                    }
                }

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