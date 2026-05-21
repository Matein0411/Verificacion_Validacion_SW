let usuarios = JSON.parse(sessionStorage.getItem('usuarios') || '[]');
let intentos = 1;

/* 
CASO 2: Expresión regular sin anclajes (Error catastrófico invisible)

ERROR:
El programador omitió los metacaracteres de anclaje de inicio (^) y fin ($) 
en la expresión regular utilizada para verificar el formato del correo.

DEFECTO:
La función validateEmail no comprueba que toda la cadena introducida sea un correo válido, 
sino únicamente que la cadena *contenga* un fragmento con forma de correo en cualquier 
parte de su extensión.

FALLO:
Al ejecutar el sistema, un usuario puede introducir cadenas maliciosas o con basura, 
como por ejemplo "hola_esto_es_un_intento_de_inyeccion_usuario@dominio.com_texto_extra". 
El sistema evaluará esto como `true` porque encuentra el patrón en medio, permitiendo 
el registro de un correo completamente inválido que podría corromper la base de datos 
o fallar en un módulo de notificaciones.
*/
function validateEmail(email) {
    const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    return regex.test(email);
}

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    /* 
    CASO 1: Formularios de registro e inicio de sesión con espacios en blanco no controlados
    
    ERROR:
    El programador no consideró que el usuario puede escribir espacios antes o después
    del correo y la contraseña, ya sea por equivocación o de manera intencional,
    tanto en el registro como en el inicio de sesión.
    
    DEFECTO:
    El sistema guarda y compara las credenciales exactamente como fueron ingresadas,
    sin quitar los espacios en blanco con una función como trim().
    
    FALLO:
    Al ejecutar el sistema, el usuario puede ingresar espacios en blanco sin darse cuenta
    al registrarse o al iniciar sesión. Como el sistema no elimina esos espacios,
    las credenciales guardadas pueden no coincidir con las que el usuario escribe
    en el inicio de sesión, por lo que se rechaza el acceso aunque los datos parezcan correctos.
    */
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const msgEl = document.getElementById('reg-msg');

    if (email === '' || password === '') {
        msgEl.innerText = "Por favor llene los campos.";
        return;
    }

    if (!validateEmail(email)) {
        msgEl.innerText = "Formato de correo inválido.";
        msgEl.className = "msg";
        return;
    }

    const existe = usuarios.find(u => u.password === password);

    if (existe) {
        msgEl.innerText = "Credenciales ya registradas.";
        msgEl.className = "msg";
    } else { 
        usuarios.push({ email, password });
        msgEl.innerText = "Registro exitoso.";
        msgEl.className = "msg success";
        document.getElementById('register-form').reset();
        sessionStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
});


document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const msgEl = document.getElementById('log-msg');


    if (intentos >= 3) {
        msgEl.innerText = "Cuenta bloqueada por exceso de intentos.";
        return;
    }

    const email = document.getElementById('log-email').value;
    const password = document.getElementById('log-password').value;


    const usuarioValido = usuarios.find(u => u.email === email && u.password === password);

    if (usuarioValido) {
        msgEl.innerText = "Inicio de sesión exitoso. ¡Bienvenido!";
        msgEl.className = "msg success";
        intentos = 1; // Resetea intentos tras éxito
    } else {
        intentos++;
        msgEl.innerText = `Credenciales incorrectas. (Intento ${intentos - 1})`;
        msgEl.className = "msg";

        if (intentos > 3) {
            msgEl.innerText = "Cuenta bloqueada por exceso de intentos.";
        }
    }
});
