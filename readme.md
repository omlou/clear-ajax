### 介绍

前端发送 ajax 请求的工具

### 使用

#### 在传统项目中使用

```html
<script src="https://gitee.com/xlou/clear-ajax/raw/master/dist/clear-ajax.min.js"></script>
<!-- 建议下载下来使用 -->
<script>
  /* 引入了该 js 文件后，会在 window 上赋值 ajax 对象 */
  ajax({
    url:"https://www.xxx.com",
    params:{
      id:1
    }
  })
  .then(res=>{})
</script>
```

#### 在 Vue 、React 和 Angular 等 node 项目中使用

安装

``` bash
npm i clear-ajax -S
```

main.js / main.ts 中使用

``` javascript
import {ajax} from 'clear-ajax'

ajax({
  url:"https://www.xxx.com",
  params:{
    id:1
  }
})
```

### API

arguments：

|参数名|是否必选|默认值|类型|解释|
|----|----|----|----|----|
|method|否|"get"|string|请求类型，值不区分大小写|
|headers|否|系统默认|object|请求头参数|
|url|是||string|请求地址|
|params|否||object|会转换为地址栏参数（query string）|
|data|否||object|body 体参数|
|uploadProgress|否||(e:object)=>any|监听上传文件的进度|
|downloadProgress|否||(e:object)=>any|监听下载文件的进度|
|getResponse|否||(e:object)=>any|获取返回头参数|
|withCredentials|否|false|boolean|获取返回头参数|
|responseType|否|"json"|string|指定返回数据的类型|
|timeout|否|60|number|设置响应超时时间|