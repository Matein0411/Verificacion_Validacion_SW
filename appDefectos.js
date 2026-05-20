const usuarios = [];

let intentos = 1;

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
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