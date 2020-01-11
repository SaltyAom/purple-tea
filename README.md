# Purple Tea
Light-weight state container for JavaScript app.
  
## Store which doesn't hurt.
Purple Tea is very light-weight state container for JavaScript app. It contain shared state for JavaScript add to access on any piece of code.  
Purple tea is inspired by Redux but with only a simple and handy logic. Under the hood, it use a simple collection of JavaScript API which supported since IE 8.
  
  Purple Tea feature:
  * A very light-weight storage: 0.5 KB (gzipped)
  * Readable error message, easier to debug.
  * Redux syntax like but simpler
  * Subscribe to storage.
  * TypeScript support.
  * Support on every browser even IE11.

## Readable error
One thing people most hate about, `unreadable error` by human. It's very annoying yet not productive to anyone.  
Purple tea error is readable by human and suggested a way to resolve.
```javascript
let tea = new PurpleTea()

// Create "sugar" store with initial value of { amount: 0 }

tea.add("sugar", { amount: 0 }) // { amount: 0 }
tea.add("sugar", { amount: 0 }) // sugar is already existed.
```
## A simple way to create store
Purple Tea is very easy to be created, maintained, and debugged. It's just a collection of simple API under the hood.

### Create Store
Let's create a simple store with Purple Tea.  
Purple Tea is created with class to contain reusable collection of function.
```javascript
import PurpleTea from "purple-tea"

let tea = new PurpleTea()
```
`add()` will handle storage creation. It require `name` and `initial storage value`.
```javascript
let tea = new PurpleTea()

tea.add("sugar", { amount: 0 })
```
This will create a store name "sugar" with initial value of `{ amount: 0 }`.
  
### Get data
`get()` is introduced here, to retrieve data in the storage.
```javascript
let tea = new PurpleTea()

tea.add("sugar", { amount: 0 })

tea.get("sugar")         // { amount: 0 }
tea.get("sugar").amount  // 0
```
If you get data from storage which isn't existed, it'll return error.
```javascript
let tea = new PurpleTea()

tea.get("sugar") // sugar isn't existed. Please create it with add("sugar")

tea.add("sugar", { amount: 0 })
tea.get("sugar") // { amount: 0 }

tea.get("salt") // salt isn't existed. Please create it with add("sugar")
```
  
## Update store
To update storage, `update()` is recommended. It take `store name` and `value`.
```javascript
let tea = new PurpleTea()

tea.add("sugar", { amount: 0 })
tea.get("sugar") // { amount: 0 }

tea.update("sugar", { amount: 1 })
tea.get("sugar") // { amount: 1 }
```
  
## Subscribe to the storage
Purple tea is able to subscribe to the storage change in real-time.
```javascript
import PurpleTea from "./purple.ts"

let tea = new PurpleTea()

tea.add("sugar", { amount: 0 })

// Trigger when update() is called.
tea.subscribe("sugar", data => {
    console.log(data) // Get current value of sugar. eg. { amount: 1 }
})

tea.update("sugar", { amount: 1 })
```