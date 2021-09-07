## 什么是window? 什么是document？什么是dom？什么是dom树？
**window**:是一个全局对象，代表浏览器中一个打开的窗口，每个窗口都是一个window对象。

**document**:是window的一个属性，这个属性是一个对象，它代表了当前窗口中的整个网页，通过document对象我们就可以操作整个网页上的所有内容。

**DOM**:定义了访问和操作 HTML文档的标准方法，DOM全称：Document Object Model ，即文档对象模型，所以学习DOM就是学习如何通过document对象操作网页上的内容。

**Dom树**：DOM是文档操作模型，它提供了很多处理HTML文档的API接口。而这个文档可以被看为是一个树结构，树的每个结点表示了一个HTML标签或标签内的文本项。<font color="#FF7043">DOM树结构精确地描述了HTML文档中标签间的相互关联性</font>，将HTML或XML文档转化为DOM树的过程称为解析，HTML文档被解析后，转化为DOM树，因此对HTML文档的处理可以通过对DOM树的操作实现。DOM模型不仅描述了文档的结构，还定义了结点对象的行为，利用对象的方法和属性，可以方便地访问、修改、添加和删除DOM树的结点和内容。
- 元素（element）：文档中的都有标签都是元素，元素可以看成是对象
- 节点（node）：文档中都有的内容都是节点：标签，属性，文本
- 文档（document）：一个页面就是一个文档
- 这三者的关系是：文档包含节点，节点包含元素

## 获取DOM
### 直接获取
```js
		document.getElementById()			//通过ID名获得 , 返回对象
		document.getElementsByClassName()	//通过类名获得 , 返回伪数组
		document.getElementsByName()		//通过name获得 , 返回伪数组
		document.getElementsByTagName()     //通过标签名获得 , 返回伪数组
		document.querySelector()            //通过选择器获取
		document.querySelectorAll()			//通过选择器获取
```
### 获取子元素
```js
			let oDiv = document.querySelector('div')
			//拿到指定元素的所有的子元素
			console.log(oDiv.children)
			//拿到指定的元素的所有的节点
			console.log(oDiv.childNodes)
```
### 获取某元素的特定位置的元素
```js
			let oDiv = document.querySelector('div')
			//拿到指定元素的第一个节点
			console.log(oDiv.firstChild)
			//拿到指定的元素的第一个子元素
			console.log(oDiv.firstElementChild)
			//拿到指定元素的最后一个子节点
			console.log(oDiv.lastChild)
			//拿到指定元素中的最后一个子元素
			console.log(oDiv.lastElementChild)
```
### 拿到某元素的父元素或节点
```js
			let oSpan = document.querySelector('span')
			//拿到指定元素的第一个节点
			console.log(oSpan.parentNode)
			//拿到指定的元素的第一个子元素
			console.log(oSpan.parentElement)
           //parentNode和parentElement通常情况取出来的东西都是一样的，但也存在不同的情况。
```
### 拿到某元素的相邻节点和元素
```js
			let oSpan = document.querySelector('span')
			//获取上一个节点
			console.log(oSpan.previousSibling)
			//获取上一个元素
			console.log(oSpan.previousElementSibling)
			//获取下一个节点
			console.log(oSpan.nextSibling)
			//获取下一个元素
			console.log(oSpan.nextElementSibling)
```

## 操作DOM
### 创建节点
```js
    let oSpan = document.createElement('span')
```
### 增加节点
```js
    let oDiv = document.querySelector('div')
    oDiv.appendChild(oSpan)
    //注意点：appendChild会把节点添加到最后
```
```js
    let oDiv = document.querySelector('div')
    let oP = document.querySelector('p')
    let oSpan = document.createElement('span')
    //想把一个节点插入到另一个节点之前，需要3个参数：父元素 ， 想插入的后面的元素 ， 你创建的元素
    //格式如下： 父元素.insertBefore(你创建的元素 ， 想插入的后面的元素)
    oDiv.insertBefore(oSpan,oP)
```

