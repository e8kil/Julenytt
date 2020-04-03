import axios from 'axios'

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
        if(method === "POST") {
            response = await axios.post(url, params)
        } else if (method === "GET") {
            response = await axios.get(url, params)
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


// async function doRequest(url:string, params:AjaxParams, setData:(data:any) => void) {
//     setData({data: null, error: "", status: Status.loading})

//     let response = null
//     try {
//         response = await fetch(url, {params})
//     } catch (error) {
//         setData({status: "error", data: null, error: "Request to " + url + " failed with error: " + error})
//         return
//     }   

//     if (response.ok) {
//         let responseData:any = ""
//         try {
//             switch (params.responseType) {
//                 case ResponseType.ArrayBuffer: 
//                     responseData = await response.arrayBuffer()
//                 break; 
//                 case ResponseType.Text: 
//                     responseData = await response.text()
//                 break; 
//                 case ResponseType.Blob: 
//                     responseData = await response.blob()
//                 break; 
//                 case ResponseType.Json: 
//                     responseData = await response.json()
//                 break;                    
//             }
//         } catch (error) {
//             setData({status: Status.error, data: null, error: "Failed to parse response data into " + params.responseType + ". Error: " + error})
//         }        
//         setData({status: Status.complete, data: responseData, error: ""})            
//     } else {
//         setData({status: Status.error, data: null, error: "Request to " + url + " failed with status: " + response.status})
//     }
// }

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