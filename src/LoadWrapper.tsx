import * as React from 'react'
import { Status } from './requestHelper'
import { loadingOrInitial, completeStatus } from './helpers'
import Loader from './Loader'

interface Props {
    statusList: Status[]
    hideLoaderOnInitialStatus?: boolean
}

const LoadWrapper: React.FunctionComponent<Props> = props => {

    let loading = props.statusList.some((x:Status) => props.hideLoaderOnInitialStatus ? x == Status.loading : loadingOrInitial(x))
    let complete = props.statusList.every((x:Status) => completeStatus(x))

    if (loading) {
        return <Loader />
    } else if (complete) {
        return <div>{props.children}</div>
    } else {
        return <span></span>
    }
}

export default LoadWrapper