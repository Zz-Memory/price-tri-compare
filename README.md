# 货三家（price-tri-compare）App

## 一、项目描述
"货三家"（price - tri - compare）是一款基于 React 开发、模仿 "慢慢买" 的比价 App。该项目使用 Mock.js 模拟数据，秉持着符合当代人性价比购物的思想，旨在解决人们买东西前需货比三家、来回切换多个购物平台比价的麻烦，让用户在一个软件上就能对同一商品在多个平台的价格进行比较，轻松应对购物比价的燃眉之急。

## 二、项目技术栈
### Vite
- 使用Vite进行快速开发
- 通过vite.config.js文件配置别名与代理

### React 19 全家桶
- React 组件开发
- 组件的封装
- 第三方组件库React-Vant
- 受控与非受控组件
- Hooks编程 
  - 自定义Hooks
- React-Router-DOM
  - 路由守卫
- 懒加载
- Zustand
  - 进行方便快捷的状态管理

### 原子css
- 使用Tailwind CSS进行原子化CSS
- 无需编写CSS代码，通过组合类名生成符合设计风格的CSS

### Mock.js
- 数据模拟，提供接口数据

### Axios
- HTTP请求库，处理API调用
- 与Mock.js配合使用，进行请求拦截和代理

### Recharts
- 图表库，用于价格走势图展示，快捷实现数据可视化的展现
- Recharts基于React组件的可组合图表库，与React完美集成
- 可以直观展示对比多平台商品的价格走势

### px-to-viewport
- 让 CSS 响应式适配各种设备像素比

### LLM
- LLM
  - chat
  - 生图
  - 语音
  - coze 工作流调用
  - 流式输出

### JWT鉴权
- 使用JWT进行身份校验
- 实现权限路由，只有登录之后才能访问某些页面

## 三、项目架构
src/
├── components/     # 通用组件
├── pages/         # 页面组件
├── hooks/         # 自定义Hooks
├── services/      # API服务层
├── mock/          # Mock数据
├── store/         # Zustand状态管理
└── utils/        # 工具函数

## 四、页面组件
### 首页 (HomePage)
- 搜索框组件
- 导航菜单组件
- 商品推荐列表组件
  - 支持筛选功能（可按照平台和商品种类进行筛选）
  - 分为列表（详细信息）和瀑布流（简略信息）两种展示模式
- 底部导航栏组件（首页、省钱攻略、AI助手、收藏、我的）

### 搜索页面 (SearchPage)
- 搜索历史组件
- 搜索联想组件（Mock.js模拟数据）
- 搜索结果列表组件（Mock.js模拟数据）

### 商品详情页 (ProductDetailPage)
- 商品信息组件
- 多平台价格走势图组件（带平台选择复选框，支持实时切换显示不同平台价格曲线）
- 评论组件

### 省钱攻略页面 (SavingTipsPage)
- 省钱技巧文章组件

### AI助手页面 (AIAssistantPage)
- 智能对话组件

### 收藏页面 (FavoritesPage)
- 收藏商品列表组件
- 分类筛选组件
- 批量操作组件

### 我的 (ProfilePage)
- 商品收藏入口
- 用户信息组件
  - 用户头像
    - AI自动生成头像
    - 用户上传头像
  - 用户昵称
  - 用户等级
- 浏览历史组件
- 设置组件

### 未开发页面 (ToDoPage)
- TODO页面（作为未实现功能的统一展示页面）

### 404页面 (404Page)
- 用于展示错误路由跳转的页面

## 五、项目亮点与难点
### 骨架屏
利用Skeleton组件来实现骨架屏，提升用户体验，避免白屏加载导致用户产生焦虑感
### 图片懒加载
商品图片的按需加载，节省流量，提高用户体验
### 瀑布流
为了使商品列表更加美观，采用了瀑布流布局
### 移动端适配
使用pxToViewport来进行移动端适配
### 防抖节流
手写一个防抖节流，运用防抖节流优化性能
### SPA 单页应用
为用户带来流畅的页面切换体验，减少页面白屏时间
### AI 生图
通过 AI 生成头像
### AI 聊天
通过 AI 生成聊天内容


## 六、安装依赖

### 生产依赖
```bash
# 路由
pnpm install react-router-dom

# UI组件库
pnpm install react-vant

# 状态管理
pnpm install zustand

# HTTP请求
pnpm install axios

# 数据模拟（由于项目完全使用Mock.js，即使在生产环境也需要）
pnpm install mockjs

# JWT前端鉴权
pnpm install jsonwebtoken  # 用于生成和验证JWT令牌

# React专用图表库
pnpm install recharts

# Tailwind CSS 原子化CSS
pnpm install tailwindcss @tailwindcss/vite

# 一次安装
pnpm install react-router-dom react-vant zustand axios mockjs jsonwebtoken recharts tailwindcss @tailwindcss/vite

```


### 开发依赖
```bash
# 移动端适配
pnpm install -D postcss-px-to-viewport

```