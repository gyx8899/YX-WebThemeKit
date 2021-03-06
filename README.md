## YX-WebThemeKit (网页组件工具包)

一. 点击[YX-WebThemeKit (Home Page)](https://gyx8899.github.io/YX-WebThemeKit/)预览;

二. 尝试引入脚本标签到页面，查看意想不到的效果;

----

### 组件列表

**所有的组件都可以被通过定制化而重用**

#### 1. 'theme-header-footer':
##### [福利-开发者专有] 复制你喜欢的页面头部、脚部，应用到到你想要的页面
1. 发现你喜欢的页面头部和脚部；
2. 拷贝对应的`html`代码到你自己的`html`文件中；
3. 根据[`headerFooter.js`](https://gyx8899.github.io/YX-WebThemeKit/theme-header-footer/headerFooter.js)的要求修改你的`html`文件；
4. 引入你修改后的自定义的脚本`headerFooter-[name].js`到你想要的页面；

```javascript
<!-- Script Theme *** JS -->
<script src="https://gyx8899.github.io/YX-WebThemeKit/theme-header-footer/headerFooter-auto.js"></script>
```

#### 2. 'fn-pre-loader':
##### [福利-开发者专有] 在页面加载相对较慢的网页中，帮助你显示正在加载中的效果
1. 支持自定义显示的图片；
2. 支持自定义的动画样式；
3. 支持自定义载入成功事件；

```javascript
<!-- Script Preload code *** JS -->
<script src="https://gyx8899.github.io/YX-WebThemeKit/fn-pre-loader/preLoader.min.js?type=split-ssc"></script>
```

#### 3. 'fn-preview-code': 
##### [福利-开发者专有] 在你的示例页面，帮你直接显示你的代码，省去查看源代码。
1. 在要显示的代码标签上，加上`data-toggle="previewCode"` 和 `data-target="#[targetId]"`，[targetId] 是代码要显示的位置标签Id；
2. 可选项，自定义代码显示区域的标题，`data-title="titleAboveCode"`；
```javascript
<!-- Script PreViewCode *** JS-->
<script src="https://gyx8899.github.io/YX-WebThemeKit/fn-preview-code/previewCode-auto.js" defer></script>
```


 ## YX-WebThemeKit
 
 Firstly, you can preview all here [YX-WebThemeKit (Home Page)](https://gyx8899.github.io/YX-WebThemeKit/).
 
 Secondly, you are suggested to import interested component script code to your page.
 
 ----
 
 ### Components
 
 All components could be reused with custom.
 
 What you should do is simply import `[component-name]-auto.js` to your page.
 
 #### 1. 'theme-header-footer':
 ##### Copy and apply the header/footer you favorite to anywhere you want.
 - Find your favorite header/footer; 
 - Copy the `html` to your `html` file; 
 - Apply [`headerFooter.js`](https://gyx8899.github.io/YX-WebThemeKit/theme-header-footer/headerFooter.js) rules to your `html` file;
 - Import your custom `headerFooter-[name].js` to the anywhere page you want; 
 
 ```javascript
 <!-- Script Theme *** JS -->
 <script src="https://gyx8899.github.io/YX-WebThemeKit/theme-header-footer/headerFooter-auto.js"></script>
 ```
 
 #### 2. 'fn-pre-loader':
 ##### Showing loading state before your document ready! 
 - Support custom loading image;
 - Support custom animation style;
 - Support custom loaded event to end the loading state;
 
 ```javascript
 <!-- Script Preload code *** JS -->
 <script src="https://gyx8899.github.io/YX-WebThemeKit/fn-pre-loader/preLoader.min.js?type=split-ssc"></script>
 ```
 
 #### 3. 'fn-preview-code': 
 ##### Help your demo page display code directly; 
 - Just set `data-toggle="previewCode"` and target code displaying tag `data-target="#[targetId]"`; 
 - Optional code title's setting with `data-title="titleAboveCode"`; 
 ```javascript
 <!-- Script PreViewCode *** JS-->
 <script src="https://gyx8899.github.io/YX-WebThemeKit/fn-preview-code/previewCode-auto.js" defer></script>
 ```
 
 ### Support or Contact
 
  [Contact support @gyx8899 email](<gyx8899@126.com>) and I will reply as soon as possible.

