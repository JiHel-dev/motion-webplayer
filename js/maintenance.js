$(window).on('load', function() {
  setTimeout(removeLoader, 200);
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
              FaunUtilityModule.stock.userInfo(resultat);
              FaunUtilityModule.get.timezone();
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
                  },
                  error: function(err){
                      console.log(err);
                  }
              });
          
              // Recupere la liste des type d'evenement
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
                      FaunUtilityModule.stock.listEvent(resultat);
                  },
                  error: function(err){
                      console.log(err);
                  }
              });
          
              // Change le vehicule selectionne dans le local storage
              $('#selectVehicleIdx').change(function() {
                var selected_vehicle_name = $("#selectVehicleIdx").val();
                var rcv_num_id = JSON.parse(localStorage.truckList);
                for (rcv_num_id.index = 0; rcv_num_id.index < rcv_num_id.length; rcv_num_id.index++) {
                    if(selected_vehicle_name==rcv_num_id[rcv_num_id.index].rcv_number) {
                        selected_vehicle_id = rcv_num_id[rcv_num_id.index].vehicle_id;
                        var last_collect = rcv_num_id[rcv_num_id.index].lastCollect;
                    }
                }
                localStorage.selectedVehicletab = JSON.stringify({name: selected_vehicle_name, id:selected_vehicle_id, lastCollect: last_collect});
                $("#selectVehicleIdx").selectpicker("render");
              });
          
              var initialLocaleCode = localStorage.language || 'fr';
              // Detecter le francais pour afficher les mois et jours en francais
              if(initialLocaleCode==="fr")
              {
                  $("#addEventModal_startDate, #addEventModal_endDate, \
                     #addEventCalendarModal_startDate, #addEventCalendarModal_endDate, \
                     #modifyEventCalendarModal_startDate, #modifyEventCalendarModal_endDate, \
                     #acknowledgeEventCalendarModal_startDate, #acknowledgeEventCalendarModal_endDate, \
                     #acknowledgeEventCalendarModal_ackDate").datetimepicker({
                    locale: 'fr',
                    format:'YYYY-MM-DD HH:mm',
                    minDate: '2018-06-01',
                    maxDate: '2118-06-01',
                    defaultDate: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    stepping: 1
                  });
              }
              else 
              {
                $("#addEventModal_startDate, #addEventModal_endDate, \
                   #addEventCalendarModal_startDate, #addEventCalendarModal_endDate, \
                   #modifyEventCalendarModal_startDate, #modifyEventCalendarModal_endDate, \
                   #acknowledgeEventCalendarModal_startDate, #acknowledgeEventCalendarModal_endDate, \
                   #acknowledgeEventCalendarModal_ackDate").datetimepicker({
                  locale: 'en',
                  format:'YYYY-MM-DD hh:mm',
                  minDate: '2018-06-01',
                  maxDate: '2118-06-01',
                  defaultDate: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                  stepping: 1
                });
              }
          
              if(!localStorage.maintenanceEvent)
              {
                var eventsJSON = [
                  {
                    title: 'RDV Faun Environnement',
                    description: 'RDV Faun Environnement toute la journée',
                    //url: 'http://faun-environnement.fr/',
                    allDay: true,
                    start: '2019-11-15',
                    end: '2019-11-15',
                    vehicle: 'none',
                    type: 'Sécurité',
                    event_id: 0
                  },
                  {
                    title: 'Maintenance Benne 80569',
                    description: 'Maintenance Benne n°80569 à 8h',
                    start: '2019-11-25 08:00',
                    end: '2019-11-25 12:00',
                    vehicle: '80569',
                    type: 'Sécurité',
                    event_id: 1
                  },
                  {
                    title: 'Maintenance Benne SAV1',
                    description: 'Maintenance Benne n°SAV1 à 8h',
                    start: '2019-11-27 08:00',
                    end: '2019-11-27 12:00',
                    vehicle: 'SAV1',
                    type: 'Entretien périodique',
                    event_id: 2
                  },
                  {
                    title: 'Maintenance Benne 75113-2',
                    description: 'Maintenance Benne n°75113-2 à 14h',
                    start: '2019-11-27 14:00',
                    end: '2019-11-27 18:00',
                    vehicle: '75113-2',
                    type: 'Entretien périodique',
                    event_id: 3
                  },
                  {
                    title: 'Maintenance Benne 80621',
                    description: 'Maintenance Benne n°80569 de 14h à 18h',
                    start: '2019-11-06 14:00',
                    end: '2019-11-06 18:00',
                    vehicle: '80621',
                    type: 'Suivi structurel',
                    event_id: 4
                  }
                ];
                localStorage.maintenanceEvent = JSON.stringify(eventsJSON);
              }
              var calendarEl = document.getElementById('full_calendar');
              var calendar = new FullCalendar.Calendar(calendarEl, {
                plugins: [ 'dayGrid', 'interaction', 'timeGrid', 'moment', 'list', 'bootstrap' ],
                header: {
                  //left: 'prev,next today addEventButton',
                  left: 'prev,next today addEventButton',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                themeSystem: 'bootstrap',
                bootstrapFontAwesome: {
                  addEventButton: 'fa-plus',
                  close: 'fa-times',
                  prev: 'fa-chevron-left',
                  next: 'fa-chevron-right',
                  prevYear: 'fa-angle-double-left',
                  nextYear: 'fa-angle-double-right'
                },
                height: 800, 
                defaultView: 'dayGridMonth',
                defaultDate: new Date(),
                locale: initialLocaleCode,
                buttonIcons: false, // show the prev/next text
                weekNumbers: true,
                showNonCurrentDates: false,
                fixedWeekCount: false,
                navLinks: true, // can click day/week names to navigate views
                editable: true,
                selectable: true,
                eventLimit: true, // allow "more" link when too many events
                eventRender: function(eventObj, $el) {
                  // $el.popover({
                  //   content: eventObj.description,
                  //   trigger: 'hover',
                  //   placement: 'top',
                  //   container: 'body'
                  // });
                },
                eventClick: function(eventClickInfo) {
                  // console.log(this.getEventSources());
                  if($("#modifyCalendarEventDiv").hasClass("show"))
                  {
                    $("#modifyCalendar .rotate-icon").toggleClass("down");
                    $('#modifyCalendarEventDiv').removeClass('show');
                  }
                  if($("#acknowledgeCalendarEventDiv").hasClass("show"))
                  {
                    $("#acknowledgeCalendar .rotate-icon").toggleClass("down");
                    $('#acknowledgeCalendarEventDiv').removeClass('show');
                  }
                  vehicles = JSON.parse(localStorage.truckList);
                  var vehicle = eventClickInfo.event.extendedProps.vehicle;
                  var eventType = eventClickInfo.event.extendedProps.type;
                  $('#modifyEventCalendarModal_searchVehicle, \
                     #acknowledgeEventCalendarModal_searchVehicle').selectpicker('val', vehicle);
                  $('#modifyEventCalendarModal_eventType, \
                    #acknowledgeEventModal_eventType').selectpicker('val', eventType);
                  $("#modifyEventCalendarModal_searchVehicle, \
                     #acknowledgeEventCalendarModal_searchVehicle, \
                     #modifyEventCalendarModal_eventType, \
                     #acknowledgeEventModal_eventType").selectpicker("refresh");
                  var title = eventClickInfo.event.title;
                  $("#modifyEventCalendarModal_title, \
                     #acknowledgeEventCalendarModal_title").val(title);
                  var start_timestamp = moment(eventClickInfo.event.start).format('YYYY-MM-DD HH:mm');
                  var end_timestamp = moment(eventClickInfo.event.end).format('YYYY-MM-DD HH:mm');
                  $("#modifyEventCalendarModal_startDate, \
                     #acknowledgeEventCalendarModal_startDate").val(start_timestamp);
                  $("#modifyEventCalendarModal_endDate, \
                     #acknowledgeEventCalendarModal_endDate").val(end_timestamp);
                  var description = eventClickInfo.event.extendedProps.description;
                  $("#modifyEventCalendarModal_message, \
                     #acknowledgeEventCalendarModal_message").val(description);
                  // need to pass argument 'event' to click event handler
                  // $('#myElement').click({param1: myParam, param2: myOtherParam}, myFunction);
                  // $('#myElement').click({param1: myParam, param2: myOtherParam}, function(arg){});
                  // Delete event
                  $("#btnModifyDeleteCalendarEvent").click({param1: eventClickInfo.event, param2: calendar}, function(){
                    var tab = JSON.parse(localStorage.maintenanceEvent);
                    for (var i = 0; i < tab.length; i++) {
                      var cur = tab[i];
                      if (cur.title === eventClickInfo.event.title 
                          && cur.description === eventClickInfo.event.extendedProps.description 
                          && cur.start === moment(eventClickInfo.event.start).format('YYYY-MM-DD HH:mm') 
                          && cur.end === moment(eventClickInfo.event.end).format('YYYY-MM-DD HH:mm') 
                          && cur.vehicle === eventClickInfo.event.extendedProps.vehicle) {
                          console.log('event detected!');
                          tab.splice(i, 1);
                          localStorage.maintenanceEvent = JSON.stringify(tab);
                          break;
                      }
                    }
                    location.reload();
                  });
                  // Validate event modifications
                  $("#btnModifyValidateCalendarEvent").click({param: eventClickInfo.event}, function(){
                    if($("#checkboxModifyEventCalendarModalAllDay").is(":checked"))
                    {
                      var allDayBoolean = true;
                    }
                    else
                    {
                      var allDayBoolean = false;
                    }
                    var testStartDate = moment($("#modifyEventCalendarModal_startDate").val(), 'YYYY-MM-DD HH:mm', true);
                    var testEndDate = moment($("#modifyEventCalendarModal_endDate").val(), 'YYYY-MM-DD HH:mm', true);
                    if($("#modifyEventCalendarModal_searchVehicle").val() == "")
                    {
                      $("#modifyEventCalendarModal_searchVehicle_mandatory").show();
                      $("#modifyEventCalendarModal_searchVehicle").css({border: '1px solid #ef1a1a'});
                      $("#modifyEventCalendarModal_searchVehicle").trigger('focus');
                      $("#modifyEventCalendarModal_searchVehicle").on('input', function() {
                        $("#modifyEventCalendarModal_searchVehicle_mandatory").hide();
                        $("#modifyEventCalendarModal_searchVehicle").css({border: '1px solid #ced4da'});
                      });
                    }
                    if($("#modifyEventCalendarModal_title").val() == "")
                    {
                      $("modifyEventCalendarModal_title_mandatory").show();
                      $("#modifyEventCalendarModal_title").css({border: '1px solid #ef1a1a'});
                      $("#modifyEventCalendarModal_title").trigger('focus');
                      $("#modifyEventCalendarModal_title").on('input', function() {
                        $("#modifyEventCalendarModal_title_mandatory").hide();
                        $("#modifyEventCalendarModal_title").css({border: '1px solid #ced4da'});
                      });
                    }
                    if($("#modifyEventCalendarModal_message").val() == "")
                    {
                      $("#modifyEventCalendarModal_message_mandatory").show();
                      $("#modifyEventCalendarModal_message").css({border: '1px solid #ef1a1a'});
                      $("#modifyEventCalendarModal_message").trigger('focus');
                      $("#modifyEventCalendarModal_message").on('input', function() {
                        $("#modifyEventCalendarModal_message_mandatory").hide();
                        $("#modifyEventCalendarModal_message").css({border: '1px solid #ced4da'});
                      });
                    }
                    if(!testStartDate.isValid())
                    {
                      $("#modifyEventCalendarModal_startDate_mandatory").show();
                      $("#modifyEventCalendarModal_startDate").css({border: '1px solid #ef1a1a'});
                      $("#modifyEventCalendarModal_startDate").trigger('focus');
                      $("#modifyEventCalendarModal_startDate").on('input', function() {
                        $("#modifyEventCalendarModal_startDate_mandatory").hide();
                        $("#modifyEventCalendarModal_startDate").css({border: '1px solid #ced4da'});
                      });
                    }
                    if(!testEndDate.isValid())
                    {
                      $("#modifyEventCalendarModal_endDate_mandatory").show();
                      $("#modifyEventCalendarModal_endDate").css({border: '1px solid #ef1a1a'});
                      $("#modifyEventCalendarModal_endDate").trigger('focus');
                      $("#modifyEventCalendarModal_endDate").on('input', function() {
                        $("#modifyEventCalendarModal_endDate_mandatory").hide();
                        $("#modifyEventCalendarModal_endDate").css({border: '1px solid #ced4da'});
                      });
                    }
                    if(testStartDate.isValid() && testEndDate.isValid() && $("#modifyEventCalendarModal_title").val() != "" && $("#modifyEventCalendarModal_startDate").val() != "" && $("#modifyEventCalendarModal_endtDate").val() != "" && $("#modifyEventCalendarModal_message").val() != "")
                    {
                      // Delete old event
                      var tab = JSON.parse(localStorage.maintenanceEvent);
                      for (var i = 0; i < tab.length; i++) {
                        var cur = tab[i];
                        if (cur.title === eventClickInfo.event.title 
                            && cur.description === eventClickInfo.event.description 
                            && cur.start === moment(eventClickInfo.event.start).format('YYYY-MM-DD HH:mm')
                            && cur.end === moment(eventClickInfo.event.end).format('YYYY-MM-DD HH:mm') 
                            && cur.vehicle === eventClickInfo.event.vehicle) {
                            tab.splice(i, 1);
                            localStorage.maintenanceEvent = JSON.stringify(tab);
                            break;
                        }
                      }
                      // Add new modified event
                      var json = JSON.parse(localStorage.maintenanceEvent);
                      var newEventVehicle = $("#modifyEventCalendarModal_searchVehicle").val();
                      var newEventType = $("#modifyEventCalendarModal_eventType").val();
                      var newEventTitle = $("#modifyEventCalendarModal_title").val();
                      var newEventDate = $("#modifyEventCalendarModal_startDate").val();
                      var newEventStopDate = $("#modifyEventCalendarModal_endDate").val();
                      var newEventMessage = $("#modifyEventCalendarModal_message").val();
                      var jsonNewEvent = {
                                            title: newEventTitle,
                                            type: newEventType,
                                            description: newEventMessage,
                                            start: newEventDate,
                                            end: newEventStopDate,
                                            vehicle: newEventVehicle,
                                            allDay: allDayBoolean,
                                          };
                      json.push(jsonNewEvent);
                      localStorage.maintenanceEvent = JSON.stringify(json);
                      // renderEvent is for one element, and renderEvents is for array of elements
                      $('#modifyCalendarEvent').modal('hide');
                      //location.reload();
                      // $('#full_calendar').fullCalendar('renderEvent', jsonNewEvent);
                    }
                  });
                  // Display modify modal
                  $('#modifyCalendarEvent').modal('show');
                },
                customButtons: {
                  addEventButton: {
                    text: 'Evènement',
                    click: function() {
                      var today = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                      var email = JSON.parse(localStorage.userInfo).email || "recipient@example.com";
                      $('#addEventModal_title').val("");
                      $("#addEventModal_title").css({fontSize: '0.8rem'});
                      //$('#addEventModal_startDate').val(today);
                      $("#addEventModal_startDate").css({fontSize: '0.8rem'});
                      $('#addEventModal_message').val("");
                      $("#addEventModal_message").css({fontSize: '0.8rem'});
                      $('#addEmailModal_recipient').val(email);
                      $("#addEmailModal_recipient").css({fontSize: '0.8rem'});
                      $('#addEmailModal_message').val("");
                      $("#addEmailModal_message").css({fontSize: '0.8rem'});
                      $('#addEventModal').modal('show');
                      // var dateStr = prompt('Saisir une date au format YYYY-MM-DD HH:mm:ss');
                      // var date = moment(dateStr);
                      // if (date.isValid()) {
                      //   $('#full_calendar').fullCalendar('renderEvent', {
                      //     title: 'Maintenance Benne SAV1',
                      //     description: 'Maintenance Benne n°SAV1 à 8h',
                      //     start: date
                      //   });
                      //   $('#list_calendar').fullCalendar('renderEvent', {
                      //     title: 'Maintenance Benne SAV1',
                      //     description: 'Maintenance Benne n°SAV1 à 8h',
                      //     start: date
                      //   });
                      //   alert('Great. Now, update your database...');
                      // } else {
                      //   alert('Invalid date.');
                      // }
                    }
                  }
                },
                eventSources: [
                  // API source
                  {
                    url: '/events.php', // use the `url` property
                    id: 'api_events',
                    method: 'POST',
                    extraParams: {
                      timezone: localStorage.timezone,
                      start_timestamp: '2020-01-08 00:00:00',
                      end_timestamp: '2020-01-08 14:00:00',
                    },
                    failure: function() {
                      console.log('there was an error while fetching events!');
                    },
                    editable: false,
                    className: ['api_event'],
                    backgroundColor: 'green',
                    borderColor: 'green',
                    textColor: 'black'
                  },
                  // Local source
                  {
                    events: JSON.parse(localStorage.maintenanceEvent),
                    id: 'local_events',
                    className: ['local_event']
                  }
                ],
                select: function(selectionInfo) {
                  var startDate = moment(selectionInfo.start).format('YYYY-MM-DD HH:mm');
                  var endDate = moment(selectionInfo.end).format('YYYY-MM-DD HH:mm');
                  // console.log('Coordinates: ' + eventClickInfo.jsEvent.pageX + ',' + eventClickInfo.jsEvent.pageY);
                  var start_date = new Date(startDate);
                  var month = start_date.getMonth();
                  var day = start_date.getDate();
                  var year = start_date.getFullYear();
                  var hour = start_date.getHours();
                  var minute = start_date.getMinutes();
                  var second = start_date.getSeconds();
                  var selected_vehicle_id;
                  if(selectionInfo.view.type === "dayGridMonth")
                  {
                    var start_timestamp = startDate;
                    var end_timestamp = endDate;
                    $("#addEventCalendarModal_startDate").val(start_timestamp);
                    $("#addEventCalendarModal_endDate").val(end_timestamp);
                  }
                  else if(selectionInfo.view.type === 'timeGridWeek')
                  {
                    var start_timestamp = startDate;
                    var end_timestamp = endDate;
                    $("#addEventCalendarModal_startDate").val(start_timestamp);
                    $("#addEventCalendarModal_endDate").val(end_timestamp);
                  }
                  else if(selectionInfo.view.type === "timeGridDay")
                  {
                    var start_timestamp = startDate;
                    var end_timestamp = endDate;
                    $("#addEventCalendarModal_startDate").val(start_timestamp);
                    $("#addEventCalendarModal_endDate").val(end_timestamp);
                  }
                  else
                  {
                    var start_timestamp = moment(new Date(year, month, day, 0, 0, 0)).format('YYYY-MM-DD HH:mm');
                    var end_timestamp = moment(new Date(year, month, day, 23, 59, 59)).format('YYYY-MM-DD HH:mm');
                    $("#addEventCalendarModal_startDate").val(start_timestamp);
                    $("#addEventCalendarModal_endDate").val(end_timestamp);
                  }
                  $('#addCalendarEvent').modal('show');
                }
              });
              calendar.render();
          
          
              // Add a popover to describe button
              $('.fc-addEventButton-button').popover({
                content: 'Gérer les paramètres',
                trigger: 'hover',
                placement: 'top',
                container: 'body'
              });
              // Focus on date input
              // $('#addEventModal').on('shown.bs.modal', function () {
              //   $('#addEventModal_startDate').trigger('focus');
              // });
          
              // Clean modal before exit
              $('#addEventModal').on('hidden.bs.modal', function () {
                // Clear all input errors
                $("#addEventModal_title_mandatory").hide();
                $("#addEventModal_title").css({border: '1px solid #ced4da'});
                $("#addEventModal_message_mandatory").hide();
                $("#addEventModal_message").css({border: '1px solid #ced4da'});
                // Collapse all list columns by default
                if($("#addEventDiv").hasClass("show"))
                {
                  $('#addEvent').trigger('click');
                }
                if($("#manageEmailDiv").hasClass("show"))
                {
                  $('#manageEmail').trigger('click');
                }
              });
              // Force calendar to re-render on buttons click
              $("fc-prev-button").click(function(){
                if(localStorage.maintenanceEvent)
                {
                  $('#full_calendar').fullCalendar('renderEvent', JSON.parse(localStorage.maintenanceEvent));
                }
              });
              // Auto center viewport on scroll
              $('.collapse').on('show.bs.collapse', function(e) {
                var $card = $(this).closest('.card');
                var $open = $($(this).data('parent')).find('.collapse.show');
                
                var additionalOffset = 0;
                if($card.prevAll().filter($open.closest('.card')).length !== 0)
                {
                  additionalOffset =  $open.height();
                }
                $('html,body').animate({
                  scrollTop: $card.offset().top - additionalOffset
                }, 500);
              });
              // Event management
              $("#addEvent").click(function(){
                var addEventIsCollapsed = true;
                // Focus on title element when expand addEvent
                $("#addEventDiv").on('shown.bs.collapse', function() {
                  if(addEventIsCollapsed)
                  {
                    $("#addEventModal_title").trigger("focus");
                  }
                  addEventIsCollapsed = false;
                });
                $("#addEvent .rotate-icon").toggleClass("down");
                if($("#manageEmailDiv").hasClass("show"))
                {
                  $("#manageEmail .rotate-icon").toggleClass("down");
                }
                if($("#selectTruckDiv").hasClass("show"))
                {
                  $("#selectTruckCalendar .rotate-icon").toggleClass("down");
                }
              });
              // Cancel event boutton
              $("#btnCancelEvent").click(function(){
                $('#addEventModal_title').val("");
                $('#addEventModal_startDate').val("");
                $('#addEventModal_message').val("");
                $("#checkboxaddEventModalAllDay").prop("checked", false);
              });
              $("#btnAddEvent").click(function(){
                if($("#checkboxaddEventModalAllDay").is(":checked"))
                {
                  var allDayBoolean = true;
                }
                else
                {
                  var allDayBoolean = false;
                }
                var testStartDate = moment($("#addEventModal_startDate").val(), 'YYYY-MM-DD HH:mm', true);
                var testEndDate = moment($("#addEventModal_endDate").val(), 'YYYY-MM-DD HH:mm', true);
                if($("#addEventCalendarModal_searchVehicle").val() == "")
                {
                  $("#addEventCalendarModal_searchVehicle_mandatory").show();
                  $("#addEventCalendarModal_searchVehicle").css({border: '1px solid #ef1a1a'});
                  $("#addEventCalendarModal_searchVehicle").trigger('focus');
                  $("#addEventCalendarModal_searchVehicle").on('input', function() {
                    $("#addEventCalendarModal_searchVehicle_mandatory").hide();
                    $("#addEventCalendarModal_searchVehicle").css({border: '1px solid #ced4da'});
                  });
                }
                if($("#addEventModal_title").val() == "")
                {
                  $("#addEventModal_title_mandatory").show();
                  $("#addEventModal_title").css({border: '1px solid #ef1a1a'});
                  $("#addEventModal_title").trigger('focus');
                  $("#addEventModal_title").on('input', function() {
                    $("#addEventModal_title_mandatory").hide();
                    $("#addEventModal_title").css({border: '1px solid #ced4da'});
                  });
                }
                if($("#addEventModal_message").val() == "")
                {
                  $("#addEventModal_message_mandatory").show();
                  $("#addEventModal_message").css({border: '1px solid #ef1a1a'});
                  $("#addEventModal_message").trigger('focus');
                  $("#addEventModal_message").on('input', function() {
                    $("#addEventModal_message_mandatory").hide();
                    $("#addEventModal_message").css({border: '1px solid #ced4da'});
                  });
                }
                if(!testStartDate.isValid())
                {
                  $("#addEventModal_startDate_mandatory").show();
                  $("#addEventModal_startDate").css({border: '1px solid #ef1a1a'});
                  $("#addEventModal_startDate").trigger('focus');
                  $("#addEventModal_startDate").on('input', function() {
                    $("#addEventModal_startDate_mandatory").hide();
                    $("#addEventModal_startDate").css({border: '1px solid #ced4da'});
                  });
                }
                if(!testEndDate.isValid())
                {
                  $("#addEventModal_endDate_mandatory").show();
                  $("#addEventModal_endDate").css({border: '1px solid #ef1a1a'});
                  $("#addEventModal_endDate").trigger('focus');
                  $("#addEventModal_endDate").on('input', function() {
                    $("#addEventModal_endDate_mandatory").hide();
                    $("#addEventModal_endDate").css({border: '1px solid #ced4da'});
                  });
                }
                if(testStartDate.isValid() && testEndDate.isValid() && $("#addEventModal_title").val() != "" && $("#addEventModal_startDate").val() != "" && $("#addEventModal_endtDate").val() != "" && $("#addEventModal_message").val() != "")
                {
                  var json = JSON.parse(localStorage.maintenanceEvent);
                  var newEventVehicle = $("#addEventCalendarModal_searchVehicle").val();
                  var newEventType = $("#addEventCalendarModal_eventType").val();
                  var newEventTitle = $("#addEventModal_title").val();
                  var newEventDate = $("#addEventModal_startDate").val();
                  var newEventStopDate = $("#addEventModal_endDate").val();
                  var newEventMessage = $("#addEventModal_message").val();
                  var jsonNewEvent = {
                                        title: newEventTitle,
                                        type: newEventType,
                                        description: newEventMessage,
                                        start: newEventDate,
                                        end: newEventStopDate,
                                        vehicle: newEventVehicle,
                                        allDay: allDayBoolean,
                                      };
                  json.push(jsonNewEvent);
                  localStorage.maintenanceEvent = JSON.stringify(json);
                  // renderEvent is for one element, and renderEvents is for array of elements
                  $('#full_calendar').fullCalendar('renderEvent', jsonNewEvent);
                  $('#addEventSuccessModal').modal('show');
                }
              });
              // Add event boutton
              $("#btnCancelCalendarEvent").click(function(){
                $('#addEventCalendarModal_title').val("");
                $('#addEventCalendarModal_startDate').val("");
                $('#addEventCalendarModal_endDate').val("");
                $('#addEventCalendarModal_message').val("");
                $("#checkboxaddEventCalendarModalAllDay").prop("checked", false);
                $('#addCalendarEvent').modal('hide');
              });
              $("#btnAddCalendarEvent").click(function(){
                if($("#checkboxAddEventCalendarModalAllDay").is(":checked"))
                {
                  var allDayBoolean = true;
                }
                else
                {
                  var allDayBoolean = false;
                }
                var testStartDate = moment($("#addEventCalendarModal_startDate").val(), 'YYYY-MM-DD HH:mm', true);
                var testEndDate = moment($("#addEventCalendarModal_endDate").val(), 'YYYY-MM-DD HH:mm', true);
                if($("#addEventCalendarModal_searchVehicle").val() == "")
                {
                  $("#addEventCalendarModal_searchVehicle_mandatory").show();
                  $("#addEventCalendarModal_searchVehicle").css({border: '1px solid #ef1a1a'});
                  $("#addEventCalendarModal_searchVehicle").trigger('focus');
                  $("#addEventCalendarModal_searchVehicle").on('input', function() {
                    $("#addEventCalendarModal_searchVehicle_mandatory").hide();
                    $("#addEventCalendarModal_searchVehicle").css({border: '1px solid #ced4da'});
                  });
                }
                if($("#addEventCalendarModal_title").val() == "")
                {
                  $("#addEventCalendarModal_title_mandatory").show();
                  $("#addEventCalendarModal_title").css({border: '1px solid #ef1a1a'});
                  $("#addEventCalendarModal_title").trigger('focus');
                  $("#addEventCalendarModal_title").on('input', function() {
                    $("#addEventCalendarModal_title_mandatory").hide();
                    $("#addEventCalendarModal_title").css({border: '1px solid #ced4da'});
                  });
                }
                if($("#addEventCalendarModal_message").val() == "")
                {
                  $("#addEventCalendarModal_message_mandatory").show();
                  $("#addEventCalendarModal_message").css({border: '1px solid #ef1a1a'});
                  $("#addEventCalendarModal_message").trigger('focus');
                  $("#addEventCalendarModal_message").on('input', function() {
                    $("#addEventCalendarModal_message_mandatory").hide();
                    $("#addEventCalendarModal_message").css({border: '1px solid #ced4da'});
                  });
                }
                if(!testStartDate.isValid())
                {
                  $("#addEventCalendarModal_startDate_mandatory").show();
                  $("#addEventCalendarModal_startDate").css({border: '1px solid #ef1a1a'});
                  $("#addEventCalendarModal_startDate").trigger('focus');
                  $("#addEventCalendarModal_startDate").on('input', function() {
                    $("#addEventCalendarModal_startDate_mandatory").hide();
                    $("#addEventCalendarModal_startDate").css({border: '1px solid #ced4da'});
                  });
                }
                if(!testEndDate.isValid())
                {
                  $("#addEventCalendarModal_endDate_mandatory").show();
                  $("#addEventCalendarModal_endDate").css({border: '1px solid #ef1a1a'});
                  $("#addEventCalendarModal_endDate").trigger('focus');
                  $("#addEventCalendarModal_endDate").on('input', function() {
                    $("#addEventCalendarModal_endDate_mandatory").hide();
                    $("#addEventCalendarModal_endDate").css({border: '1px solid #ced4da'});
                  });
                }
                if(testStartDate.isValid() && testEndDate.isValid() && $("#addEventCalendarModal_title").val() != "" && $("#addEventCalendarModal_startDate").val() != "" && $("#addEventCalendarModal_endtDate").val() != "" && $("#addEventCalendarModal_message").val() != "")
                {
                  var json = JSON.parse(localStorage.maintenanceEvent);
                  var newEventVehicle = $("#addEventCalendarModal_searchVehicle").val();
                  var newEventType = $("#addEventCalendarModal_eventType").val();
                  var newEventTitle = $("#addEventCalendarModal_title").val();
                  var newEventDate = $("#addEventCalendarModal_startDate").val();
                  var newEventStopDate = $("#addEventCalendarModal_endDate").val();
                  var newEventMessage = $("#addEventCalendarModal_message").val();
                  var jsonNewEvent = {
                                        title: newEventTitle,
                                        type: newEventType,
                                        description: newEventMessage,
                                        start: newEventDate,
                                        end: newEventStopDate,
                                        vehicle: newEventVehicle,
                                        allDay: allDayBoolean,
                                      };
                  json.push(jsonNewEvent);
                  localStorage.maintenanceEvent = JSON.stringify(json);
                  // renderEvent is for one element, and renderEvents is for array of elements
                  // $('#full_calendar').fullCalendar('renderEvent', jsonNewEvent);
                  $('#addCalendarEvent').modal('hide');
                  location.reload();
                }
              });
              // Email management
              $("#manageEmail").click(function(){
                var manageEmailIsCollapsed = true;
                $("#manageEmail .rotate-icon").toggleClass("down");
                // Focus on recipient element when expand addEmail
                $("#manageEmailDiv").on('shown.bs.collapse', function() {
                  if(manageEmailIsCollapsed)
                  {
                    var email = JSON.parse(localStorage.userInfo).email || "recipient@example.com";
                    $("#addEmailModal_recipient").val(email);
                    $("#addEmailModal_recipient").trigger("focus");
                  }
                  manageEmailIsCollapsed = false;
                });
                if($("#addEventDiv").hasClass("show"))
                {
                  $("#addEvent .rotate-icon").toggleClass("down");
                }
                if($("#selectTruckDiv").hasClass("show"))
                {
                  $("#selectTruckCalendar .rotate-icon").toggleClass("down");
                }
              });
              $("#btnCancelEmail").click(function(){
                $('#addEmailModal_recipient').val("");
                $('#addEmailModal_message').val("");
                $("#checkboxActivateGroup").prop( "checked", false );
              });
              // selectTruckCalendar
              $("#selectTruckCalendar").click(function(){
                var selectTruckIsCollapsed = true;
                // Focus on title element when expand addEvent
                $("#selectTruckDiv").on('shown.bs.collapse', function() {
                  if(selectTruckIsCollapsed)
                  {
                    $("#selectTruck").trigger("click");
                  }
                  selectTruckIsCollapsed = false;
                });
                $("#selectTruckCalendar .rotate-icon").toggleClass("down");
                if($("#manageEmailDiv").hasClass("show"))
                {
                  $("#manageEmail .rotate-icon").toggleClass("down");
                }
                if($("#addEventDiv").hasClass("show"))
                {
                  $("#addEvent .rotate-icon").toggleClass("down");
                }
              });
              $("#selectAllVehicles").click(function(){
                if($('#selectAllVehicles').is(":checked")) {
                  $('#selectTruck').selectpicker('selectAll');
                }
                else {
                  $('#selectTruck').selectpicker('deselectAll');
                }
              });
              // Modify event
              $("#modifyCalendar").click(function(){
                var modifyEventIsCollapsed = true;
                // Focus on title element when expand addEvent
                $("#modifyCalendarEventDiv").on('shown.bs.collapse', function() {
                  if(modifyEventIsCollapsed)
                  {
                    $("#modifyEventCalendarModal_searchVehicle").trigger("focus");
                  }
                  modifyEventIsCollapsed = false;
                });
                $("#modifyCalendar .rotate-icon").toggleClass("down");
                if($("#acknowledgeCalendarEventDiv").hasClass("show"))
                {
                  $("#acknowledgeCalendar .rotate-icon").toggleClass("down");
                }
              });
              // Acknowledge event
              $("#acknowledgeCalendar").click(function(){
                var acknowledgeEventIsCollapsed = true;
                // Focus on title element when expand addEvent
                $("#acknowledgeCalendarEventDiv").on('shown.bs.collapse', function() {
                  if(acknowledgeEventIsCollapsed)
                  {
                    $("#acknowledgeEventCalendarModal_ackDate").trigger("focus");
                  }
                  acknowledgeEventIsCollapsed = false;
                });
                $("#acknowledgeCalendar .rotate-icon").toggleClass("down");
                if($("#modifyCalendarEventDiv").hasClass("show"))
                {
                  $("#modifyCalendar .rotate-icon").toggleClass("down");
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