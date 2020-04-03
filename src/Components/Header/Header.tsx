import * as React from 'react'

interface Props {
    year: number
}

function Header(props: Props) {
    return <div className="julenytt-headerimage">
            <div id="snow"></div>
            <h1>Julenytt {props.year}</h1>
            </div>

}

export default Header




