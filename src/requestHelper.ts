import axios from 'axios'
import { Store } from './Components/StateManagement/Store'
interface AjaxParams {
    method: string,
    headers: HeadersInit,
    body: any,
    responseType: ResponseType
}

enum ResponseType {
    Text,
    Json,
    FormData,
    Blob,
    ArrayBuffer
}

interface AjaxData {
    status: Status,
    data: any,
    error: string
}

enum Status {
    initial,
    loading,
    error,
    complete
}

async function doRequest(url: string, method: string, params: any, setData: (data: any) => void) {
    setData({ data: null, error: "", status: Status.loading })

    let response = null
    try {
        const headers = {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem("token")
        }

        if(method === "POST") {
            response = await axios.post(url, params, {
                headers: headers
            })
        } else if (method === "GET") {
            response = await axios.get(url, {
                data: params,
                headers: headers
            })
        }

    } catch (error) {
        setData({ status: "error", data: null, error: "Request to " + url + " failed with error: " + error })
        return
    }

    if (response.statusText == "OK") {
        setData({ status: Status.complete, data: response.data, error: "" })
    } else {
        setData({ status: Status.error, data: null, error: "Request to " + url + " failed with status: " + response.status })
    }
}


async function doPromiseRequest(url:string, method:string, params:any) {
    return new Promise((resolve, reject) => {
        doRequest(url, method, params, (remoteData) => {
            if (remoteData.status === Status.complete) {
                resolve(remoteData.data)
            }
            if (remoteData.status === Status.error) {
                reject(remoteData.error)
            }
        })
    })
}

const defaultRemoteData:AjaxData = {status: Status.initial, data: null, error: ""}

export { doRequest, doPromiseRequest, defaultRemoteData, AjaxData, AjaxParams, Status, ResponseType}