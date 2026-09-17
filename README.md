# 赵赵的岛 · 个人主页

一个辛普森风格的个人网站 —— 明黄底色、粗描边、硬投影、圆润字体，加一点点小彩蛋。

## 线上地址

| 平台 | 地址 | 说明 |
| --- | --- | --- |
| Netlify | https://zhaozhaoisland.netlify.app/ | **主站**，访客留言表单在这里生效 |
| GitHub Pages | https://<用户名>.github.io/zhaozhaoisland/ | 代码镜像站，留言表单自动降级为邮件 |

## 目录结构

```
index.html     页面结构（含内联 SVG 插画）
styles.css     全部样式（配色、动画、响应式、深浅主题）
script.js      全部交互（滚动浮现、技能条、导航、灯箱、点击彩蛋、彩虹字、留言表单）
404.html       404 页面
netlify.toml   Netlify 部署与响应头配置
photos/        相册图片目录（默认用插画占位，放真图进去即可）
.nojekyll      让 GitHub Pages 跳过 Jekyll 处理
```

## 页面内容

- **导航**：01 关于我 / 02 我的技能 / 03 我的相册 / 04 找到我
- **技能条**：运动属性 95%、语言表达 95%、英语能力 90%、AI 协作能力（增长中）
- **相册**：6 个相框 + 点击放大灯箱（当前为插画占位）
- **找到我**：邮箱 2872856817@qq.com
- **留言**：右下角悬浮按钮 💌 或联系区的按钮，打开留言弹窗

## 小彩蛋

- 点页面任意位置 → 冒出 🐷🎀🌈😊🎊 五个图案 + 合成「啵」音效
- 站名、大名字、标题会逐字彩虹上色
- 尊重系统的「减少动态效果」设置，开了就自动关闭动画

## 留言表单（重要）

表单用的是 **Netlify Forms**，所以：

- ✅ 在 **Netlify** 上（`*.netlify.app` 或绑定域名）→ 正常提交，留言进 Netlify 后台 **Forms** 页面
- ⚠️ 在 **GitHub Pages** 上 → 没有表单后端，`script.js` 会自动改成**打开邮件草稿**（内容已填好），并提示访客去 Netlify 站留言
- 🖥️ 在**本地**预览 → 只做模拟提交，方便看效果

Netlify 免费额度：每月 100 条留言。查看后台：
https://app.netlify.com/sites/zhaozhaoisland/forms

## 如何更新网站

这个仓库是**唯一源**。改完文件 `git push` 之后：

- **Netlify**：自动重新部署（连着 GitHub 仓库）
- **GitHub Pages**：自动重新部署

两边同时更新，不需要再手动拖 zip。

### 用命令行更新

```bash
git add .
git commit -m "更新内容"
git push
```

### 改完想让访客马上看到新样式？

`styles.css` / `script.js` 的引用带了版本号（例如 `styles.css?v=5`），
改动这两个文件后，把 `index.html` 里的版本号加一，可以避免访客看到旧缓存。

## 放真实照片

把图片放进 `photos/`，然后在 `index.html` 的相册区把占位插画换成：

```html
<img src="photos/我的照片.jpg" alt="照片说明" />
```

## 本地预览

仓库根目录下执行：

```bash
python -m http.server 8765 --bind 127.0.0.1
```

然后打开 http://127.0.0.1:8765/
