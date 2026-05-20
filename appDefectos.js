let usuarios = JSON.parse(sessionStorage.getItem('usuarios') || '[]');

let intentos = 1;

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
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
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const msgEl = document.getElementById('reg-msg');

    if (email === '' || password === '') {
        msgEl.innerText = "Por favor llene los campos.";
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
        // Convierte el array de usuarios a una cadena JSON y lo guarda en sessionStorage
        // Esto asegura que los datos persistan después de recargar o cambiar de página
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
        intentos = 1;
    } else {
        intentos++;
        msgEl.innerText = `Credenciales incorrectas. (Intento ${intentos - 1})`;
        msgEl.className = "msg";

        if (intentos >= 3) {
            msgEl.innerText = "Cuenta bloqueada por exceso de intentos.";
        }
    }
});