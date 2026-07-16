# 诉讼保全担保 2.0 · 静态原型

本项目是用于产品演示的**纯静态 HTML/CSS/JS 原型**，可直接用浏览器打开预览，也可部署到 GitHub Pages 等静态托管服务。

项目不包含 Vue、React 源码工程、后端接口、数据库或构建配置。当前 `app.js` 为已打包好的静态演示脚本，后续维护应只修改现有 HTML/CSS/JS 文件。

## 目录结构

```
index.html                  # 导航页
user/index.html             # 投保端入口
user/assets/app.js          # 投保端静态脚本
user/assets/style.css       # 投保端样式
insurance/index.html        # 机构端入口
insurance/assets/app.js     # 机构端静态脚本
insurance/assets/style.css  # 机构端样式
.nojekyll                   # GitHub Pages 静态部署标记
```

## 打开方式

### 直接打开

双击 `index.html`，或分别打开 `user/index.html`、`insurance/index.html`。

### 本地 HTTP 预览

```bash
python3 -m http.server 8080
# 访问 http://localhost:8080/
```

投保端与机构端共用 Mock 数据时，需在同一域名下访问；`file://` 下不同页面的浏览器存储可能相互隔离。

## 演示账号

- 手机号：13800138000 · 密码：123456 · 机构：picc-hn

## GitHub Pages

Settings → Pages → Branch: main → Folder: / (root)

访问：https://\<用户名\>.github.io/\<仓库名\>/
