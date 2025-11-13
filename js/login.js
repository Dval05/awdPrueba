$(document).ready(function() {
    $('#loginForm').on('submit', async function(e) {
        e.preventDefault();

        const email = $('#username').val().trim();
        const password = $('#password').val();
        const rememberMe = $('#rememberMe').is(':checked');

        const SUPABASE_URL = window.__ENV && window.__ENV.SUPABASE_URL;
        const SUPABASE_ANON_KEY = window.__ENV && window.__ENV.SUPABASE_ANON_KEY;
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            showAlert('danger', 'Configuración de Supabase no definida.');
            return;
        }

        $('#loginBtn').prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...');

        try {
            const resp = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({ email, password })
            });

            let data = null;
            try { data = await resp.json(); } catch(_){ data = {}; }
            if (!resp.ok) {
                const msg = data.error_description || data.error || data.message || 'Usuario o contraseña incorrectos';
                showAlert('danger', msg);
                $('#loginBtn').prop('disabled', false).html('<i class="fas fa-sign-in-alt"></i> Iniciar Sesión');
                return;
            }

            const token = data.access_token;
            localStorage.setItem("authToken", token);
            localStorage.setItem("userName", email);
            if (rememberMe) {
                // Opcional: persistencia adicional si se requiere
            }
            showAlert('success', '¡Inicio de sesión exitoso! Redirigiendo...');
            setTimeout(function() { window.location.href = 'dashboard.html'; }, 800);
        } catch (err) {
            showAlert('danger', 'Error al conectar con Supabase.');
            $('#loginBtn').prop('disabled', false).html('<i class="fas fa-sign-in-alt"></i> Iniciar Sesión');
        }
    });

    function showAlert(type, message) {
        const alertDiv = $('#alertMessage');
        alertDiv.removeClass('alert-success alert-danger');
        alertDiv.addClass('alert-' + type);
        $('#alertText').text(message);
        alertDiv.show();
        if (type === 'success') {
            setTimeout(function() { alertDiv.hide(); }, 3000);
        }
    }
});
