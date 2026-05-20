let usuarios = JSON.parse(sessionStorage.getItem('usuarios') || '[]');
let intentos = 1;

/* 
CASO 1: Registro con espacios en blanco no controlados

ERROR:
El programador no consideró limpiar los campos de entrada del formulario de registro,
es decir, no eliminó los espacios en blanco antes o después del correo y la contraseña.

DEFECTO:
El correo y la contraseña se guardan directamente en el sistema sin aplicar una limpieza,
como trim(), sobre los datos ingresados.

FALLO:
Al ejecutar el sistema, el usuario puede registrarse con espacios ocultos al inicio o al final.
Luego, cuando intenta iniciar sesión ingresando sus credenciales sin esos espacios,
el sistema rechaza el acceso aunque estas parezcan correctas.
*/

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
