# 诉讼保全担保 2.0 · 纯静态版

本仓库为**纯静态 HTML/JS/CSS** 项目，可直接部署到 GitHub Pages，**无需 Node.js**。

## 目录结构

```
index.html          # 导航页
user/               # 投保端 SPA
insurance/          # 机构端 SPA
.nojekyll           # GitHub Pages
```

## 本地预览

```bash
npx serve .
# 或 python3 -m http.server 8080
```

## 演示账号

- 手机号：13800138000 · 密码：123456 · 机构：picc-hn

## GitHub Pages

Settings → Pages → Branch: main → Folder: / (root)

访问：https://<用户名>.github.io/<仓库名>/

数据保存在 localStorage，投保端与机构端同域共享。
