$(function(){
    console.log('Geo IP');
    $('#geoip_card').remove();
    $('#geoip-div').append('<div id="geoip_card"></div>');
    $('#tr-geoip').remove();
            
    // Récupération infos du l'utilisateur
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
            stockeUserInfo(resultat);
        },
        error: function(err){
            console.log(err);
        }
    });
    function stockeUserInfo(json){
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
            userInfo.push(newElement);
            // Sotcke la liste des bennes dans le local storage dans l'objet truckList
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
    }

    // Centrer la carte sur le 'centre du monde'
    var lat = 26.317310;
    var lon = 3.655904;

    var geoipMap = L.map('geoip_card', {
        center: [lat, lon],
        zoom: 2,
        dragging: true,
        worldCopyJump: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        // On laisse le lien vers la source des donnees
        attribution: 'Powered by © <a href="//osm.org/copyright">OpenStreetMap</a>',
        minZoom: 1,
        maxZoom: 15
    }).addTo(geoipMap);

    // Ajout de l'icone fullscreen a la carte
    geoipMap.addControl(new L.Control.Fullscreen());

    // L.marker([46.5418955, 2.2833633]).addTo(geoipMap)
    // .bindPopup('A test popup.<br> Easily customizable.')

    var url = "https://vpn.faun.com";
    var ip_addr = ["3.89.39.116", "185.53.88.19", 
                "167.250.8.6", "195.154.60.195", "88.235.218.168", 
                "201.76.127.39", "95.5.228.223", "70.112.168.4", 
                "93.9.64.198", "27.254.158.129", "218.250.162.232", 
                "154.211.14.28", "157.230.128.187", "209.17.97.82",
                "84.102.194.89", "86.60.195.5", "95.97.149.161", 
                "47.52.66.20", "103.48.168.250", "18.220.66.54",
                "200.66.75.13", "81.182.208.63", "14.102.6.134", 
                "202.66.164.135", "117.102.226.206", "191.19.63.210",
                "185.165.169.28", "178.73.215.171", "213.148.194.161", 
                "103.85.121.126", "45.71.228.7", "203.187.226.122", 
                "51.15.142.164", "170.78.3.100", "187.0.165.215",
                "80.82.70.118", "73.27.28.54", "159.203.169.16",
                "185.189.196.33", "195.154.60.195", "188.214.128.172",
                "191.114.36.33", "89.159.230.246", "5.154.106.123",
                "167.250.195.14", "198.108.66.128", "168.205.224.14",
                "177.138.187.227", "165.16.37.185", "91.109.194.182",
                "51.38.12.23", "45.7.118.50", "186.211.108.114", 
                "104.131.145.55", "3.85.4.81", "116.193.219.50",
                "103.12.161.245", "177.101.178.85", "92.184.101.123",
                "191.96.214.45"];
    var markerClusters = L.markerClusterGroup({
        maxClusterRadius: 80
    });   
    var tab = [];
    var isDataTableLoaded = 0;

    $.each(ip_addr, function(index, ip){
        $.ajax({
            type: 'POST',
            url: url+'/geoip',
            dataType: 'json',
            data :{ip_addr: ip},
            success: function(resultat){
                afficheIPaddr(resultat, ip);
            },
            error: function(err){
                console.log(err);
            }
        });
    });
    function afficheIPaddr(json, ipaddress) {
        if(json != 0) {
            $.each(json, function(index, element){
                // On cherche la derniere donnees de geolocalisation de chaque camion
                var html = "<b>Info<hr id='hr-data'><span class='trn'>popup.City</span> - &nbsp;"+element.city_name+"</b><br><b>IP&nbsp; - &nbsp;"+ipaddress+"</br>";
                $('#tbody-geoip').append('<tr id="tr-geoip"><td class="trn">'+ipaddress+'</td><td class="trn">'+element.country_code+'</td><td class="trn">'+element.country_name+'</td><td class="trn">'+element.city_name+'</td><td class="trn">'+element.time_zone+'</td></tr>');
                var marker = L.marker([element.latitude, element.longitude]);
                markerClusters.addLayer(marker);
                marker.bindPopup(html);
                tab.push(marker);
            });
        }
        geoipMap.addLayer(markerClusters);
        // geoipMap.fitBounds(markerClusters.getBounds());
    }
    $('a[href="#geoip"]').on('shown.bs.tab', function (e) {
        geoipMap.invalidateSize();
        
        if(!isDataTableLoaded) {
            $('#GeoIPTable').DataTable({
                responsive: true
            }).columns.adjust();
            isDataTableLoaded = 1;
        }
    }); 
});