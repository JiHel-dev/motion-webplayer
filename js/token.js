var token;

token = localStorage.token;

if(!token || token==null || token=='null' || token==''){
    localStorage.token = null;
    window.location = 'login.php';
}