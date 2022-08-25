$(function(){

    $('.change_language').on('click', function(e){
        if($(e.currentTarget).attr("faun-lang") === 'fr') {
            $('#firstname').attr("placeholder", "Prénom");
            $('#lastname').attr("placeholder", "Nom");
            $('#company').attr("placeholder", "Entreprise");
            $('#phone').attr("placeholder", "Numéro de téléphone");
            $('#pseudo').attr("placeholder", "Pseudo");
            $('#email').attr("placeholder", "Email *");
            $('#password').attr("placeholder", "Mot de passe *");
            $('#confirm_password').attr("placeholder", "Confirmer le mot de passe *");
            $('#register').attr("value", "Créer un compte");
        }
        else if($(e.currentTarget).attr("faun-lang") === 'en') {
            $('#firstname').attr("placeholder", "First Name");
            $('#lastname').attr("placeholder", "Last Name");
            $('#company').attr("placeholder", "Company");
            $('#phone').attr("placeholder", "Phone Number");
            $('#pseudo').attr("placeholder", "Pseudo");
            $('#email').attr("placeholder", "Email *");
            $('#password').attr("placeholder", "Password *");
            $('#confirm_password').attr("placeholder", "Confirm Password *");
            $('#register').attr("value", "Register");
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

    $('#error-div').trigger('traduction');

    $('input[type="submit"]').click(function(event){
        event.preventDefault();
        $('#check-email').remove();
        $('#check-password').remove();
        $('#check-confirm-password').remove();
        $('#last-check').remove();

        var firstname = $('#firstname').val();
        var lastname = $('#lastname').val();
        var company = $('#company').val();
        var phone = $('#phone').val();
        var pseudo = $('#pseudo').val();
        var email = $('#email').val();
        var password = $('#password').val();
        var confirm_password = $('#confirm_password').val();

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
        if(password !== confirm_password) {
            $('#check-password').remove();
            $('#last-check-div').append('<h6 id="last-check" class="help-block trn" style="color:red; text-align: center;">no.match.Password</h6>');
            $('#password').css('border-color', 'red');
            $('#confirm_password').css('border-color', 'red');
            $('#password-div').trigger('traduction');
        }
        $('#login-div').trigger('traduction');
        if(email && password && password === confirm_password){
            $.ajax({
                type:'POST',
                url :'https://connect.faun.fr/api/public/register',
                data: JSON.stringify({email:email, password:sha256_digest(password), firstname:firstname, lastname:lastname, company:company, phone:phone, pseudo:pseudo}),
                contentType: 'application/json',
                dataType:'json',
                success: function(res){
                    alert('User created successfully.')
                    window.location = "login.php";
                },
                error: function(err){
                    alert('An error occurred!')
                    console.log(err);
                }
            });
        }

    });

});