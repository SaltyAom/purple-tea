type PurpleTeaEventStore = { [key: string]: PurpleTeaEvent }

interface PurpleTeaEvent extends Event {
    detail?: any
}

type PurpleTeaProcess = "add" | "get" | "update" | "set" | "subscribe"

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
          middleware: Function[]

          constructor() {
              super()

              this.event = {}
              this.store = {}
              this.middleware = []
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
              this.store[name] = this.useMiddleware(initStore, "add")
              return initStore
          }

          /**
           * Get existing store value with given store name.
           * @param {string} name - Store Name
           * @returns {object} Storage value
           */
          get(name: string): any {
              validate(name, this.event)
              return Object.freeze(this.useMiddleware(this.store[name], "get"))
          }

          /**
           * Set store.
           * Overwrite a storage. Store's value will be overwriten.
           * @param {string} name - Store Name
           * @param {object} value - Value to change or update
           * @returns {object} Storage value
           */
          set(
              name: string,
              value: Object
          ): PurpleTea["store"][keyof PurpleTea["store"]] {
              validate(name, this.event)

              let event = this.event[name]
              event.detail = value

              this.store[name] = this.useMiddleware(value, "set")
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
          update(
              name: string,
              value: Object
          ): PurpleTea["store"][keyof PurpleTea["store"]] {
              validate(name, this.event)

              let event = this.event[name]
              event.detail = value

              this.store[name] = this.useMiddleware(
                  {
                      ...this.store[name],
                      ...value
                  },
                  "update"
              )
              this.dispatchEvent(event)
              return this.store[name]
          }

          /**
           * Subscribe store.
           * Listen to a storage update, invoke callback when update.
           * @param {string|string[]} name - Store Name
           * @param {object} initStore - Initial storage value
           */
          subscribe(
              name: string | string[],
              callback: Function
          ): void {
              if (typeof name !== "string")
                  return name.forEach(eachName => {
                      validate(eachName, this.event)

                      return this.addEventListener(eachName, () =>
                          callback(
                              this.useMiddleware(
                                  this.store[eachName],
                                  "subscribe"
                              )
                          )
                      )
                  })

              validate(name, this.event)
              return this.addEventListener(
                  name,
                  () =>
                      callback(
                          this.useMiddleware(
                              this.store[name],
                              "subscribe"
                          )
                      )
              )
          }

          /**
           * Middleware callback
           *
           * @callback MiddlewareCallback
           * @param store - Collection of existing store.
           * @param process - Process name which flow through middleware.
           */

          /**
           * Add middleware to store.
           * @param {MiddlewareCallback} callback - Callback function to manipulate data from middleware.
           */
          applyMiddleware(
              ...callbacks: Array<
                  (
                      store: PurpleTea["store"],
                      process: PurpleTeaProcess
                  ) => PurpleTea["store"]
              >
          ): void {
              callbacks.forEach(callback => this.middleware.push(callback))
          }

          /**
           * Use middleware in an internal storage.
           * @private
           * @param @readonly store - Collection of existing store.
           * @param {"add" | "get" | "update" | "set" | "subscribe"} process - Process name which flow through middleware.
           */
          private useMiddleware(
              store: PurpleTea["store"][keyof PurpleTea["store"]] = this.store,
              process: PurpleTeaProcess
          ): any {
              let currentStore = Object.freeze(store)
              this.middleware.map(
                  runMiddleware =>
                      (currentStore = runMiddleware(currentStore, process))
              )
              return currentStore
          }
      }
    : class PurpleTea {
          event: { [key: string]: PurpleTeaEvent }
          store: { [key: string]: Object }
          /**
           * Create store.
           * Create a collection of storage which can be used in various collection
           * @param {string} name - Store Name
           * @param {object} initStore - Initial storage value
           * @returns {object} Storage value
           */
          add<T>(name: string, initStore: T): T {
              return initStore
          }

          /**
           * Get existing store value with given store name.
           * @param {string} name - Store Name
           * @returns {object} Storage value
           */
          get(name: string): any {
              return {}
          }

          /**
           * Set store.
           * Overwrite a storage. Store's value will be overwriten.
           * @param {string} name - Store Name
           * @param {object} value - Value to change or update
           * @returns {object} Storage value
           */
          set(
              name: string,
              value: Object
          ): PurpleTea["store"][keyof PurpleTea["store"]] {
              return {}
          }

          /**
           * Update store.
           * Mutate storage data, doesn't overwrite existed value if new value is not provided.
           * @param {string} name - Store Name
           * @param {object} value - Value to change or update
           * @returns {object} Storage value
           */
          update(
              name: string,
              value: Object
          ): PurpleTea["store"][keyof PurpleTea["store"]] {
              return {}
          }

          /**
           * Subscribe store.
           * Listen to a storage update, invoke callback when update.
           * @param {string|string[]} name - Store Name
           * @param {object} initStore - Initial storage value
           */
          subscribe(name: string | string[], callback: Function): void {}

          /**
           * Middleware callback
           *
           * @callback MiddlewareCallback
           * @param store - Collection of existing store.
           * @param process - Process name which flow through middleware.
           */

          /**
           * Add middleware to store.
           * @param {MiddlewareCallback} callback - Callback function to manipulate data from middleware.
           */
          applyMiddleware(
              ...callbacks: Array<
                  (
                      store: PurpleTea["store"],
                      process: PurpleTeaProcess
                  ) => PurpleTea["store"]
              >
          ): void {}
      }
