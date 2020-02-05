type PurpleTeaEventStore = { [key: string]: PurpleTeaEvent };

interface PurpleTeaEvent extends Event {
  detail?: any;
}

const isProduction = process.env.NODE_ENV === "production",
  isServer = typeof window === "undefined";

const validate = (type: string, event: PurpleTeaEventStore) => {
  if (isProduction) return;
  if (!type) throw "type is required.";
  if (typeof type !== "string") throw "type must be string.";
  if (typeof event[type] === "undefined")
    throw `Store: ${type} isn't existed. Please create it with add("${type}")`;
};

export default !isServer
  ? class PurpleTea extends EventTarget {
      event: { [key: string]: PurpleTeaEvent };
      store: { [key: string]: Object };

      constructor() {
        super();

        this.event = {};
        this.store = {};
      }

      /**
       * Create store.
       * Create a collection of storage which can be used in various collection
       * @param {string} name - Store Name
       * @param {object} initStore - Initial storage value
       */
      add(name: string, initStore = {}) {
        if (typeof this.store[name] !== "undefined" && !isProduction)
          throw `${name} is already existed.`;

        this.event[name] = new Event(name);
        this.store[name] = initStore;
        return initStore;
      }

      /**
       * Get existing store value with given store name.
       * @param {string} name - Store Name
       */
      get(name: string) {
        validate(name, this.event);
        return Object.freeze(this.store[name]);
      }

      /**
       * Set store.
       * Overwrite a storage. Store's value will be overwriten.
       * @param {string} name - Store Name
       * @param {object} value - Value to change or update
       */
      set(name: string, value: Object) {
        validate(name, this.event);

        let event = this.event[name];
        event.detail = value;

        this.store[name] = value;
        this.dispatchEvent(event);
        return this.store[name];
      }

      /**
       * Update store.
       * Mutate storage data, doesn't overwrite existed value if new value is not provided.
       * @param {string} name - Store Name
       * @param {object} value - Value to change or update
       */
      update(name: string, value: Object) {
        validate(name, this.event);

        let event = this.event[name];
        event.detail = value;

        this.store[name] = { ...this.store[name], ...value };
        this.dispatchEvent(event);
        return this.store[name];
      }

      /**
       * Subscribe store.
       * Listen to a storage update, invoke callback when update.
       * @param {string} name - Store Name
       * @param {object} initStore - Initial storage value
       */
      subscribe(name: string, callback: Function) {
        validate(name, this.event);

        return this.addEventListener(name, callback(this.store[name]));
      }
    }
  : class Preload {
      /**
       * Create store.
       * Create a collection of storage which can be used in various collection
       * @param {string} name - Store Name
       * @param {object} initStore - Initial storage value
       */
      add(name: string, initStore = {}) {}

      /**
       * Get existing store value with given store name.
       * @param {string} name - Store Name
       */
      get(name: string) {}

      /**
       * Set store.
       * Overwrite a storage. Store's value will be overwriten.
       * @param {string} name - Store Name
       * @param {object} value - Value to change or update
       */
      set(name: string, value: Object) {}

      /**
       * Update store.
       * Mutate storage data, doesn't overwrite existed value if new value is not provided.
       * @param {string} name - Store Name
       * @param {object} value - Value to change or update
       */
      update(name: string, value: Object) {}

      /**
       * Subscribe store.
       * Listen to a storage update, invoke callback when update.
       * @param {string} name - Store Name
       * @param {object} initStore - Initial storage value
       */
      subscribe(name: string, callback: Function) {}
    };
