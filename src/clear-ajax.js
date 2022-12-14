(function(root,factory){
	if(typeof(module)==='object'&&typeof(module.exports)==='object'){
		module.exports=factory()
	}else if(typeof(exports)==='object'){
		exports=factory()
	}else if(typeof(root)==='object'){
		root["ajax"]=factory()["ajax"]
	}else if(typeof(window)==='object'){
		window["ajax"]=factory()["ajax"]
	}else{
		console.warn('clear-ajax startup failure.')
	}
})(this,function(){
	function getUrlParam(url,data){ // 处理参数字符串
		if(!data){return ""}
		var paramsstr=data instanceof Object ? getQueryString(data) : data
		return (url.indexOf('?')!==-1)?'&'+paramsstr:'?'+paramsstr
	}
	function getPostParam(data){ // 处理post请求参数
		if(!data){return null}
		if((typeof data === "string")||(data instanceof FormData)){
			return data
		}
		return getQueryString(data)
	}
	function getQueryString(data){ // 将参数对象转换为参数字符串
		let paramsarr=[]
		if (data instanceof Object) {
			for(let i in data){
				paramsarr.push(encodeURIComponent(i)+'='+encodeURIComponent(data[i]))
			}
		}
		return paramsarr.join('&')
	}
	function ajax(msg){ // 发送ajax请求
		return new Promise(promiseFunc)
		function promiseFunc(resolve,reject){
			var xhr=new XMLHttpRequest()
			// 请求结果返回处理
			xhr.addEventListener('load',e=>{
				if(msg.getResponse){
					var responseobj={}
					var response=xhr.getAllResponseHeaders().split('\r\n')
					for(let item of response){
						let itemarr=item.split(": ")
						if(itemarr[0])responseobj[itemarr[0]]=itemarr[1]
					}
					msg.getResponse(responseobj)
				}
				var {status}=xhr
				if(status==200){
					resolve(xhr.response)
				}else{
					reject({
						status,
						result:xhr,
						error:e
					})
				}
			})
			xhr.addEventListener('error', e => {
				reject({
					status:xhr.status,
					result:xhr,
					error:e
				})
			})
			xhr.addEventListener('timeout', e => {
				reject({
					status:xhr.status,
					result:xhr,
					error:e
				})
			})
			// 添加上传进度监听
			if(msg.uploadProgress){
				xhr.upload.addEventListener('loadstart',e=>{
					msg.uploadProgress(e)
				})
				xhr.upload.addEventListener('progress',e=>{
					msg.uploadProgress(e)
				})
				xhr.upload.addEventListener('load',e=>{
					msg.uploadProgress(e)
				})
				xhr.upload.addEventListener('loadend',e=>{
					msg.uploadProgress(e)
				})
				xhr.upload.addEventListener('error',e=>{
					msg.uploadProgress(e)
				})
			}
			// 添加下载监听
			if(msg.downloadProgress){
				xhr.addEventListener('loadstart',e=>{
					msg.downloadProgress(e)
				})
				xhr.addEventListener('progress',e=>{
					msg.downloadProgress(e)
				})
				xhr.addEventListener('loadend',e=>{
					msg.downloadProgress(e)
				})
			}
			// 请求参数处理
			var type=msg.method
			var {url,params={},data={},headers,timeout,responseType,withCredentials}=msg
			var simrequ=false // 默认不是简单请求
			if(!type){
				type="GET"
			}else{
				type=type.toUpperCase()
			}
			if((new Set(['GET','DELETE','HEAD','OPTIONS','TRACE'])).has(type))simrequ=true
			url+=getUrlParam(url,params)
			xhr.open(type,url,true)
			if(withCredentials!==undefined)xhr.withCredentials=withCredentials // 该参数控制请求是否携带cookie
			xhr.responseType=(responseType||"json")
			for(let i in headers){ // 读取headers参数
				xhr.setRequestHeader(i,headers[i])
				i=i.toLowerCase()
			}
			if(!((headers&&headers['content-type'])||(data.constructor.name=="FormData"))){ // 没有传Content-Type，也不是formdata
				xhr.setRequestHeader('content-type','application/x-www-form-urlencoded;charset=UTF-8')
			}else if((headers&&headers['content-type'])&&(headers['content-type'].indexOf('application/json')!==-1)&&(data instanceof Object)){
				data=JSON.stringify(data)
			}
			xhr.timeout=(timeout||60000)
			xhr.send(simrequ?null:getPostParam(data))
		}
	}
	return {ajax}
})