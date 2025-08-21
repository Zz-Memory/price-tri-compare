/**
 * PostCSS 配置（ESM 格式）
 * - 本项目 package.json 为 "type": "module"，因此这里使用 export default。
 * - 使用 postcss-px-to-viewport-8-plugin 将 CSS 中的 px 按 375 设计稿转换为 vw，实现移动端流式适配。
 * - 注意：仅处理“构建期”经过 PostCSS 的样式（如 .css、CSS Modules、Tailwind 生成的 CSS）。
 *   JSX 的内联样式 style={{ width: '150px' }} 属于运行时注入，不会经过 PostCSS，因而不会被转换。
 */

export default {
  // PostCSS 插件列表（对象形式注册）
  plugins: {
    // 将 CSS 中的 px 按设计稿宽度转换为 vw
    // 使用兼容 PostCSS 8 的插件名，避免旧版的 deprecation 警告
    'postcss-px-to-viewport-8-plugin': {
      // 需要转换的单位，通常为 'px'
      unitToConvert: 'px',

      // 设计稿的视口宽度：
      // - 你的基准是 375（iPhone 6/7/8 等等），就写 375
      // - 如果后续切换到 750 宽设计稿，这里改为 750
      viewportWidth: 375,

      // 转换后的小数位精度（越大越精细，但会增加 CSS 体积）
      unitPrecision: 6,

      // 需要转换的 CSS 属性：
      // - ['*'] 表示全部属性
      // - 也可写成 ['*', '!border*'] 来排除边框相关
      propList: ['*'],

      // 转换后的视口单位，常用 'vw'
      viewportUnit: 'vw',

      // 字体相关属性使用的视口单位：
      // - 设为 'vw'：字体也会随屏幕宽度等比缩放
      // - 若不希望字体缩放，可改为 'px'
      fontViewportUnit: 'vw',

      // 选择器黑名单：匹配到的选择器将不会被转换
      // - 建议忽略第三方组件库（如 React-Vant 通常以 'rv-' 开头），避免影响其内置样式
      // - 也可加上 'ignore'，便于在业务中按需跳过转换
      selectorBlackList: ['ignore', 'rv-'],

      // 小于或等于该值的 px 不会被转换（常用来保留 1px 发丝线）
      minPixelValue: 1,

      // 是否转换媒体查询中的 px
      mediaQuery: false,

      // 是否直接替换原属性值（true 表示用转换后的值覆盖原 px）
      replace: true,

      // 排除不需要转换的文件（正则/函数/数组均可）
      // - 常见做法是排除 node_modules，避免处理第三方依赖
      exclude: /node_modules/i,

      // 是否对横屏（landscape）进行转换（一般不需要）
      landscape: false
    }
  }
}