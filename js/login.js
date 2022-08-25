$(function(){

    $('#email').trigger('focus');
    $('.change_language').on('click', function(e){
        if($(e.currentTarget).attr("faun-lang") === 'fr') {
            $('#email').attr("placeholder", "Email");
            $('#password').attr("placeholder", "Mot de passe");
            $('#connexion').attr("value", "Connexion");
        }
        else if($(e.currentTarget).attr("faun-lang") === 'en') {
            $('#email').attr("placeholder", "Email");
            $('#password').attr("placeholder", "Password");
            $('#connexion').attr("value", "Login");
        }
        else {
            alert('Unknown language.');
        }
    })
    $('#email').on('change', function(){
        $('#check-email').remove();
        $(this).css('border-color', '#ced4da');
    });
    $('#password').on('change', function(){
        $('#check-password').remove();
        $(this).css('border-color', '#ced4da');
    });
    $('input[type="submit"]').click(function(event){
        event.preventDefault();

        $('#check-email').remove();
        $('#check-password').remove();

        var email = $('#email').val();
        var password = $('#password').val();

        if(!email) {
            $('#check-email').remove();
            $('#login-div').prepend('<span id="check-email" class="help-block trn" style="color:red">fill.Email</span>');
            $('#email').css('border-color', 'red');
        }
        if(!password) {
            $('#check-password').remove();
            $('#password-div').prepend('<span id="check-password" class="help-block trn" style="color:red">fill.Password</span>');
            $('#password').css('border-color', 'red');
        }
        $('#login-div').trigger('traduction');
        if(email && password){
            $.ajax({
                    type:'POST',
                    url:'https://connect.faun.fr/api/public/login',
                    data: {email:email, password:sha256_digest(password)},
                    // data: JSON.stringify({email:email, password:sha256_digest(password)}),
                    // contentType: 'application/json',
                    // dataType:'json',
                    success: function(res){
                        console.log(res.token);
                        if(res.status=='success' && res.token) {
                            localStorage.token = res.token;
                            window.location = "index.php";
                        }
                        else {
                            console.log(res.status+' '+res.msg);
                            localStorage.token = null;
                        }
                    },
                    error: function(err){
                        console.log(err.responseJSON.msg);
                        $('#check-password').remove();
                        $('#password-div').append('<h6 id="check-password" class="help-block trn" style="color:red; text-align: center;">invalid.Credentials</h6>');
                        $('#email').css('border-color', 'red');
                        $('#password').css('border-color', 'red');
                        $('#password-div').trigger('traduction');
                    }
            });
        }   

    });

});