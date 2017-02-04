
export var localStorageEnabled = function() {
    var mod = 'modernizr';
    try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
    } catch(e) {
        return false;
    }
};

export var deleteLocalStorage = function(key) {
    if (!localStorageEnabled()) return false;
    localStorage.removeItem(key);
    return true;
};

export var setLocalStorage = function(key, value) {
    if (!localStorageEnabled()) return false;
    localStorage[key] = value;
    return true;
};

export var getLocalStorage = function(key) {
    if (!localStorageEnabled()) return false;
    var result = localStorage[key] || false;
    return result;
};

export var storage = {
    enabled: () => { return localStorageEnabled() },
    get: (key) => { return getLocalStorage(key) },
    set: (key, value) => { return setLocalStorage(key, value) },
    delete: (key) => { return deleteLocalStorage(key) },
    remove: (key) => { return deleteLocalStorage(key) },
};
