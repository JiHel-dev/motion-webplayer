// Module des fonctions de tracking
// Namespace: FaunTrackingModule
var url = 'https://connect.faun.fr/api/public';
var total_distance = 0;
var mapControl = new L.control;
var polyline = [];
var stopMarkerGroup = [];
var FaunTrackingModule = {

    // A props du module
    version: 1.2,
    description: 'Main module which contains tracking functions',

    // Sous namespace des fonctions d'initialisation
    init: {
        map: function () {
            $('#truck_card').remove();
            $('#divMap').append('<div id="truck_card"></div>');
            var lat = 44.927391;
            var lon = 4.862353;
            macarte = L.map('truck_card').setView([lat,lon], 5);
            macarte.on('popupopen', function(e) {
                $('#truck_card').trigger('traduction');
            });
            var defaultLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                // Il est toujours bien de laisser le lien vers la source des données
                attribution: 'Powered by © <a href="//osm.org/copyright">OpenStreetMap</a>',
                minZoom: 2,
                maxZoom: 18
            }).addTo(macarte);
            // Vue satellite et rues
            var satelliteLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibXJyb2JvdDA3IiwiYSI6ImNqeTl1OTltcDA3ZXozbHA3b2pvZzZoeGwifQ.Gi723sodVpuMeEMtZUGfqQ', {
                // Il est toujours bien de laisser le lien vers la source des données
                attribution: 'Powered by © <a href="//www.mapbox.com/copyright">Mapbox</a>',
                minZoom: 2,
                maxZoom: 18
            });
            // Vue noir et blanc
            var darkLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibXJyb2JvdDA3IiwiYSI6ImNqeTl1OTltcDA3ZXozbHA3b2pvZzZoeGwifQ.Gi723sodVpuMeEMtZUGfqQ', {
                // Il est toujours bien de laisser le lien vers la source des données
                attribution: 'Powered by © <a href="//www.mapbox.com/copyright">Mapbox</a>',
                minZoom: 2,
                maxZoom: 18
            });
            // Layer fond de carte
            var layerMap = {
                "Vue par défaut": defaultLayer, 
                "Vue satellite": satelliteLayer,
                "Vue noir et blanc": darkLayer
            }
            // Ajout du control de carte
            mapControl = L.control.layers(layerMap).addTo(macarte);
            // Ajout de l'icone fullscreen a la carte
            macarte.addControl(new L.Control.Fullscreen());
            // Ajout de l'echelle a la carte
            L.control.scale({imperial: false}).addTo(macarte);
            // Ajout du bouton custom
            // L.control.custom({
            //     position: 'topright',
            //     content : '<button type="button" class="btn btn-light btn-faun-fab trn custom-leaflet-btn" data-container="body" data-toggle="tooltip" title="Afficher/Masquer les lieux de vidage" data-placement="left">'+
            //                 '    <i class="fa fa-recycle"></i>'+
            //                 '</button>',
            //     classes : 'btn-group-vertical btn-group-sm',
            //     style   :
            //     {
            //         margin: '10px',
            //         padding: '0px 0 0 0',
            //         cursor: 'pointer',
            //     },
            //     datas   :
            //     {
            //         'foo': 'bar',
            //     },
            //     events:
            //     {
            //         click: function(data)
            //         {
            //             FaunTrackingModule.set.emptyingPlaceLayer();
            //         }
            //     }
            // }).addTo(macarte);
        }
    },

    // Sous namespace des fonctions de collecte d'information
    get: {
        // Recuperation du parcours de la benne
        truckPath: function (start_timestamp, end_timestamp, selected_vehicle_id) {
            // Calcul de distance
            L.Polyline = L.Polyline.include({
                getDistance: function() {
                    // distance in meters
                    var mDistanse = 0,
                        length = this._latlngs.length;
                    for (var i = 3; i < length; i+=3) {
                        mDistanse += this._latlngs[i].distanceTo(this._latlngs[i - 3]);
                    }
                    return mDistanse / 1000;
                }
            });
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
            $.ajax({
                type:'POST',
                headers: {
                    "faun-token":token
                },
                data: {timezone: localStorage.timezone, start_timestamp: start_timestamp, end_timestamp: end_timestamp},
                url:url+'/geolocations/'+selected_vehicle_id,
                dataType:'json',
                success:function(result){
                    displayTruckPath(result);
                },
                error: function(err){
                    alert(err.responseJSON.msg);
                    console.log(err);
                }
            });
            function displayTruckPath(json){
                var distance = 0;
                var average_speed = 0;
                var average_altitude = 0;
                var tab = [];
                var pointInfo = [];
                var pathData = [];
                // Ajout du groupe trajet
                polylineGroup = L.layerGroup();
                polylineGroup.id = 'vehiclePath';
                // Ajout du groupe de marqueurs des arrets du vehicule
                stopMarkerGroup = L.layerGroup();
                stopMarkerGroup.id = 'stopMarkers';
                if(json != 0)
                {
                    var sum = 0;
                    // RCV number
                    rcv = json[0].rcv_number;
                    $.each(json, function(index, vehicule_info){
                        sum += parseInt(vehicule_info.speed, 10);
                        // index 0 est la mesure la plus recente
                        if(index==0){
                            var marker = L.marker([vehicule_info.latitude, vehicule_info.longitude], {icon: blueMarker});
                            marker.id = 'startMarker';
                            marker.addTo(polylineGroup);
                            var html = "<p><ins><b class='trn'>popup.Truck</b><b>"+vehicule_info.rcv_number+"</b></ins></br><span class='trn'>popup.Timestamp</span>: "+vehicule_info.timestamp+"</br><span class='trn'>popup.Speed</span>: "+Math.round(vehicule_info.speed)+" km/h</br><span class='trn'>popup.Altitude</span>: "+vehicule_info.altitude+" m</br></p>"
                            marker.bindPopup(html);
                        }
                        if(index == json.length-1){
                            var marker = L.marker([vehicule_info.latitude, vehicule_info.longitude], {icon: redMarker});
                            marker.id = 'endMarker';
                            marker.addTo(polylineGroup);
                            var html = "<p><ins><b class='trn'>popup.Truck</b><b>"+vehicule_info.rcv_number+"</b></ins></br><span class='trn'>popup.Timestamp</span>: "+vehicule_info.timestamp+"</br><span class='trn'>popup.Speed</span>: "+Math.round(vehicule_info.speed)+" km/h</br><span class='trn'>popup.Altitude</span>: "+vehicule_info.altitude+" m</br></p>";
                            marker.bindPopup(html);
                        }
                        tab.push([vehicule_info.latitude, vehicule_info.longitude]);
                        // Cree un tableau contenant les donnees utiles du trace GPS
                        pointInfo.push([vehicule_info.latitude, vehicule_info.longitude, vehicule_info.timestamp, vehicule_info.rcv_number, Math.round(vehicule_info.speed), vehicule_info.altitude]);
                        if(vehicule_info.speed < 1)
                        {
                            // pathData_stop.push([vehicule_info.latitude, vehicule_info.longitude]);
                            var stop_points = L.circle(
                                [vehicule_info.latitude, vehicule_info.longitude],
                                {
                                    radius: 5,
                                    fillColor: "#ff7800",
                                    color: "#000",
                                    weight: 1,
                                    opacity: 1,
                                    fillOpacity: 0.8
                                }
                            ).addTo(stopMarkerGroup);
                        }
                        else
                        {
                            // pathData.push([vehicule_info.latitude, vehicule_info.longitude]);
                        }
                        // pathData.push({
                        //     timestamp: vehicule_info.timestamp,
                        //     latitude: vehicule_info.latitude, 
                        //     longitude: vehicule_info.longitude,
                        //     altitude: vehicule_info.altitude,
                        //     speed: vehicule_info.speed
                        // })
                    });
                    // Ajoute le tableau de donnees du trace GPS au localstorage
                    localStorage.pathData = JSON.stringify(pathData);
                    // Cree la polyline avec l'ensemble des donnees de geoloc
                    polyline = L.polyline(tab, {color: '#990099', weight: 5});
                    polyline.addTo(polylineGroup);
                    // Affiche par défaut le trajet sur la carte
                    polylineGroup.addTo(macarte);
                    mapControl.addOverlay(polylineGroup, 'Trajet');
                    // Ajout du groupe des marqueurs arret vehicule
                    mapControl.addOverlay(stopMarkerGroup, 'Arrêts véhicule');
                    // Cree un groupe qui va contenir les marqueurs inseres par l'utilisateur
                    var dragMarkerGroup = L.layerGroup().addTo(macarte);
                    // Ajout de la fonction drag
                    polyline.on('click', function addMarker(e) {
                        // Supprime le marqueur ajoute precedemment par l'utilisateur 
                        dragMarkerGroup.clearLayers();
                        // Detecte les coordonnees du clic utilisateur sur la carte
                        var x = e.layerPoint.x;
                        var y = e.layerPoint.y;
                        var pointXY = L.point(x, y);
                        var pointlatlng = macarte.layerPointToLatLng(pointXY);
                        // Cree un marqueur a ces coordonnees
                        var snapMarker = L.marker(pointlatlng, {
                                        draggable: true,
                                        autoPan: true,
                                        autoPanPadding: L.point(50,50)
                        });
                        snapMarker.id = 'movingMarker';
                        // A partir du point clique par l'utilisateur, on detecte les coordonnees du point le plus proche sur la polyline 
                        var closestPointToModemData = L.GeometryUtil.closest(macarte, tab, pointlatlng, true);
                        // Positionne le marqueur aux coordonnees du point le plus proche sur la polyline
                        snapMarker.setLatLng(closestPointToModemData);
                        // Ajoute le marqueur a la carte
                        snapMarker.addTo(macarte);
                        // Ajoute le marqueur au groupe des marqueurs utilisateurs (pour suppression au prochain clic sur la polyline)
                        snapMarker.addTo(dragMarkerGroup);
                        // Affiche par defaut les coordonnees du marqueur
                        var coordinates = snapMarker.getLatLng();
                        // Arrondit les coordonnees GPS du nouveau marqueur a 6 chiffres apres la virgule
                        var polylineCoordinatesLat = (Math.trunc(coordinates.lat * 1000000)/1000000).toFixed(6);
                        var polylineCoordinatesLng = (Math.trunc(coordinates.lng * 1000000)/1000000).toFixed(6);
                        // Determine les infos utiles du marqueur (vitesse, date, altitude...) et met a jour le contenu du popup
                        for (var i = 0; i < pointInfo.length; i++) {
                            var lat = (Math.trunc(pointInfo[i][0] * 1000000)/1000000).toFixed(6);
                            var lng = (Math.trunc(pointInfo[i][1] * 1000000)/1000000).toFixed(6);
                            if (lat === polylineCoordinatesLat && lng === polylineCoordinatesLng) { 
                                var content = "<p><ins><b class='trn'>popup.Truck</b><b>"+pointInfo[i][3]+"</b></ins><br>Date: " + pointInfo[i][2] +
                                "<br><span class='trn'>popup.Speed</span>: " + pointInfo[i][4] + " km/h" + 
                                "<br><span class='trn'>popup.Altitude</span>: " + pointInfo[i][5] + " m</p>";
                                snapMarker.bindPopup(content);
                            }
                        }
                        // Met a jour le marqueur lorsque l'utilisateur le deplace sur la carte
                        snapMarker.on('drag', function(event){
                            var newCoordinates = snapMarker.getLatLng();
                            var closestPointToPolyline = L.GeometryUtil.closest(macarte, tab, newCoordinates, true);
                            snapMarker.setLatLng(closestPointToPolyline);
                            var newCoordinates2 = snapMarker.getLatLng();
                            var polylineCoordinatesLat = (Math.trunc(newCoordinates2.lat * 1000000)/1000000).toFixed(6);
                            var polylineCoordinatesLng = (Math.trunc(newCoordinates2.lng * 1000000)/1000000).toFixed(6);
                            // Verifie si un point de donnees existe sur la trajet du marker et recupere les infos de ce point (vitesse, altitude...)
                            for (var i = 0; i < pointInfo.length; i++) {
                                var lat = (Math.trunc(pointInfo[i][0] * 1000000)/1000000).toFixed(6);
                                var lng = (Math.trunc(pointInfo[i][1] * 1000000)/1000000).toFixed(6);
                                if (lat === polylineCoordinatesLat && lng === polylineCoordinatesLng) {
                                    var returnIntersection = false;
                                    var distance = "20";
                                    var format = "json";
                                    $.ajax({
                                        type:'GET',
                                        headers: {
                                            'Accept': '*/*'
                                        },
                                        url:"https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?"+
                                            "outSR=4326"+
                                            "&returnIntersection="+returnIntersection+
                                            "&location="+polylineCoordinatesLng+"%2C"+polylineCoordinatesLat+
                                            "&distance="+distance+
                                            "&f="+format,
                                        context: this,
                                        success:function(result){
                                            localStorage.address = result.address.Match_addr;
                                            console.log('live address: ', localStorage.address);
                                        },
                                        error: function(err){
                                            console.log(err);
                                        }
                                    });
                                    var content = "<p><ins><b class='trn'>popup.Truck</b><b>"+pointInfo[i][3]+"</b></ins><br>Date: " + pointInfo[i][2] +
                                                "<br><span class='trn'>popup.Speed</span>: " + pointInfo[i][4] + " km/h" + 
                                                "<br><span class='trn'>popup.Altitude</span>: " + pointInfo[i][5] + " m" + 
                                                "<br><span class='trn'>popup.Address</span>: " + localStorage.address + 
                                                "</p>";
                                    snapMarker.bindPopup(content);
                                }
                            }
                        });
                        // Supprime le marqueur au double clic dessus
                        snapMarker.on('dblclick', function(event){
                            snapMarker.removeFrom(macarte);
                        });
                    });
                    // Zooom la carte sur le trace GPS (polyline)
                    macarte.fitBounds(polyline.getBounds());
                    // Calcule la distance totale du trace
                    distance = polyline.getDistance();
                    // Calcule la vitesse moyenne totale sur le trace
                    average_speed = sum/(json.length);
                    // Affiche le nombre de points du trace GPS
                    console.log('Number of GPS points:',json.length);
                    // Affiche les resultats dans les indicateurs
                    $('#card-distance').append('<div id="card-distance-value" class="card-body trn">'+distance.toFixed(2)+' km</div>');
                    $('#card-speed').append('<div id="card-speed-value" class="card-body trn">'+average_speed.toFixed(2)+' km/h</div>');
                    $('#card-altitude').append('<div id="card-altitude-value" class="card-body trn">'+average_altitude.toFixed(2)+' m</div>');
                    console.log('Distance', distance);
                    console.log('Average speed: ', average_speed);
                    console.log('Average altitude', average_altitude);
                }
                else
                {
                    alert('No data to draw!');
                }
            }
        },
        totalDistance: function (start_timestamp, end_timestamp, selected_vehicle_id) {
            // Affiche la distance parcourue pour le journee en cours
            $('#total_distance_indic').remove();
            $.ajax({
                type: 'POST',
                url: url+'/vehicle_total_distance_indic/'+selected_vehicle_id,
                dataType: 'json',
                data: {timezone: localStorage.timezone, aggregation: 'hour', start_timestamp: start_timestamp, end_timestamp: end_timestamp},
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
                total_distance = 0;
                if(resultat != 0)
                {
                    total_distance = resultat.Vehicle_total_distance;
                    $('#total_distance_div').append('<span id="total_distance_indic"><h5>'+total_distance+' km</h5></span>');
                }
                else
                {
                    console.log('No data to draw.');
                }
            }
        },
        // Affiche la vitesse maximale du trajet selectionne
        maxSpeed: function(start_timestamp, end_timestamp, selected_vehicle_id) {
            $('#max_speed_indic').remove();
            $.ajax({
                type: 'POST',
                url: url+'/max_speed_indic/'+selected_vehicle_id,
                dataType: 'json',
                data: {timezone: localStorage.timezone, aggregation: 'hour', start_timestamp: start_timestamp, end_timestamp: end_timestamp},
                headers: {
                    "faun-token":token
                },
                success: function(resultat){
                    maxSpeedTruck(resultat);
                },
                error: function(err){
                    console.log(err);
                }
            });
            function maxSpeedTruck(json){
                var max_speed = 0;
                if(json != 0)
                {
                    max_speed = json.Max_speed_hour;
                    $('#max_speed_div').append('<span id="max_speed_indic"><h5>'+max_speed+' km/h</h5></span>');
                }
                else
                {
                    console.log('No data to draw.');
                }
            }
        },
        // Affiche la vitesse moyenne du trajet selectionne
        averageSpeed: function(start_timestamp, end_timestamp, selected_vehicle_id){
            $('#average_speed_indic').remove();
            $.ajax({
                type: 'POST',
                url: url+'/average_speed_indic/'+selected_vehicle_id,
                dataType: 'json',
                data: {timezone: localStorage.timezone, aggregation: 'hour', start_timestamp: start_timestamp, end_timestamp: end_timestamp},
                headers: {
                    "faun-token":token
                },
                success: function(resultat){
                    averageSpeedTruck(resultat);
                },
                error: function(err){
                    console.log(err);
                }
            });
            function averageSpeedTruck(json){
                var average_speed = 0;
                if(json != 0)
                {
                    average_speed = json.Average_speed_hour;
                    $('#average_speed_div').append('<span id="average_speed_indic"><h5>'+average_speed+' km/h</h5></span>');
                }
                else
                {
                    console.log('No data to draw.');
                }
            }
        },
        emptyiedBins: function(start_timestamp, end_timestamp, selected_vehicle_id) {
            $('#emptyied_bins_indic').remove();
            $.ajax({
                type: 'POST',
                url: url+'/emptied_bin_indic/'+selected_vehicle_id,
                dataType: 'json',
                data: {timezone: localStorage.timezone, aggregation: 'hour', start_timestamp: start_timestamp, end_timestamp: end_timestamp},
                headers: {
                    "faun-token":token
                },
                success: function(resultat){
                    emptyiedBinsTruck(resultat);
                },
                error: function(err){
                    console.log(err);
                }
            });
            function emptyiedBinsTruck(json){
                if(json != 0)
                {
                    var nb_emptied_bins = 0;
                    nb_emptied_bins += json.Left_Emptied_bins + json.Right_Emptied_bins
                                    + json.Middle_Emptied_bins + json.Large_Emptied_bins;
                    $('#emptyied_bins_div').append('<span id="emptyied_bins_indic"><h5>'+nb_emptied_bins+'</h5></span>');
                }
                else
                {
                    console.log('No data to draw.');
                }
            }
        },
        collectionTime: function(start_timestamp, end_timestamp, selected_vehicle_id) {
            $('#collection_time_indic').remove();
            $.ajax({
                type: 'POST',
                url: url+'/total_collect_time_indic/'+selected_vehicle_id,
                dataType: 'json',
                data: {timezone: localStorage.timezone, aggregation: 'hour', start_timestamp: start_timestamp, end_timestamp: end_timestamp},
                headers: {
                    "faun-token":token
                },
                success: function(resultat){
                    collectionTimeTruck(resultat);
                },
                error: function(err){
                    console.log(err);
                }
            });
            function collectionTimeTruck(json){
                var collection_time = 0;
                if(json != 0)
                {
                    var collection_time = 0;
                    var hours = 0;
                    var minutes = 0;
                    collection_time = json.Total_collect_time;
                    hours = Math.floor(collection_time / 60);
                    minutes = collection_time % 60;
                    $('#collection_time_div').append('<span id="collection_time_indic"><h5>'+hours+'h '+minutes+'m</h5></span>');
                }
                else
                {
                    console.log('No data to draw.');
                }
            }
        },
        usedFuel: function(start_timestamp, end_timestamp, selected_vehicle_id) {
            $('#used_fuel_indic').remove();
            // $.ajax({
            //     type: 'POST',
            //     url: url+'/used_fuel_indic/'+selected_vehicle_id,
            //     dataType: 'json',
            //     data: {timezone: localStorage.timezone, aggregation: 'hour', start_timestamp: start_timestamp, end_timestamp: end_timestamp},
            //     headers: {
            //         "faun-token":token
            //     },
            //     success: function(resultat){
            //         usedFuelTruck(resultat);
            //     },
            //     error: function(err){
            //         console.log(err);
            //     }
            // });
            // function usedFuelTruck(json){
            //     var used_fuel = 0;
            //     if(json != 0)
            //     {
            //         // used_fuel = json.Used_fuel;
            //         $('#used_fuel_div').append('<span id="used_fuel_indic"><h5>'+used_fuel+' L</h5></span>');
            //     }
            //     else
            //     {
            //         console.log('No data to draw.');
            //     }
            // }
            var conso_100 = 60;
            var distance = total_distance;
            var used_fuel = (distance * conso_100)/100;
            if(JSON.parse(localStorage.selectedVehicletab).name == "80621")
            {
                $('#used_fuel_div').append('<span id="used_fuel_indic"><p class="trn">electrical.Vehicle</p></span>');
            }
            else
            {
                $('#used_fuel_div').append('<span id="used_fuel_indic"><h5>'+used_fuel+' L</h5></span>');
            }
            $('#used_fuel_div').trigger('traduction');
        },
        emptyingPlace: function(start_timestamp, end_timestamp, selected_vehicle_id) {
            // Determiner et afficher le lieu de vidage
            $.ajax({
                type: 'POST',
                url: url+'/emptying_place/'+selected_vehicle_id,
                dataType: 'json',
                data: {timezone: localStorage.timezone, start_timestamp: start_timestamp, end_timestamp: end_timestamp},
                headers: {
                    "faun-token":token
                },
                success: function(resultat){
                    emptyingPlaceTruck(resultat);
                },
                error: function(err){
                    console.log(err);
                }
            });
            function emptyingPlaceTruck(json){;
                var emptyingPlaceMarker = L.AwesomeMarkers.icon({
                    icon: 'recycle',
                    prefix: 'fa',
                    markerColor: 'green'
                });
                if(json != 0)
                {
                    var emptyingPlaceMarkerCluster = L.markerClusterGroup({
                        maxClusterRadius: 10
                    });
                    emptyingPlaceMarkerCluster.id = 'emptyingPlaceMarkerCluster';
                    $.each(json, function(index, vehicule_info){
                        var marker = L.marker([vehicule_info.latitude, vehicule_info.longitude], {icon: emptyingPlaceMarker});
                        marker.id = 'emptyingPlaceMarker';
                        emptyingPlaceMarkerCluster.addLayer(marker);
                        var html = "<p><ins><b class='trn'>popup.EmptyingLocation</b></ins></br><span class='trn'>popup.Timestamp</span>: "+vehicule_info.timestamp+"</br><span class='trn'>popup.Speed</span>: "+Math.round(vehicule_info.speed)+" km/h</br><span class='trn'>popup.Altitude</span>: "+vehicule_info.altitude+" m</br></p>"
                        marker.bindPopup(html);
                    });
                    // macarte.addLayer(emptyingPlaceMarkerCluster);
                    mapControl.addOverlay(emptyingPlaceMarkerCluster, 'Lieux de vidage');
                }
                else
                {
                    console.log('No data to draw.');
                }
            }
        }
    }
}