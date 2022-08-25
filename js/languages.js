// $(function() {}); is aquivalent to $(document).ready(function() {}); and means 'when dom is ready'
$(function(){

    var dict = {
        "index.Menu": {
          fr: "Menu",
          en: "Menu"
        },
        "button.Home": {
            fr: "Accueil",
            en: "Home"
        },
        "button.Details": {
          fr: "Détails",
          en: "Details"
        },
        "button.Back": {
          fr: "Retour",
          en: "Back"
        },
        "button.Close": {
          fr: "Fermer",
          en: "Close"
        },
        "French": {
            fr: "Français",
            en: "French"
        },
        "English": {
            fr: "Anglais",
            en: "English"
        },
        "Dashboard": {
            fr: "Tableau de bord",
            en: "Dashboard"
        },
        "maintenance": {
            fr: "Maintenance",
            en: "Maintenance"
        },
        "Trucks position": {
            fr: "La dernière position des bennes",
            en: "Trucks position"
        },
        "truck.Info": {
            fr: "Cliquer sur le marqueur pour accéder à la géolocalisation",
            en: "Click on the marker to access geolocation service"
        },
        "vehicle.Pool": {
            fr: "Flotte de véhicules",
            en: "Vehicle Fleet"
        },
        "analyze.Data": {
            fr: "Analyse des données",
            en: "Data Analysis"
        },
        "is.Online": {
            fr: "est en ligne",
            en: "is online"
        },
        "is.Offline": {
            fr: "est hors-ligne",
            en: "is offline"
        },
        "online.Trucks": {
            fr: "Camions en-ligne",
            en: "Online trucks"
        },
          "online.Trucks.Detail": {
            fr: "Détail des camions",
            en: "Truck details"
        },
        "last.Com": {
            fr: "Dernières communications",
            en: "Last communications"
        },
        "last.Com.Detail": {
            fr: "Détail des dernières communications",
            en: "Last communication details"
        },
        "available.Trucks": {
            fr: "Camions en-ligne",
            en: "Available trucks"
        },
        "unavailable.Trucks": {
            fr: "Camions hors-ligne",
            en: "Offline trucks"
        },
        "see.Collection": {
            fr: "Voir la collecte",
            en: "See collection tour"
        },
        "search.Truck": {
            fr: "Information véhicule",
            en: "Vehicle info"
        },
        "truck.Tracking": {
          fr: "Suivi GPS des camions",
          en: "Truck tracking"
        },
        "truck.Data": {
          fr: "Données des camions",
          en: "Truck data"
        },
        "select.Timestamp": {
          fr: "Sélection de la plage de données",
          en: "Select data time range"
        },
        "start.Timestamp": {
          fr: "Date de début",
          en: "Start Timestamp"
        },
        "end.Timestamp": {
          fr: "Date de fin",
          en: "End Timestamp"
        },
        "button.Geolocate": {
          fr: "Localiser",
          en: "Geolocate"
        },
        "geolocation": {
          fr: "Géolocalisation",
          en: "Geolocation"
        },
        "3Dnavigation": {
          fr: "Navigation 3D",
          en: " 3D Navigation"
        },
        "search": {
          fr: "Rechercher",
          en: "Search"
        },
        "search.Vehicle": {
          fr: "Recherche d'un véhicule",
          en: "Search Vehicle"
        },
        "route": {
          fr: "Itinéraire",
          en: "Route"
        },
        "title.Statistics": {
          fr: "Statistiques",
          en: "Statistics"
        },
        "card.Today": {
          fr: "Aujourd'hui",
          en: "Today"
        },
        "card.LastDay": {
          fr: "Hier",
          en: "Yesterday"
        },
        "card.ThisWeek": {
          fr: "Cette semaine",
          en: "This Week"
        },
        "card.LastWeek": {
          fr: "Semaine dernière",
          en: "Last Week"
        },
        "card.LastMonth": {
          fr: "Mois dernier",
          en: "Last Month"
        },
        "card.Older": {
          fr: "Plus ancien",
          en: "Older"
        },
        "card.Distance": {
          fr: "Distance parcourue",
          en: "Total distance"
        },
        "card.Speed": {
          fr: "vitesse moyenne",
          en: "average speed"
        },
        "card.Max.Speed": {
          fr: "vitesse maximale",
          en: "maximum speed"
        },
        "card.Used.Fuel": {
          fr: "carburant consommé",
          en: "fuel used"
        },
        "card.Collect.Time": {
          fr: "Durée de collecte",
          en: "Collection time"
        },
        "card.Emptyied.Bins": {
          fr: "bacs levés",
          en: "emptyied bins"
        },
        "card.Altitude": {
          fr: "altitude moyenne",
          en: "average altitude"
        },
        "card.Time": {
          fr: "durée de collecte",
          en: "collect duration"
        },
        "popup.Truck": {
          fr: "Benne n°",
          en: "Truck n°"
        },
        "popup.TruckStatus": {
          fr: "Status",
          en: "Status"
        },
        "popup.Timestamp": {
          fr: "Date",
          en: "Date"
        },
        "popup.Speed": {
          fr: "Vitesse",
          en: "Speed"
        },
        "popup.Altitude": {
          fr: "Altitude",
          en: "Altitude"
        },
        "popup.Country": {
          fr: "Pays",
          en: "Country"
        },
        "popup.City": {
          fr: "Ville",
          en: "City"
        },
        "popup.Address": {
          fr: "Adresse",
          en: "Address"
        },
        "popup.EmptyingLocation": {
          fr: "Lieu de vidage",
          en: "Emptying Location"
        },
        "button.Logout": {
          fr: "Déconnexion",
          en: "Logout"
        },
        "Fleet": {
          fr: "Flotte de véhicule",
          en: "Truck fleet"
        },
        "tech.Data": {
          fr: "Données Techniques",
          en: "Technical Data"
        },
        "raw.Data": {
          fr: "Données Brutes",
          en: "Raw Data"
        },
        "data.Analysis": {
          fr: "Données Brutes",
          en: "Raw Data"
        },
        "modem.List": {
          fr: "Liste des modems",
          en: "Modem list"
        },
        "Modem": {
          fr: "Modem",
          en: "Modem"
        },
        "modem.ID": {
          fr: "Identifiant modem",
          en: "Modem identifier"
        },
        "modem.Serial.Number": {
          fr: "N° de série",
          en: "Serial Number"
        },
        "modem.BOM.Number": {
          fr: "N° de benne",
          en: "RCV Number"
        },
        "modem.Status": {
          fr: "Status",
          en: "Status"
        },
        "modem.Service.Date": {
          fr: "Date de mise en service",
          en: "Start date"
        },
        "modem.Info": {
          fr: "Information",
          en: "Information"
        },
        "modem.Version": {
          fr: "Version logicielle",
          en: "Software version"
        },
        "vehicle.BOM.Number": {
          fr: "N° de benne",
          en: "RCV Number"
        },
        "vehicle.Plate.Number": {
          fr: "N° d'immatriculation",
          en: "Plate Number"
        },
        "vehicle.Chassis.Number": {
          fr: "N° de chassis",
          en: "Chassis Number"
        },
        "vehicle.Park.Number": {
          fr: "N° de parc",
          en: "Park Number"
        },
        "vehicle.Software.Version": {
          fr: "Version",
          en: "Version"
        },
        "timestamp.Measure": {
          fr: "Timestamp",
          en: "Timestamp"
        },
        "name.Measure": {
          fr: "Nom",
          en: "Name"
        },
        "value.Measure": {
          fr: "Valeur",
          en: "Value"
        },
        "unit.Measure": {
          fr: "Unité",
          en: "Unit"
        },
        "type.Measure": {
          fr: "Type",
          en: "Type"
        },
        "type.of.Measure": {
          fr: "Type de mesure",
          en: "Measure type"
        },
        "data.Type": {
          fr: "Type de données",
          en: "Data type"
        },
        "hostname.Vpn": {
          fr: "Nom d'hôte",
          en: "Hostname"
        },
        "ip_address.Vpn": {
          fr: "Adresse IP",
          en: "IP Address"
        },
        "updated.Vpn": {
          fr: "Date d'enregistrement",
          en: "Register Date"
        },
        "ip.GeoIP": {
          fr: "Adresse IP",
          en: "IP Address"
        },
        "distance.Tab": {
          fr: "Distance",
          en: "Distance"
        },
        "indicator.Tab": {
          fr: "indicateurs",
          en: "indicators"
        },
        "data.Tab": {
          fr: "données",
          en: "data"
        },
        "rawData.Tab": {
          fr: "données brutes",
          en: "raw data"
        },
        "modems.Tab": {
          fr: "modems",
          en: "modems"
        },
        "vehicles.Tab": {
          fr: "véhicules",
          en: "vehicles"
        },
        "measures.Tab": {
          fr: "mesures",
          en: "measures"
        },
        "vpn.Tab": {
          fr: "VPN",
          en: "VPN"
        },
        "geoip.Tab": {
          fr: "Geo IP",
          en: "Geo IP"
        },
        "geoip.LocationFinder": {
          fr: "Localisation d'adresses IP",
          en: "Geolocate IP addresses"
        },
        "geoip.IPaddress": {
          fr: "Adresse IP",
          en: "IP addresse"
        },
        "geoip.CountryCode": {
          fr: "Indicatif",
          en: "Country Code"
        },
        "geoip.Country": {
          fr: "Pays",
          en: "Country"
        },
        "geoip.Region": {
          fr: "Région",
          en: "Region"
        },
        "geoip.City": {
          fr: "Ville",
          en: "City"
        },
        "geoip.Timezone": {
          fr: "Fuseau horaire",
          en: "Timezone"
        },
        "geoip.ZipCode": {
          fr: "Zip code",
          en: "Zip code"
        },
        "plot.Button": {
          fr: "Tracer",
          en: "Plot"
        },
        "select.Vehicle": {
          fr: "Véhicule",
          en: "Vehicle"
        },
        "error.Modal": {
          fr: "Erreur",
          en: "Error"
        },
        "error.noData": {
          fr: "Aucune données pour cette période.",
          en: "No data to show."
        },
        "modal.Info": {
          fr: "Information",
          en: "Information"
        },
        "modal.NoVehicle": {
          fr: "Aucun véhicule trouvé.",
          en: "No vehicle found."
        },
        "data.Chart": {
          fr: "Graphique de données",
          en: "Data Chart"
        },
        "data": {
          fr: "Indicateurs",
          en: "Indicators"
        },
        "indicator": {
          fr: "Indicateur",
          en: "Indicator"
        },
        "summary.Tab": {
          fr: "résumé",
          en: "summary"
        },
        "today.Summary": {
          fr: "résumé du jour",
          en: "today summary"
        },
        "yesterday.Summary": {
          fr: "résumé d'hier",
          en: "yesterday summary"
        },
        "summary.Indicator": {
          fr: "résumé par journée",
          en: "day summary"
        },
        "total.Distance": {
          fr: "Distance parcourue",
          en: "Covered distance"
        },
        "total.Consumption": {
          fr: "Consommation de carburant",
          en: "Fuel consumption"
        },
        "average.Speed": {
          fr: "Vitesse moyenne",
          en: "Average speed"
        },
        "total.Distance.Indicator": {
          fr: "Distance Parcourue Aujourd'hui",
          en: "Today Total Distance"
        },
        "perf.Indicator": {
          fr: "indicateur de performance",
          en: "performance indicator"
        },
        "perf.Indicators": {
          fr: "indicateurs de performance",
          en: "performance indicators"
        },
        "perf.Indicator.Detail": {
          fr: "Détail des indicateure de performance",
          en: "Performance indicator details"
        },
        "trucks.Stats": {
          fr: "Statistiques des camions",
          en: "Truck statistics"
        },
        "trucks.Stats.Detail": {
          fr: "Détail des Statistiques des camions",
          en: "Truck statistics details"
        },
        "reset.Zoom": {
          fr: "Réinitialiser",
          en: "Reset zoom"
        },
        "user.Info": {
          fr: "Info utilisateur",
          en: "User info"
        },
        "report": {
          fr: "Rapport",
          en: "Report"
        },
        "calendar": {
          fr: "Calendrier",
          en: "Calendar"
        },
        "help": {
          fr: "Aide",
          en: "Help"
        },
        "settings": {
          fr: "Paramètres",
          en: "Settings"
        },
        "select.Affichage": {
          fr: "Affichage",
          en: "Display"
        },
        "option.Raw": {
          fr: "Brut",
          en: "raw"
        },
        "option.Minute": {
          fr: "Minute",
          en: "minute"
        },
        "option.Hour": {
          fr: "Heure",
          en: "hour"
        },
        "option.Day": {
          fr: "Jour",
          en: "day"
        },
        "option.Week": {
          fr: "Semaine",
          en: "week"
        },
        "option.Month": {
          fr: "Mois",
          en: "month"
        },
        "option.Compaction": {
          fr: "Compaction",
          en: "Compaction"
        },
        "option.Bin": {
          fr: "Bacs",
          en: "Bin"
        },
        "option.Through": {
          fr: "Vidage",
          en: "Through"
        },
        "option.Load": {
          fr: "Charge",
          en: "Load"
        },
        "option.Vehicle": {
          fr: "Véhicule",
          en: "Vehicle"
        },
        "option.All": {
          fr: "Tous",
          en: "All"
        },
        "emptied.Bin": {
          fr: "Bacs levés",
          en: "Emptyied bins"
        },
        "lifter.Cycle": {
          fr: "Cycles basculeur",
          en: "Lifter cycles"
        },
        "estimate.Indicator": {
          fr: "Estimation",
          en: "Assessment"
        },
        "faun.plus.Login": {
          fr: "FAUN PLUS",
          en: "Faun Plus"
        },
        "remember.Me": {
          fr: "Se souvenir de moi",
          en: "Remember me"
        },
        "forgot.Password": {
          fr: "Mot de passe oublié ?",
          en: "Forgot password?"
        },
        "recover.Now": {
          fr: "Récupérer ici",
          en: "Recover now"
        },
        "no.Account": {
          fr: "Pas encore de compte ?",
          en: "Don't have an account?"
        },
        "sign.up.Now": {
          fr: "Créer un compte",
          en: "Sign up now"
        },
        "login.Now": {
          fr: "Se connecter",
          en: "Login here"
        },
        "form.Register": {
          fr: "Créer un compte Faun Plus",
          en: "Register to Faun Plus"
        },
        "fill.Email": {
          fr: "Renseigner une adresse email",
          en: "Please fill your email address"
        },
        "fill.Password": {
          fr: "Renseigner un mot de passe",
          en: "Please fill your password"
        },
        "no.match.Password": {
          fr: "Les mots de passe sont différents",
          en: "Passwords do not match"
        },
        "invalid.Credentials": {
          fr: "Identifiants invalides",
          en: "Invalid credentials"
        },
        "copyright.Faun": {
          fr: "© 2019 Faun-Environnement. Tous droits réservés.",
          en: "© 2019 Faun-Environnement. All rights reserved."
        },
        "already.Registered": {
          fr: "Déjà enregistré ?",
          en: "Already registered?"
        },
        "electrical.Vehicle": {
          fr: "Véhicule électrique",
          en: "Electrical vehicle",
        },
        "supervision.Tab": {
          fr: "supervision",
          en: "monitoring",
        },
        "exploitation.Tab": {
          fr: "exploitation",
          en: "operation",
        },
        "maintenance.Tab": {
          fr: "maintenance",
          en: "maintenance",
        },
        "calendar.Tab": {
          fr: "calendrier",
          en: "calendar",
        },
        "search.Advanced": {
          fr: "Recherche avancée",
          en: "Advanced search"
        },
        "search.Tour": {
          fr: "Information de la tournée",
          en: "Tour info"
        },
        "search.rcvNumber": {
          fr: "Numéro de benne",
          en: "RCV number"
        },
        "search.PlateNumber": {
          fr: "Immatriculation",
          en: "Plate number"
        },
        "search.ChassisNumber": {
          fr: "Numéro de chassis",
          en: "Chassis number"
        },
        "search.ParkNumber": {
          fr: "Numéro de parc",
          en: "Park number"
        },
        "search.vehicleStatus": {
          fr: "Status du véhicule",
          en: "Vehicle status"
        },
        "search.driverName": {
          fr: "Chauffeur",
          en: "Driver"
        },
        "search.lastCollect": {
          fr: "Dernière tournée",
          en: "Last collection tour"
        },
        "tour.Identifier": {
          fr: "Identifiant de la tournée",
          en: "Tour identifier"
        },
        "display.EmptyingPlace": {
          fr: "Afficher les lieux de vidage",
          en: "Display emptying place"
        },
        "collection.Tour": {
          fr: "Parcours de collecte",
          en: "Collecion Tour"
        },
        "dev.Pending": {
          fr: "Disponible prochainement",
          en: "Coming soon"
        },
        "manageSettingsModal.Title": {
          fr: "Gérer les paramètres",
          en: "Manage settings"
        },
        "addEventModal.Text": {
          fr: "Ajouter un évènement",
          en: "Add event"
        },
        "addEventModal.Mandatory": {
          fr: "Obligatoire",
          en: "Mandatory"
        },
        "addEventModal.InvalidDate": {
          fr: "Date Invalide. Format: YYYY-MM-DD HH:mm",
          en: "Invalid date. Format: YYYY-MM-DD HH:mm"
        },
        "addEventModal.Title": {
          fr: "Titre",
          en: "Title"
        },
        "addEventModal.Add": {
          fr: "Ajouter",
          en: "Add"
        },
        "addEventModal.Cancel": {
          fr: "Annuler",
          en: "Cancel"
        },
        "addEventModal.Exit": {
          fr: "Quitter",
          en: "Exit"
        },
        "addEventModal.Date": {
          fr: "Date",
          en: "Date"
        },
        "addEventModal.StartDate": {
          fr: "Date de début",
          en: "Start date"
        },
        "addEventModal.EndDate": {
          fr: "Date de fin",
          en: "End date"
        },
        "addEventModal.Message": {
          fr: "Contenu",
          en: "Content"
        },
        "addEventModal.addEventModalAllDay": {
          fr: "Toute la journée",
          en: "All day event"
        },
        "addEventModal.Success": {
          fr: "Evènement ajouté",
          en: "Event added"
        },
        "addEventModal.searchVehicle": {
          fr: "Véhicule",
          en: "Vehicle"
        },
        "addEmailModal.Title": {
          fr: "Ajouter un email",
          en: "Add email"
        },
        "addEmailModal.Recipient": {
          fr: "Destinataire",
          en: "Recipient"
        },
        "addEmailModal.Message": {
          fr: "Contenu",
          en: "Content"
        },
        "addEmailModal.ActivateGroup": {
          fr: "Activer pour tous les véhicules",
          en: "Activate for whole vehicle pool"
        },
        "manageCalendar.Title": {
          fr: "Gérer le calendrier",
          en: "Manage calendar"
        },
        "selectTruck.Text": {
          fr: "Sélectionner les véhicules",
          en: "Select vehicles"
        },
        "modifyEventModal.Text": {
          fr: "Modifier",
          en: "Modify"
        },
        "modifyEventModal.modifyEventModalAllDay": {
          fr: "Toute la journée",
          en: "All day event"
        },
        "modifyEventModal.searchVehicle": {
          fr: "Véhicule",
          en: "Vehicle"
        },
        "modifyEventModal.Title": {
          fr: "Titre",
          en: "Title"
        },
        "modifyEventModal.StartDate": {
          fr: "Date de début",
          en: "Start date"
        },
        "modifyEventModal.EndDate": {
          fr: "Date de fin",
          en: "End date"
        },
        "modifyEventModal.Message": {
          fr: "Contenu",
          en: "Content"
        },
        "modifyEventModal.Cancel": {
          fr: "Annuler",
          en: "Cancel"
        },
        "modifyEventModal.Delete": {
          fr: "Supprimer",
          en: "Delete"
        },
        "modifyEventModal.Modify": {
          fr: "Modifier",
          en: "Modify"
        },
        "all.Vehicles": {
          fr: "Tous les véhicules",
          en: "All vehicles"
        },
        "last.Message" : {
          fr: "Dernière communication",
          en: "Last com"
        },
        "manageEvent.Text" : {
          fr: "Gestion de l'évènement",
          en: "Event management"
        },
        "acknowledgeEventModal.Text" : {
          fr: "Acquitter",
          en: "Acknowledge"
        },
        "acknowledgeEventModal.searchVehicle": {
          fr: "Véhicule",
          en: "Vehicle"
        },
        "acknowledgeEventModal.Title": {
          fr: "Titre",
          en: "Title"
        },
        "acknowledgeEventModal.StartDate": {
          fr: "Date de début",
          en: "Start date"
        },
        "acknowledgeEventModal.EndDate": {
          fr: "Date de fin",
          en: "End date"
        },
        "acknowledgeEventModal.AckDate": {
          fr: "Date d'acquittement",
          en: "Acknowledge date"
        },
        "acknowledgeEventModal.Message": {
          fr: "Contenu",
          en: "Content"
        },
        "acknowledgeEventModal.Comment": {
          fr: "Commentaire",
          en: "Comment"
        },
        "acknowledgeEventModal.Cancel": {
          fr: "Annuler",
          en: "Cancel"
        },
        "acknowledgeEventModal.Acknowledge": {
          fr: "Acquitter",
          en: "Acknowledge"
        },
        "addEventModal.eventType": {
          fr: "Type",
          en: "Type"
        },
        "modifyEventModal.eventType": {
          fr: "Type",
          en: "Type"
        },
        "acknowledgeEventModal.eventType": {
          fr: "Type",
          en: "Type"
        },
        "disconnect.ModalTitle": {
          fr: "Erreur",
          en: "Error"
        },
        "disconnect.ModalContent": {
          fr: "Session expirée. Veuillez vous reconnecter.",
          en: "Expired token. Please login again."
        }
      };

    var lang = localStorage.language || "fr";
    localStorage.language = lang;

    var translator = $('body').translate({lang: lang, t: dict});

    $('.change_language').click(function(event){
        event.preventDefault();
        var lang = $(this).attr('faun-lang');
        translator.lang(lang);
        localStorage.language = lang;
        moment.locale(localStorage.language);
    });

    // Traduction au clic des boutons details des card flip de la page index
    $('#btn-flip-to-back-last-com, #btn-flip-to-back-available-trucks, #divTruckPosition, #geoip-div').click(function(event){
        var lang = localStorage.language || "fr";
        translator.lang(lang);
        localStorage.language = lang;
        moment.locale(localStorage.language);
    });

    $(document).bind('traduction', function(event) {
        event.preventDefault();
        var lang = localStorage.language || "fr";
        translator.lang(lang);
    });

    $.refreshTranslation = function(event){
        event.preventDefault();
        translator.lang(localStorage.language);
    }
});