import * as React from 'react'

interface Props {
    successMessage: string,
    errorMessage: string
}

function Messages (props: Props) {
    if (props.successMessage != "") {
        return <p className="julenytt-success">{props.successMessage}</p>
    }

    if (props.errorMessage != "") {
        return <p className="julenytt-error">{props.errorMessage}</p>
    }

    return <span></span>
}

export default Messages