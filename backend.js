// Simple localStorage-based backend shim for dev/demo
(function(){
    const STORAGE_KEYS = {
        users: 'ni_users',
        logs: 'ni_event_logs'
    };

    function load(key, fallback){
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    }

    function save(key, value){
        localStorage.setItem(key, JSON.stringify(value));
    }

    function getUsers(){
        return load(STORAGE_KEYS.users, {}); // username -> user
    }

    function setUsers(map){
        save(STORAGE_KEYS.users, map);
    }

    function nowIso(){
        return new Date().toISOString();
    }

    window.backend = {
        registerUser(user){
            const users = getUsers();
            if (users[user.username]) {
                return { ok: false, error: 'USERNAME_EXISTS' };
            }
            users[user.username] = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                password: user.password,
                linkedin: user.linkedin || null,
                createdAt: nowIso()
            };
            setUsers(users);
            this.logEvent('user_created', { username: user.username });
            return { ok: true };
        },

        authenticate(username, password){
            const users = getUsers();
            const u = users[username];
            if (!u) return { ok: false, error: 'NOT_FOUND' };
            if (u.password !== password) return { ok: false, error: 'BAD_PASSWORD' };
            this.logEvent('user_login', { username });
            return { ok: true, user: u };
        },

        logEvent(type, data){
            const logs = load(STORAGE_KEYS.logs, []);
            logs.push({ type, data, at: nowIso() });
            save(STORAGE_KEYS.logs, logs);
        },

        getLogs(){
            return load(STORAGE_KEYS.logs, []);
        }
    };
})();



