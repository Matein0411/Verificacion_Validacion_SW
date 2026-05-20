Defectos: 
/**
 * CONCEPTOS PARA LA PRESENTACIÓN:
 * 
 * 1. ERROR (Error humano): Es la equivocación cometida por el desarrollador al escribir el código.
 *    Ejemplo: El programador olvidó limpiar los espacios en blanco de un input o inicializó mal una variable.
 * 
 * 2. DEFECTO (Bug): Es el resultado del error humano que reside en el código de software.
 *    Ejemplo: La variable 'intentos' está inicializada en 1 en lugar de 0.
 * 
 * 3. FALLO (Failure): Es la manifestación visible del defecto cuando el programa se ejecuta. Es lo que experimenta el usuario.
 * 
 * --- FALLOS OBSERVABLES EN ESTE MÓDULO (Para mostrar a los otros grupos) ---
 * 
 * FALLO 1: "Bloqueo Prematuro". 
 * El usuario se equivoca al ingresar su contraseña y el sistema bloquea su cuenta al segundo intento fallido, 
 * a pesar de que los requisitos (RF2) establecen que debe tener 3 intentos. 
 * (Causado por el Defecto 3).
 * 
 * FALLO 2: "Falso Positivo de Duplicidad". 
 * El usuario intenta registrarse con un correo nuevo, pero pone una contraseña "123456" que casualmente
 * otro usuario ya tiene. El sistema le impide registrarse y lanza el mensaje "este campo ya utilizo este usuario".
 * (Causado por el Defecto 4).
 */
 



CORRECCION

const usuarios = []; // Base de datos simulada en memoria

// CORRECCIÓN 3: Inicializamos el contador en 0.
let intentos = 0; 
let cuentaBloqueada = false;

// --- LÓGICA DE REGISTRO ---
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const msgEl = document.getElementById('reg-msg');

    // CORRECCIÓN 1 y 2: Limpieza de espacios con .trim() y normalización a minúsculas con .toLowerCase()
    const rawEmail = document.getElementById('reg-email').value.trim();
    const email = rawEmail.toLowerCase();
    const password = document.getElementById('reg-password').value.trim();

    // CORRECCIÓN 5: Validación mediante Expresión Regular para estructura estándar de correos.
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(email)) {
        msgEl.innerText = "Por favor, ingrese un formato de correo válido.";
        msgEl.className = "msg";
        return;
    }

    if (password === '') {
        msgEl.innerText = "La contraseña no puede estar vacía.";
        msgEl.className = "msg";
        return;
    }

    // CORRECCIÓN 4: Validación de unicidad apuntando correctamente al correo (u.email).
    const existe = usuarios.find(u => u.email === email);
    
    if (existe) {
        msgEl.innerText = "Este correo ya se encuentra registrado.";
        msgEl.className = "msg";
    } else {
        usuarios.push({ email, password });
        msgEl.innerText = "Registro exitoso.";
        msgEl.className = "msg success";
        document.getElementById('register-form').reset();
    }
});

// --- LÓGICA DE INICIO DE SESIÓN ---
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const msgEl = document.getElementById('log-msg');

    // Manejo correcto del bloqueo
    if (cuentaBloqueada) {
        msgEl.innerText = "Cuenta bloqueada. Intente más tarde.";
        msgEl.className = "msg";
        return;
    }

    // CORRECCIÓN 1 y 2 en el Login
    const rawEmail = document.getElementById('log-email').value.trim();
    const email = rawEmail.toLowerCase();
    const password = document.getElementById('log-password').value.trim();

    const usuarioValido = usuarios.find(u => u.email === email && u.password === password);

    if (usuarioValido) {
        msgEl.innerText = "Inicio de sesión exitoso. ¡Bienvenido!";
        msgEl.className = "msg success";
        intentos = 0; // Se restablecen los intentos a 0
    } else {
        intentos++; // Incremento correcto
        
        if (intentos >= 3) {
            cuentaBloqueada = true;
            msgEl.innerText = "Cuenta bloqueada por exceso de intentos fallidos.";
            msgEl.className = "msg";
        } else {
            msgEl.innerText = `Credenciales incorrectas. Le quedan ${3 - intentos} intentos.`;
            msgEl.className = "msg";
        }
    }
});