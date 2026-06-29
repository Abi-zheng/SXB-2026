# 上传到 GitHub 指南

## 1. 上传前检查

确认以下内容**不会**被提交（已在 `.gitignore` 中排除）：

- `node_modules/`
- 各包的 `dist/`
- `.env`（含密钥时）
- `.DS_Store`、本地 IDE 配置

首次上传前可在本地执行：

```bash
npm install
npm run build
```

确保三端能正常构建。

## 2. 创建 GitHub 仓库

1. 打开 https://github.com/new
2. 仓库名建议：`litigation-guarantee-mvp` 或 `ssbao-mvp`
3. 选择 **Public** 或 **Private**
4. **不要**勾选「Add a README」（本地已有）
5. 创建仓库

## 3. 初始化并推送

在项目根目录执行：

```bash
git init
git add .
git status          # 确认无 node_modules、dist
git commit -m "chore: initial litigation guarantee mock MVP prototype"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

使用 SSH：

```bash
git remote add origin git@github.com:<你的用户名>/<仓库名>.git
git push -u origin main
```

## 4. 克隆后他人如何运行

```bash
git clone https://github.com/<你的用户名>/<仓库名>.git
cd <仓库名>
npm install
npm run dev
```

## 5. GitHub Actions

推送至 `main` / `master` 后会自动运行 `.github/workflows/ci.yml`，执行 `npm ci` 与 `npm run build`。

## 6. 常见问题

**Q: 仓库体积过大？**  
A: 确认未误提交 `node_modules`。若已提交，删除后重新 commit：

```bash
git rm -r --cached node_modules
git commit -m "chore: remove node_modules from tracking"
```

**Q: 中文目录名有影响吗？**  
A: GitHub 支持 UTF-8 路径；建议仓库名使用英文，本地文件夹可保持中文。

**Q: 需要 `.env` 吗？**  
A: Mock 原型默认不需要。参考根目录 `.env.example`。
