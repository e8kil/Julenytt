
class BaseStore<State> {

    protected eventListeners:any = []
    protected state:State
   
    subscribe(func:any) {
        this.eventListeners.push(func)
    }

    notify() {
        this.eventListeners.forEach ((func:any) => {
            func()
        })
    }

    unsubscribe(func:any) {
        this.eventListeners = this.eventListeners.filter ((i:any) => { i !== func})
    }
    
    setState(data: Partial<State>) {
        this.state = Object.assign({}, this.state, data)
        this.notify()
    }

    getData():State {
        return this.state
    }

}

export default BaseStore