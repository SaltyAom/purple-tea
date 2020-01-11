type PurpleTeaEventStore = { [key: string]: PurpleTeaEvent }

interface PurpleTeaEvent extends Event {
	detail?: any
}

let validate = (type: string, event: PurpleTeaEventStore) => {
    if (!type) throw "type is required."
    if (typeof type !== "string") throw "type must be string."
    if (typeof event[type] === "undefined")
        throw `Store: ${type} isn't existed. Please create it with add("${type}")`
}

export default class PurpleTea extends EventTarget {
	event: { [key: string]: PurpleTeaEvent }
	store: { [key: string]: Object }

	constructor() {
		super()

		this.event = {}
		this.store = {}
	}

	add(name: string, initStore = {}) {
        if(typeof this.store[name] !== "undefined") throw(`${name} is already existed.`)

		this.event[name] = new Event(name)
		this.store[name] = initStore
		return initStore
	}

	update(storeName: string, value: Object) {
        validate(storeName, this.event)

		let event = this.event[storeName]
		event.detail = value

        this.store[storeName] = value
		this.dispatchEvent(event)
		return this.store[storeName]
	}

	subscribe(name: string, callback: any) {
        validate(name, this.event)
		return this.addEventListener(name, () => {
			callback(this.store[name])
		})
	}

	get(name: string) {
        validate(name, this.event)
		return Object.freeze(this.store[name])
    }
}