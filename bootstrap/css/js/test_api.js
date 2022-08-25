$(function(){
    var url = 'http://api.faun.com';
    var id_vehicule = $('#id_vehicule').val();
    var start_timestamp = $('#startTimestamp').val();
    var end_timestamp = $('#endTimestamp').val();

    $.ajax({
        type:'POST',
        data: {start_timestamp: start_timestamp, end_timestamp: end_timestamp},
        url:url+'/geolocations/'+id_vehicule,
        dataType:'json',

        success:function(result){
            console.log(result);
        },
        error: function(err){
            console.log(err);
        }
    });
});

// $(function(){
    // var url = 'http://api.faun.com';
    // var id_vehicule = $('#id_vehicule').val();

    // $.ajax({
        // type:'GET',
        // url:url+'/vehicles/'+id_vehicule,
        // dataType:'json',

        // success:function(result){
            // console.log(result);
        // },
        // error: function(err){
            // console.log(err);
        // }
    // });
// });