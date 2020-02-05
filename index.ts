type PurpleTeaEventStore = { [key: string]: PurpleTeaEvent }

interface PurpleTeaEvent extends Event {
    detail?: any
}

const isProduction = process.env.NODE_ENV === "production",
    isServer = typeof window === "undefined"

const validate = (type: string, event: PurpleTeaEventStore) => {
    if (isProduction) return
    if (!type) throw "type is required."
    if (typeof type !== "string") throw "type must be string."
    if (typeof event[type] === "undefined")
        throw `Store: ${type} isn't existed. Please create it with add("${type}")`
}

export default !isServer
    ? class PurpleTea extends EventTarget {
          event: { [key: string]: PurpleTeaEvent }
          store: { [key: string]: Object }

          constructor() {
              super()

              this.event = {}
              this.store = {}
          }

          /**
           * Create store.
           * Create a collection of storage which can be used in various collection
           * @param {string} name - Store Name
           * @param {object} initStore - Initial storage value
           * @returns {object} Storage value
           */
          add<T>(name: string, initStore: T): T {
              if (typeof this.store[name] !== "undefined" && !isProduction)
                  throw `${name} is already existed.`

              this.event[name] = new Event(name)
              this.store[name] = initStore
              return initStore
          }

          /**
           * Get existing store value with given store name.
           * @param {string} name - Store Name
           * @returns {object} Storage value
           */
          get(name: string): any {
              validate(name, this.event)
              return Object.freeze(this.store[name])
          }

          /**
           * Set store.
           * Overwrite a storage. Store's value will be overwriten.
           * @param {string} name - Store Name
           * @param {object} value - Value to change or update
           * @returns {object} Storage value
           */
          set(name: string, value: Object): any {
              validate(name, this.event)

              let event = this.event[name]
              event.detail = value

              this.store[name] = value
              this.dispatchEvent(event)
              return this.store[name]
          }

          /**
           * Update store.
           * Mutate storage data, doesn't overwrite existed value if new value is not provided.
           * @param {string} name - Store Name
           * @param {object} value - Value to change or update
           * @returns {object} Storage value
           */
          update(name: string, value: Object): any {
              validate(name, this.event)

              let event = this.event[name]
              event.detail = value

              this.store[name] = { ...this.store[name], ...value }
              this.dispatchEvent(event)
              return this.store[name]
          }

          /**
           * Subscribe store.
           * Listen to a storage update, invoke callback when update.
           * @param {string} name - Store Name
           * @param {object} initStore - Initial storage value
           */
          subscribe(name: string, callback: Function): void {
              validate(name, this.event)

              this.addEventListener(name, () => callback(this.store[name]))
          }
      }
    : class Preload {
          /**
           * Create store.
           * Create a collection of storage which can be used in various collection
           * @param {string} name - Store Name
           * @param {object} initStore - Initial storage value
           * @returns {object} Storage value
           */
          add<T>(name: string, initStore: T): T { return initStore }

          /**
           * Get existing store value with given store name.
           * @param {string} name - Store Name
           * @returns {object} Storage value
           */
          get(name: string): any { return {} }

          /**
           * Set store.
           * Overwrite a storage. Store's value will be overwriten.
           * @param {string} name - Store Name
           * @param {object} value - Value to change or update
           * @returns {object} Storage value
           */
          set(name: string, value: Object): any { return {} }

          /**
           * Update store.
           * Mutate storage data, doesn't overwrite existed value if new value is not provided.
           * @param {string} name - Store Name
           * @param {object} value - Value to change or update
           * @returns {object} Storage value
           */
          update(name: string, value: Object): any { return {} }

          /**
           * Subscribe store.
           * Listen to a storage update, invoke callback when update.
           * @param {string} name - Store Name
           * @param {object} initStore - Initial storage value
           */
          subscribe(name: string, callback: Function): void {}
      }
