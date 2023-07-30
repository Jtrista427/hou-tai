SVG图标的使用
<svg style="height">
<use xlink:href="#icon-xxx" fill="red"></use> 属性值以#icon开头,可以更改大小和颜色，建议直接封装成组件，这样可以直接使用
</svg>


使用element-plus自己就有的规则
const rules = {
    username: [//{
        //     required: true, //必须校验
        //     massage: '用户名不能为空',
        //     trigger: 'blur', //触发的时机，失去焦点的时候
        // },
        // 控制最小位数就已经控制不为空了,可以写多个规则
        {
            required: true,
            min: 6,
            max: 10,
            message: '用户名长度应该在6-10之间',
            trigger: 'change' //文本发生变化
        }
    ],
    password: [{
        required: true,
        min: 6,
        message: '密码长度应该至少为6位',
        trigger: 'change' //文本发生变化
    }]
}


面包屑是根据匹配到的路由进行添加的

router-view只能展示二级路由！

刷新按钮，这里的操作不是简单的重新获取数据，而是采用先销毁main组件内容，然后再重新创建

退出登录，保存路由路径，登录进来仍然在这个页面，而不总是首页

可以直接操作pinia中的state数据，而不需要通过store

浅拷贝和深拷贝
这是浅拷贝的深层属性修改会影响原对象，原对象的相应属性也会被修改，因为他们都指向同一个地址！而深拷贝则不会

SPU和SKU
SPU：电商术语，代表一个标准化产品单元，比如华为这个

SKU：库存量

自定义事件的触发
let $emit = defineEmits(['changeScene'])
const cancel = () => {
    $emit('changeScene', 0)
}

数据大屏适配解决方案
1. vw和vh单位，不能解决文字的自适应问题,需要自己计算
2.scale缩放样式，不需要自己计算，但是容易出现边边空白
scale缩放样式是以该盒子的中心点缩放的
首先将缩放点移至屏幕中心
.box{
    transform-origin:left top
    position:fixed
    left:50%
    top:50%
}

屏幕尺寸变化了
box.style.transform=`sacle(${getScale()}) translate(-50%,-50%)`
function getScale(w=1920,h=1080){
    const ww=window.innerWidth/w
    const wh=window.innerHidth/h
    return Math.min(ww,wh)

}

菜单权限和按钮权限：
一、目前整个项目一共多少个路由！！！
login(登录页面)、
404(404一级路由)、
任意路由、
首页(/home)、
数据大屏、
权限管理(三个子路由)
商品管理模块(四个子路由)

1.1开发菜单权限
---第一步:拆分路由
静态(常量)路由:大家都可以拥有的路由
login、首页、数据大屏、404

异步路由:不同的身份有的有这个路由、有的没有
权限管理(三个子路由)
商品管理模块(四个子路由)

任意路由:任意路由

1.2菜单权限开发思路
对于每一个用户，根据他的权限对异步路由数据进行过滤
function filterAsyncRoute(asyncRoutes,routes){
    asyncRoutes.filter(item=>{
        if routes.includes(item.name){ //一级路由
            if(item.children && item.children.length>0){ \\二级路由
                item.children=filterAsyncRoute(item.children,routes) //这里改变了原数组，所以需要深拷贝
            }
            return true
        }
    })
}

当时在仓库里面保存了路由以展示菜单，那么接下来就可以在这里过滤
注意要深拷贝！

对于buttons权限控制
在仓库中存储之后，需要去每个组件中使用v-if判断
或者创建自定义指令

因为在仓库中进行了路由过滤，菜单路由初始化为静态路由，所以一定要调用userinfo函数，以让他获得正确的路由