### 删除节点
```js
    oSpan.parentNode.removeChild(oSpan)
    //在JS中，元素是不能够自杀的，只能通过父元素删自己
```
### 克隆节点
```js
    oDiv.cloneNode()
    //cloneNode默认不会克隆子元素
    oDiv.cloneNode(true)
    //给cloneNode传递true,cloneNode就会把oDiv中的内容也进行复制
```
### 操作节点的内容
```js
	let oDiv = document.querySelector('div')
	oDiv.innerHTML;   //会带标签
	oDiv.innerText;   //会去除两边的空格，但是不带标签
	oDiv.textContent;
```
### 操作元素的样式
#### 添加样式名
```js
	let oDiv = document.querySelector('div')
	oDiv.className = "myClass"       
    //给div添加一个名为myClass的样式名
```
#### 直接操作样式
```js
    oDiv.style.height = 200px
    oDiv.style.width = 200px
    oDiv.style.backgroundColor = 'blue'  
    //横线会变成驼峰命名，JS添加的都是行内样式，优先级最高
```
#### 获取元素样式
```js
console.log(oDiv.style.width)   
//注意点：这个只能获取行内样式 ,获取不了CSS里的样式
let style = window.getComputedStyle(oDiv) //可获得oDiv的CSS样式对象
```

## Dom元素的属性增删改查
### 获取元素的属性
```js
    console.log(oImg.alt)                    
    //对象.属性名获取，这种方法获取不了自定义属性
    console.log(oImg.getAttribute('alt'))    
    //使用对象的方法, getAtrribute('属性名')，可以获取自定义属性
```
### 添加元素的属性
```js
    oImg.title = '新的title'                    
    //对象.属性 可以直接修改属性，但是无法修改自定义属性
    oImg.setAttribute('title','新的title')      //setAttribute('属性名', '属性值') ，这种方式可以自定义属性
```
### 删除元素的属性
```js
    oImg.title = ""                //只能清空自带的属性
    oImg.removeAttribute('title')  //可以清空自定义的属性
```

## 给元素添加事件
### 事件模型
浏览器的事件模型，就是通过监听函数（listener）对事件做出反应。事件发生后，浏览器监听到了这个事件，就会执行对应的监听函数。这是事件驱动编程模式（event-driven）的主要编程方式。

### 给元素添加事件的三种方式
当我们给DOM元素添加点击事件、鼠标移入移除事件、键盘按下抬起事件等等...，都被统称为**给元素添加事件**。

这里以点击事件为例子，来看一下怎么给Dom元素绑定相应的点击事件

- 元素.on...
```js
    oBtn.onclick = function(){
        console.log(123)
    }
    oBtn.onclick = function(){
        console.log(456)
    }
    //只会打印456，这种绑定方式，后面绑的同名的事件会覆盖掉以前的事件
```

- 元素.addEventListener
```js
    oBtn.addEventListener('click',function(){
        console.log(123)
    }，false)
    oBtn.addEventListener('click',function(){
        console.log(456)
    }.true)
    //后面打印的不会覆盖掉前面的同名事件，而是会依次输出
    //并且，事件名称不需要加on
    //只支持最新的浏览器IE9极其以上
    //false（监听函数只在冒泡阶段被触发）
```
- attachEvent
```js
    oBtn.attchEvent("onclick",function(){
        console.log(456)
    })
    //这种方式只适用低版本浏览器
    //后面打印的不会覆盖掉前面的同名事件，而是会依次输出
    //事件名称要加on
```

