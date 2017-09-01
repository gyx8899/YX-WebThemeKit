## YX-WebThemeKit (网页组件工具包)


Firstly, you can preview all here [YX-WebThemeKit (Home Page)](https://gyx8899.github.io/YX-WebThemeKit/).
(首先，您可以直接移步[YX-WebThemeKit (Home Page)](https://gyx8899.github.io/YX-WebThemeKit/)这里预览)

Secondly, you are suggested to import interested component script code to your page.
(其次，推荐您直接引入脚本标签到您的页面)

----

### Components (组件)

All components could be reused with custom.（所有的组件都可以被通过定制化而重用）

What you should do is simply import `[component-name]-auto.js` to your page.(您需要做的就是引入对应的脚本到你的页面中)

####1. 'theme-header-footer':
##### Copy and apply the header/footer you favorite to anywhere you want. ([福利-开发者] 复制您喜欢的页面头部、脚部，应用到到你想要的页面)
- Find your favorite header/footer; （1. 发现你喜欢的页面头部和脚部；）
- Copy the `html` to your `html` file; (2. 拷贝对应的`html`代码到您自己的`html`文件中；)
- Apply [`headerFooter.js`](https://gyx8899.github.io/YX-WebThemeKit/theme-header-footer/headerFooter.js) rules to your `html` file; (3. 根据[`headerFooter.js`](https://gyx8899.github.io/YX-WebThemeKit/theme-header-footer/headerFooter.js)的要求修改您的`html`文件)
- Import your custom `headerFooter-[name].js` to the anywhere page you want; (4. 引入你修改后的自定义的脚本`headerFooter-[name].js`到你想要的页面。)

```
<!-- Script Theme *** JS -->
<script src="https://gyx8899.github.io/YX-WebThemeKit/theme-header-footer/owl/headerFooter-owl.js"></script>
```

####2. 'fn-pre-loader':
##### Showing loading state before your document ready! ([福利-开发者] 在页面加载相对较慢的网页中，帮助你显示正在加载中的效果)
- Support custom loading image; (1. 支持自定义显示的图片；)
- Support custom animation style; (2. 支持自定义的动画样式；)
- Support custom loaded event to end the loading state; (3. 支持自定义载入成功事件)

```
<!-- Script Preload code *** JS -->
<script src="https://gyx8899.github.io/YX-WebThemeKit/fn-pre-loader/square-split-combination/preLoader-auto.js"></script>
```

####3. 'fn-preview-code': 
##### Help your demo page display code directly; ([福利-开发者] 在您的示例页面，帮您直接显示你的代码，省去查看源代码)
- Just set `data-toggle="previewCode"` and target code displaying tag `data-target="#[targetId]"`; (1. 在要显示的代码标签上，加上`data-toggle="previewCode"` 和 `data-target="#[targetId]"`，[targetId] 是代码要显示的位置标签Id；)
- Optional code title's setting with `data-title="titleAboveCode"`; (2. 可选项，自定义代码显示区域的标题，`data-title="titleAboveCode"`)
```
<!-- Script PreViewCode *** JS-->
<script src="https://gyx8899.github.io/YX-WebThemeKit/fn-preview-code/previewCode-auto.js" defer></script>
```

### Support or Contact

 [Contact support @gyx8899 email](<gyx8899@126.com>) and I will reply as soon as possible.
