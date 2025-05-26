class StorageManager {
    constructor(prefix = 'medical_system_') {
        this.prefix = prefix;
        this.storage = window.localStorage;
    }

    /**
     * Set data in localStorage with expiry
     * @param {string} key - Storage key
     * @param {any} value - Data to store
     * @param {number} expiryHours - Hours until data expires
     */
    set(key, value, expiryHours = 24) {
        const item = {
            value,
            timestamp: new Date().getTime(),
            expiry: expiryHours * 60 * 60 * 1000
        };
        this.storage.setItem(this.prefix + key, JSON.stringify(item));
    }

    /**
     * Get data from localStorage
     * @param {string} key - Storage key
     * @returns {any|null} - Stored data or null if expired/not found
     */
    get(key) {
        const item = this.storage.getItem(this.prefix + key);
        if (!item) return null;

        const data = JSON.parse(item);
        const now = new Date().getTime();

        // Check if data has expired
        if (now - data.timestamp > data.expiry) {
            this.remove(key);
            return null;
        }

        return data.value;
    }

    /**
     * Remove data from localStorage
     * @param {string} key - Storage key
     */
    remove(key) {
        this.storage.removeItem(this.prefix + key);
    }

    /**
     * Clear all data with prefix
     */
    clear() {
        Object.keys(this.storage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                this.storage.removeItem(key);
            }
        });
    }

    /**
     * Update existing data
     * @param {string} key - Storage key
     * @param {any} value - New data
     * @returns {boolean} - Success status
     */
    update(key, value) {
        const item = this.get(key);
        if (item === null) return false;

        this.set(key, value);
        return true;
    }

    /**
     * Check if key exists and is not expired
     * @param {string} key - Storage key
     * @returns {boolean}
     */
    exists(key) {
        return this.get(key) !== null;
    }

    /**
     * Get all valid items with prefix
     * @returns {Object} - Key-value pairs of all valid items
     */
    getAllItems() {
        const items = {};
        Object.keys(this.storage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                const value = this.get(key.replace(this.prefix, ''));
                if (value !== null) {
                    items[key.replace(this.prefix, '')] = value;
                }
            }
        });
        return items;
    }
}

// Export for module usage
export default StorageManager; 