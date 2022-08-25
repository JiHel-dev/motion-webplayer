$(window).on('load', function() {
    setTimeout(removeLoader,3000);
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
        // Determiner les droits de l'utilisateur
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
                FaunUtilityModule.get.displayNavigationDrawer(resultat);
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