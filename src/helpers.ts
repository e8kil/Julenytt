import { Status } from "./requestHelper"
import { useHistory } from "react-router-dom";

const getUniqueBy = (arr:any[], column:string) => {
    
    return [...new Set(arr.map(x => x[column]))]
}

const loadingOrInitial = (status:Status) => {
    if (status === Status.loading || status === Status.initial) {
        return true
    }
    return false
}

const errorStatus = (status:Status) => {
    return status === Status.error
}

const completeStatus = (status:Status) => {
    return status === Status.complete
}

const shortName = (maxLength:number, name:string) => {
  if (name.length > maxLength) {
    return name.substr(0, maxLength) + "..."
  }
  return name 
}

const move = (arr:any[], from:number, to:number) => {
    arr.splice(to, 0, arr.splice(from, 1)[0]);
}

const dateFormatter = (date:string) => {
    if (date == null) {
        return ""
    }
    
    const d = new Date(date)
    
    return d.getFullYear() + "-" + doubleDigit(d.getMonth()) + "-" + doubleDigit(d.getDay()) + " " + doubleDigit(d.getHours()) + ":" + doubleDigit(d.getMinutes())
}

const doubleDigit = (nb:number) => {
    return ("0" + nb).slice(-2)
}

const history = (path:string) => {
    let h = useHistory()
    h.push(path)
}

export {getUniqueBy, loadingOrInitial, errorStatus, completeStatus, shortName, move, dateFormatter, doubleDigit, history}