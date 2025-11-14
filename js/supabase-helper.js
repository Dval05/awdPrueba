/**
 * Supabase Client Helper for Frontend
 * 
 * Este archivo proporciona funciones auxiliares para trabajar con Supabase
 * en el frontend de forma más simple y consistente.
 * 
 * Uso:
 * 1. Incluye env.js antes de este archivo
 * 2. Incluye el SDK de Supabase desde CDN
 * 3. Usa las funciones helper en tu código
 */

// Inicializar cliente Supabase (solo si window.__ENV está definido)
let supabaseClient = null;

if (window.__ENV && window.__ENV.SUPABASE_URL && window.__ENV.SUPABASE_ANON_KEY) {
    supabaseClient = window.supabase.createClient(
        window.__ENV.SUPABASE_URL,
        window.__ENV.SUPABASE_ANON_KEY
    );
    console.log('✓ Supabase client initialized');
} else {
    console.warn('⚠ Supabase credentials not found in window.__ENV');
}

/**
 * Helper Functions para Autenticación
 */
const SupabaseAuth = {
    /**
     * Registrar nuevo usuario
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña (mínimo 6 caracteres)
     * @returns {Promise} - Promise con resultado
     */
    async signUp(email, password) {
        if (!supabaseClient) {
            throw new Error('Supabase client not initialized');
        }
        
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password
        });
        
        if (error) throw error;
        return data;
    },
    
    /**
     * Iniciar sesión
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña
     * @returns {Promise} - Promise con sesión y usuario
     */
    async signIn(email, password) {
        if (!supabaseClient) {
            throw new Error('Supabase client not initialized');
        }
        
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        // Guardar token en localStorage
        if (data.session) {
            localStorage.setItem('authToken', data.session.access_token);
            localStorage.setItem('userName', data.user.email);
        }
        
        return data;
    },
    
    /**
     * Cerrar sesión
     * @returns {Promise}
     */
    async signOut() {
        if (!supabaseClient) {
            throw new Error('Supabase client not initialized');
        }
        
        const { error } = await supabaseClient.auth.signOut();
        
        if (error) throw error;
        
        // Limpiar localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
    },
    
    /**
     * Obtener usuario actual
     * @returns {Promise} - Promise con usuario actual
     */
    async getCurrentUser() {
        if (!supabaseClient) {
            throw new Error('Supabase client not initialized');
        }
        
        const { data: { user } } = await supabaseClient.auth.getUser();
        return user;
    },
    
    /**
     * Verificar si hay sesión activa
     * @returns {Promise<boolean>}
     */
    async isAuthenticated() {
        try {
            const user = await this.getCurrentUser();
            return !!user;
        } catch (e) {
            return false;
        }
    },
    
    /**
     * Obtener token de sesión actual
     * @returns {string|null}
     */
    getToken() {
        return localStorage.getItem('authToken');
    }
};

/**
 * Helper Functions para Base de Datos
 */
const SupabaseDB = {
    /**
     * Obtener registros de una tabla
     * @param {string} table - Nombre de la tabla
     * @param {object} options - Opciones de consulta
     * @returns {Promise}
     */
    async select(table, options = {}) {
        if (!supabaseClient) {
            throw new Error('Supabase client not initialized');
        }
        
        let query = supabaseClient.from(table).select(options.select || '*');
        
        // Aplicar filtros
        if (options.eq) {
            Object.entries(options.eq).forEach(([key, value]) => {
                query = query.eq(key, value);
            });
        }
        
        // Ordenar
        if (options.orderBy) {
            query = query.order(options.orderBy.column, { 
                ascending: options.orderBy.ascending !== false 
            });
        }
        
        // Límite
        if (options.limit) {
            query = query.limit(options.limit);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
    },
    
    /**
     * Insertar registro
     * @param {string} table - Nombre de la tabla
     * @param {object} record - Datos a insertar
     * @returns {Promise}
     */
    async insert(table, record) {
        if (!supabaseClient) {
            throw new Error('Supabase client not initialized');
        }
        
        const { data, error } = await supabaseClient
            .from(table)
            .insert(record)
            .select();
        
        if (error) throw error;
        return data[0];
    },
    
    /**
     * Actualizar registro
     * @param {string} table - Nombre de la tabla
     * @param {string|number} id - ID del registro
     * @param {object} updates - Datos a actualizar
     * @param {string} idColumn - Nombre de la columna ID (default: 'id')
     * @returns {Promise}
     */
    async update(table, id, updates, idColumn = 'id') {
        if (!supabaseClient) {
            throw new Error('Supabase client not initialized');
        }
        
        const { data, error } = await supabaseClient
            .from(table)
            .update(updates)
            .eq(idColumn, id)
            .select();
        
        if (error) throw error;
        return data[0];
    },
    
    /**
     * Eliminar registro
     * @param {string} table - Nombre de la tabla
     * @param {string|number} id - ID del registro
     * @param {string} idColumn - Nombre de la columna ID (default: 'id')
     * @returns {Promise}
     */
    async delete(table, id, idColumn = 'id') {
        if (!supabaseClient) {
            throw new Error('Supabase client not initialized');
        }
        
        const { error } = await supabaseClient
            .from(table)
            .delete()
            .eq(idColumn, id);
        
        if (error) throw error;
        return true;
    },
    
    /**
     * Contar registros
     * @param {string} table - Nombre de la tabla
     * @param {object} filters - Filtros opcionales
     * @returns {Promise<number>}
     */
    async count(table, filters = {}) {
        if (!supabaseClient) {
            throw new Error('Supabase client not initialized');
        }
        
        let query = supabaseClient.from(table).select('*', { count: 'exact', head: true });
        
        // Aplicar filtros
        if (filters.eq) {
            Object.entries(filters.eq).forEach(([key, value]) => {
                query = query.eq(key, value);
            });
        }
        
        const { count, error } = await query;
        
        if (error) throw error;
        return count;
    }
};

/**
 * Ejemplos de uso:
 * 
 * // Autenticación
 * const user = await SupabaseAuth.signIn('usuario@ejemplo.com', 'password123');
 * const isAuth = await SupabaseAuth.isAuthenticated();
 * await SupabaseAuth.signOut();
 * 
 * // Base de datos
 * const students = await SupabaseDB.select('student', { limit: 10 });
 * const activeStudents = await SupabaseDB.select('student', { eq: { IsActive: true } });
 * const newStudent = await SupabaseDB.insert('student', { FirstName: 'Juan', LastName: 'Pérez' });
 * await SupabaseDB.update('student', 123, { Email: 'nuevo@ejemplo.com' }, 'StudentID');
 * await SupabaseDB.delete('student', 123, 'StudentID');
 * const count = await SupabaseDB.count('student', { eq: { IsActive: true } });
 */

// Exportar para uso global
window.SupabaseAuth = SupabaseAuth;
window.SupabaseDB = SupabaseDB;
window.supabaseClient = supabaseClient;
