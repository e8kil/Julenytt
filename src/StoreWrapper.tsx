import * as React from 'react'
import BaseStore from './BaseStore'

interface Props<T> {
    store: BaseStore<T>
    render: (storeData:T) => React.ReactNode
}

interface State<T> {
    storeData: T
}

class StoreWrapper<T> extends React.Component<Props<T>, State<T>> {

    constructor(props: Props<T>) {
        super(props)
        this.state = {
            storeData: this.props.store.getData()
        }
        this.storeUpdate = this.storeUpdate.bind(this)
    }

    storeUpdate() {
        this.setState({storeData: this.props.store.getData()})
    }

    componentDidMount() {
        this.props.store.subscribe(this.storeUpdate)
    }

    componentWillUnmount() {
        this.props.store.unsubscribe(this.storeUpdate)
    }

    render() {
        return this.props.render(this.state.storeData)
    }

}

export default StoreWrapper