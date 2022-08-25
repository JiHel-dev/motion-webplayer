// Module des fonctions utilitaires principales
// Namespace: FaunUtilityModule
var url = 'https://connect.faun.fr/api/public';
var FaunUtilityModule = {

    // A props du module
    version: 1.1,
    description: 'Main module which contains utility functions',

    // Sous namespace des fonctions de collecte d'information
    get: {
        // Detection de la Timezone du navigateur et stocke dans local storage
        timezone: function () {
            if(localStorage.timezone) {
                var timezone = localStorage.timezone;
            }
            else {
                var timezone = moment.tz.guess();
                localStorage.timezone = timezone;
            }
        },

        // Recupere les infos utilisateur
        userInfo: function () {
            var user = JSON.parse(localStorage.userInfo);
            if(user.pseudo == "") {
                $('#user-info').append('<span>'+user.firstname+'</span>');
            }
            else{
                $('#user-info').append('<span>'+user.pseudo+'</span>');
            }
            if(user.firstname != "" || user.lastname != "") {
                $('#details-user-info').append('<a id="email" class="dropdown-item" href="#"><i class="fas fa-user fa-fw"></i>&nbsp;<span>'+user.firstname+' '+user.lastname+'</span></a>');
            }
            if(user.company != "") {
                $('#details-user-info').append('<a id="email" class="dropdown-item" href="#"><i class="fas fa-home fa-fw"></i>&nbsp;<span>'+user.company+'</span></a>');
            }
            if(user.email != "") {
                $('#details-user-info').append('<a id="email" class="dropdown-item" href="#"><i class="fas fa-envelope fa-fw"></i>&nbsp;<span>'+user.email+'</span></a>');
            }
            if(user.phone != "") {
                $('#details-user-info').append('<a id="phone" class="dropdown-item" href="#"><i class="fas fa-phone fa-fw"></i>&nbsp;<span>'+user.phone+'</span></a>');
            }
        },

        // Recupere les droits de l'utilisateur et construit dynamiquement le site web
        displayNavigationDrawer: function () {
            var userRights = localStorage.userInfo;
            
        }
    },

    // Sous module de fonctions qui stockent des informations sur le poste client
    stock: {
        // Recupere la liste des vehicules authorises et les stocke dans local storage
        listAuthorizedVehicle: function (json) {
            if($.isEmptyObject(json))
            {
                console.log('Error: no data.');
            }
            else
            {
                $('.selectpicker').selectpicker({
                    iconBase: 'fa',
                    tickIcon: 'fa-check'
                });
                if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
                    $('.selectpicker').selectpicker('mobile');
                }                  
                if(localStorage.selectedVehicletab && localStorage.truckList) 
                {
                    // Stocker correspondance id - rcv_number
                    rcv_num_id = JSON.parse(localStorage.truckList);
                    $('#selectVehicleOptionIdx, \
                       #selectVehicleOption, \
                       #addEventCalendarModal_searchVehicleOption, \
                       #modifyEventCalendarModal_searchVehicleOption').remove();
                    $.each(rcv_num_id, function(index, element){
                        if(element != 0) {
                            // $('#selectVehicleIdx').append('<option>'+element.rcv_number+'</option>');
                            // $('#selectVehicle').append('<option>'+element.rcv_number+'</option>');
                            $("#selectVehicle, \
                               #selectVehicleIdx, \
                               #selectTruck, \
                               #addEventModal_searchVehicle, \
                               #addEventCalendarModal_searchVehicle, \
                               #modifyEventCalendarModal_searchVehicle, \
                               #acknowledgeEventCalendarModal_searchVehicle").append('<option data-icon="fa-truck" value="'+element.rcv_number+'" selected="">'+element.rcv_number+'</option>');
                        }
                    });
                    var selected_vehicle_name = JSON.parse(localStorage.selectedVehicletab).name;
                    // $("#selectVehicleIdx").val(selected_vehicle_name);
                    if(selected_vehicle_name != null) {
                        $('#selectVehicleIdx, \
                        #selectVehicle, \
                        #selectTruck, \
                        #addEventModal_searchVehicle, \
                        #addEventCalendarModal_searchVehicle, \
                        #modifyEventCalendarModal_searchVehicle, \
                        #acknowledgeEventCalendarModal_searchVehicle').selectpicker('val', selected_vehicle_name);
                        $("#selectVehicleIdx, \
                        #selectVehicle, \
                        #selectTruck, \
                        #addEventModal_searchVehicle, \
                        #addEventCalendarModal_searchVehicle, \
                        #modifyEventCalendarModal_searchVehicle, \
                        #acknowledgeEventCalendarModal_searchVehicle").selectpicker("refresh");
                        for (rcv_num_id.index = 0; rcv_num_id.index < rcv_num_id.length; rcv_num_id.index++) {
                            if(selected_vehicle_name==rcv_num_id[rcv_num_id.index].rcv_number) {
                                selected_vehicle_id = rcv_num_id[rcv_num_id.index].vehicle_id;
                                var last_collect = rcv_num_id[rcv_num_id.index].lastCollect;
                            }
                        }
                        localStorage.selectedVehicletab = JSON.stringify({name: selected_vehicle_name, id:selected_vehicle_id, lastCollect: last_collect});
                    }
                }
                else 
                {
                    $('#selectVehicleOptionIdx').remove();
                    $('#modifyEventCalendarModal_searchVehicleOption').remove();
                    var truckList = [];
                    $.each(json, function(index, element){
                        var newElement = {};
                        newElement.vehicle_id = element.vehicle_id;
                        newElement.rcv_number = element.rcv_number;
                        newElement.lastCollect = element.timestamp;
                        truckList.push(newElement);
                        // $('#selectVehicleIdx').append('<option>'+newElement.rcv_number+'</option>');
                        $("#selectVehicleIdx, \
                           #selectTruck, \
                           #addEventModal_searchVehicle, \
                           #addEventCalendarModal_searchVehicle, \
                           #modifyEventCalendarModal_searchVehicle, \
                           #acknowledgeEventCalendarModal_searchVehicle").append('<option data-icon="fa-truck" value="'+element.rcv_number+'" selected="">'+element.rcv_number+'</option>');
                    });
                    setTimeout(refresh,6000);
                    function refresh() {
                        $("#selectVehicleIdx, \
                       #addEventModal_searchVehicle, \
                       #addEventCalendarModal_searchVehicle, \
                       #modifyEventCalendarModal_searchVehicle, \
                       #acknowledgeEventCalendarModal_searchVehicle").selectpicker("refresh");
                        $("#selectTruck").selectpicker("render");
                        // Sotcke la liste des bennes dans le local storage dans l'objet truckList
                        localStorage.setItem('truckList', JSON.stringify(truckList));
                        var selected_vehicle_name = $("#selectVehicleIdx").val();
                        var rcv_num_id = JSON.parse(localStorage.truckList);
                        if(selected_vehicle_name != null && rcv_num_id != null) {
                            for (rcv_num_id.index = 0; rcv_num_id.index < rcv_num_id.length; rcv_num_id.index++) {
                                if(selected_vehicle_name==rcv_num_id[rcv_num_id.index].rcv_number) {
                                    selected_vehicle_id = rcv_num_id[rcv_num_id.index].vehicle_id;
                                    var last_collect = rcv_num_id[rcv_num_id.index].lastCollect;
                                }
                            }
                            localStorage.selectedVehicletab = JSON.stringify({name: selected_vehicle_name, id:selected_vehicle_id, lastCollect: last_collect});
                        }
                    }
                }
                $("#selectVehicleIdx, \
                   #addEventModal_searchVehicle, \
                   #addEventCalendarModal_searchVehicle, \
                   #modifyEventCalendarModal_searchVehicle, \
                   #acknowledgeEventCalendarModal_searchVehicle").selectpicker("render");
            }
        },

        // Recupere les infos utilisateur et stocke dans local storage
        userInfo: function(json) {
            if($.isEmptyObject(json))
            {
                console.log('Error: no data.');
            }
            else
            {
                $('#username').remove();
                $('#name').remove();
                $('#company').remove();
                $('#email').remove();
                $('#phone').remove();
                var userInfo = [];
                $.each(json, function(index, element){
                    var newElement = {};
                    newElement.id = element.id;
                    newElement.firstname = element.firstname;
                    newElement.lastname = element.lastname;
                    newElement.email = element.email;
                    newElement.company = element.company;
                    newElement.phone = element.phone;
                    newElement.pseudo = element.pseudo;
                    newElement.type = element.type;
                    userInfo.push(newElement);
                    localStorage.setItem('userInfo', JSON.stringify(newElement));
                    if(newElement.pseudo == "") {
                        $('#user-info').append('<span>'+newElement.firstname+'</span>');
                    }
                    else{
                        $('#user-info').append('<span>'+newElement.pseudo+'</span>');
                    }
                });
                var user = JSON.parse(localStorage.userInfo);
                if(user.firstname != "" || user.lastname != "") {
                    $('#details-user-info').append('<a id="email" class="dropdown-item" href="#"><i class="fas fa-user fa-fw"></i>&nbsp;<span>'+user.firstname+' '+user.lastname+'</span></a>');
                }
                if(user.company != "") {
                    $('#details-user-info').append('<a id="email" class="dropdown-item" href="#"><i class="fas fa-home fa-fw"></i>&nbsp;<span>'+user.company+'</span></a>');
                }
                if(user.email != "") {
                    $('#details-user-info').append('<a id="email" class="dropdown-item" href="#"><i class="fas fa-envelope fa-fw"></i>&nbsp;<span>'+user.email+'</span></a>');
                }
                if(user.phone != "") {
                    $('#details-user-info').append('<a id="phone" class="dropdown-item" href="#"><i class="fas fa-phone fa-fw"></i>&nbsp;<span>'+user.phone+'</span></a>');
                }
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
            }
        },

        listEvent: function (json) {
            if($.isEmptyObject(json))
            {
                console.log('Error: no data.');
            }
            else
            {
                var eventList = [];
                $.each(json, function(index, element){
                    var newElement = {};
                    newElement.vehicle_id = element.vehicle_id;
                    newElement.rcv_number = element.rcv_number;
                    newElement.lastCollect = element.timestamp;
                    eventList.push(newElement);
                    // $("#addEventModal_eventType").append('<option data-icon="fa-truck" value="'+element.rcv_number+'" selected="">'+element.rcv_number+'</option>');
                });
                $("#addEventModal_eventType, \
                   #modifyEventCalendarModal_eventType, \
                   #acknowledgeEventModal_eventType, \
                   #addEventCalendarModal_eventType").append('<option data-icon="fa fa-lock" value="Sécurité" selected="">Sécurité</option>');
                $("#addEventModal_eventType, \
                   #modifyEventCalendarModal_eventType, \
                   #acknowledgeEventModal_eventType, \
                   #addEventCalendarModal_eventType").append('<option data-icon="fa fa-wrench" value="Entretien périodique" selected="">Entretien périodique</option>');
                $("#addEventModal_eventType, \
                   #modifyEventCalendarModal_eventType, \
                   #acknowledgeEventModal_eventType, \
                   #addEventCalendarModal_eventType").append('<option data-icon="far fa-eye" value="Suivi structurel" selected="">Suivi structurel</option>');
                localStorage.setItem('eventList', JSON.stringify(eventList));
                setTimeout(refreshList,500);
                function refreshList() {
                    $("#addEventModal_eventType, \
                       #modifyEventCalendarModal_eventType, \
                       #acknowledgeEventModal_eventType, \
                       #addEventCalendarModal_eventType").selectpicker("refresh");
                }
            }
        }
    }

}