**兼容封装一下**
```js
   function addEvent(ele,name,fn){
      if(ele.attachEvent){
           ele.attachEvent('on'+ name,fn)
      }else{
           ele.addEventListener(name.fn)
         }
      }
```
### 事件对象event
事件对象就是系统自动创建的一个对象，当注册的事件被触发的时候，系统就会自动创建事件对象
```js
            oBtn.onclick = function(event){
                //兼容性写法
                event = event || window.event
                //高级浏览器：event
                //低级浏览器：window.event
                console.log(event)
            }
```
阻止事件的默认行为
```js
            oA.onclick = function(event){
                //兼容性写法
                event = event || window.event
                console.log(event)
                //高级浏览器的阻止事件默认行为的写法
                event.preventDefault()
                //低级浏览器阻止事件默认行为的写法
                event.returnValue = false
            }
```
```js
            oA.onclick = function(event){
                //兼容性写法
                event = event || window.event
                console.log(event)
                //这才是终极写法,return false就完事了。
                return false
            }
```
### 事件执行的三个阶段
 事件的执行会经过三个阶段：
 - 捕获阶段(由外向内)
 - 目标当前阶段
 - 冒泡阶段(由内向外)
 
 这三个阶段只会有**两个阶段**会被同时执行，要么捕获和当前阶段，要么当前阶段和冒泡阶段。

 **如何设置事件冒泡？**
 通过*addEventListener*来设置事件，*addEventListener*这个方法接收三个参数，一个参数是事件名称，第二个参数是回调函数，第三个参数：*false*---冒泡 / *true*---捕获。

 **如何阻止事件冒泡？**
 ```js
 //高级浏览器
event.stopPropagation
//低级浏览器
event.cancelBubble = true
 ```

 ### 获取事件发生位置
 - offsetX 与 offsetY:事件触发相对于当前元素自身的位置
 - clientX 与 clientY:事件触发相对于当前浏览器可视区域的位置，不包括滚出去的距离.
 - pageX 与 pageY:事件触发相对于整个网页的距离
 - screenX 与 scrrenY:事件触发相对于电脑屏幕的距离

 ### 常见事件操作
 **鼠标移入移出事件**

 ```js
 oDiv.onmouseover = function(){
    console.log('移入事件')
}//onmouseover移入到子元素，则父元素的移入事件也会被触发

oDiv.onmouseenter = function(){
    console.log('移入事件')
}//onmouseenter移入到子元素，但父元素的移入事件不会被触发
//建议使用onmouseenter监听鼠标移入事件


oDiv.onmouseout = function(){
    console.log('移出事件')
}//onmoseout移出到子元素，父元素的移入事件会被触发

oDiv.onmouseleave = function(){
    console.log('移出事件')
}//onmoseleave移出到子元素，父元素的移出事件不会被触发
//建议使用onmouseleave监听鼠标移出事件

oDiV.onmousemove = function(){
    console.log('移动事件')
}
 ```

 **表单输入事件**

 ```js
 oInput.onfocus = function(){
    console.log('获取焦点')
}
oInput.onblur = function(){
    console.log('失去焦点')
}
oInput.onchange = function(){
    console.log('内容变化') //但只有失去焦点了才会触发
}
oInput.oninput = function(){
    console.log('内容变化') //内容一旦改变就会触发，且只有IE9以上的浏览器才能使用
}
//如果在IE9以下，想时时刻刻的获取到用户修改之后的数据，可以通过onpropertychange事件才能实现
 ```

 ## 定时器
 JS中存在两种定时器，一种是**重复执行的定时器**，一种是**只执行一次的定时器**

 **重复执行定时器**
 ```js
			let oDiv = document.querySelector('div')
         let oBtn = document.querySelector('button')
			let timer = null
            //执行定时器
			oDiv.onclick = function(){
				   timer = setInterval(function(){
				   console.log(123)
				},1000)
			}
            //清除定时器
			oBtn.onclick = function(){
				clearInterval(timer)
			}
 ```
 **执行一次定时器**
 ```js
       oDiv.onclick = function(){
				   timer = setTimeOut(function(){
				   console.log(123)
				},1000)
			}
 ```
