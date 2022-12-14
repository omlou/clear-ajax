export declare interface ClearAjaxArguments {
  method?:string
  headers?:object
  url:string
  params?:object
  data?:object
  uploadProgress?:(e:object)=>any
  downloadProgress?:(e:object)=>any
  getResponse?:(e:object)=>any
  withCredentials?:boolean
  responseType?:string
  timeout?:number
}
export declare const ajax:(arg:ClearAjaxArguments)=>Promise<any>