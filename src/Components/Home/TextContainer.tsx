import * as React from 'react'
import { Text } from '../StateManagement/Store'
import Actions from '../StateManagement/Actions'



interface Props {
    text: Text
    loggedIn: boolean
    actions: Actions
}

function TextContainer(props: Props) {
    const [textData, updateText] = React.useState({...props.text})

    return <div>
            {!props.loggedIn && <div className="text-container">{textData.txt}</div>}
            
            {props.loggedIn && 
                <div className="text-edit-container">
                    <textarea style={{ width: "100%", minHeight: "300px"}} onChange={(e) => updateText({ ...textData, txt: e.target.value })} value={textData.txt !== null ? textData.txt : ""}> </textarea>
                    <input disabled={props.text.txt === textData.txt} className="saveButton" type="save" value="Lagre" onClick={() => props.actions.updateTextData(textData)} />
                </div>

            }
            </div>

}

export default TextContainer