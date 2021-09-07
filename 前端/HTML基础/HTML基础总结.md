## HTML定义
超文本标记语言（英语：HyperText Markup Language，简称：HTML）是一种用于创建网页的标准标记语言。

使用 HTML 来建立自己的 WEB 站点，HTML 运行在浏览器上，由浏览器来解析。

## HTML实例
```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>HTML实例</title>
</head>
<body>
    <h1>我的第一个标题</h1>
    <p>我的第一个段落。</p>
</body>
</html>
```
- ```<!DOCTYPE html>```声明为HTML5文档
- ```<html>``` 元素是 HTML 页面的根元素
- ```<head>``` 元素包含了文档的元（meta）数据
- ```<title>``` 元素描述了文档的标题
- ```<body>``` 元素包含了可见的页面内容
- ```<h1>``` 元素定义一个大标题
- ```<p>``` 元素定义一个段落

**注意点**：对于中文网页需要使用 ```<meta charset="utf-8">``` 声明编码，否则会出现乱码。有些浏览器(如 360 浏览器)会设置 GBK 为默认编码，则你需要设置为 ```<meta charset="gbk">```。

**什么是HTML？**：
HTML是一种描述网页的一种语言，HTML 指的是超文本标记语言: HyperText Markup Language，HTML 不是一种编程语言，而是一种标记语言，标记语言是一套标记标签 (markup tag)，HTML 使用标记标签来描述网页
HTML 文档包含了HTML 标签及文本内容，HTML文档也叫做 web 页面

## HTML标签系列
HTML标签的意义在于语义化。

- 标题
```html
<h1>这是一级标题</h1>
<h2>这是二级标题</h2>
<h3>这是三级标题</h3>
```
- 段落
```html
<p>这是一个段落。</p>
<p>这是另外一个段落。</p>
```
- 连接
```html
<a href="https://www.runoob.com">这是一个链接</a>
```

- 图像
*src*指定图片的加载资源，*title*指定标题，*alt*用来表示当图片加载不出来的时候给用户阅读的文字。
```html
<img  src="/images/logo.png" width="258" height="39" title="图片" alt="这是一张图片"/>
```

