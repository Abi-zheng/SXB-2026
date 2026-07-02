# 诉讼保全担保 2.0 · 纯静态版

本仓库为**纯静态 HTML/JS/CSS** 项目，**可直接双击 HTML 打开**，也可部署到 GitHub Pages，**无需 Node.js 运行时**。

## 目录结构

```
index.html          # 导航页（可直接打开）
user/               # 投保端 SPA
insurance/          # 机构端 SPA
.nojekyll           # GitHub Pages
```

## 打开方式

**方式一：直接打开（推荐快速预览）**

双击 `index.html`，或分别打开 `user/index.html`、`insurance/index.html`。

**方式二：本地 HTTP（双端数据共享）**

```bash
python3 -m http.server 8080
# 访问 http://localhost:8080/
```

投保端与机构端共用 Mock 数据时，需在同一域名下访问（file:// 下各页面存储相互隔离）。

## 演示账号

- 手机号：13800138000 · 密码：123456 · 机构：picc-hn

## 从源码更新静态包

在 `_副本` 目录执行：

```bash
npm run build:static
```

产物会同步到本仓库的 `user/` 与 `insurance/`。

## GitHub Pages

Settings → Pages → Branch: main → Folder: / (root)

访问：https://\<用户名\>.github.io/\<仓库名\>/
