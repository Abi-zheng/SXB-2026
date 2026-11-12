# 诉讼保 · 网站配置说明

无依赖、无需构建的中文响应式服务网站。当前首页采用对话优先的布局：品牌介绍、嵌入式问答、需求引导与服务路径；机构与资讯内容集中在各自栏目。

## 预览

在本目录运行 `python3 -m http.server 4173 --directory dist`，访问 http://localhost:4173 。当前站内问答也可通过直接打开 `dist/index.html` 使用。

## 品牌与内容

编辑 `dist/content.js` 中的 `SITE_CONFIG`：

- `brand`、`subtitle`、`region`：品牌、副标题与区域。
- `home`：首屏标题、说明及三个需求引导入口。
- `assistant`：助手名称、回答模式、推荐问题及未来服务接口。
- `theme`、`themes`：三套默认色彩与主题变量。
- `contact`：真实电话、工作时间、地址、邮箱、二维码图片、版权及备案。为空时不显示占位数据。
- `scenarios`、`institutions`、`news`、`faqs`、`about`：栏目内容。
- `banners`：旧版轮播内容保留为素材，新版对话首页不使用轮播。

机构 `logo` 指定图片路径，`status` 为「已入驻」「对接中」「资料审查中」。资讯 `image` 和 `imageAlt` 可选，不设置图片时展示无图列表。机构与资讯无分类筛选。

复制 `dist` 即可部署新区域站点，不要复制当前站点的 `.openai` 和 `.git` 发布身份。

## 首页问答

当前 `assistant.mode` 为 `knowledge`：由 `knowledge.js` 根据站内内容和问题意图返回确定性的答案，不调用外部 AI，也不会将提问发送到服务器。支持平台介绍、机构入驻、服务场景、资讯查询、联系方式与常见问题；未收录的问题明确说明无法回答。回答附有站内入口。

支持推荐问题、Enter 发送、Shift+Enter 换行、中文输入法组合输入保护、新对话清除、站内路由切换后保留当前对话。问答记录仅保存在页面内存，刷新后清除。入驻资料草稿另存于浏览器 `institution-draft`，不会自动提交。

### 未来 AI 接口

`assistant.js` 已分离回答服务和界面，可将 `assistant.mode` 设为 `remote` 并指定同源 `assistant.endpoint`（例如 `/api/chat`）。当前静态部署没有此接口；**在实际服务端接入并验证之前，请保持 knowledge 模式**。

前端协议：POST JSON `{ "messages": [{ "role": "user", "content": "问题" }] }`，成功返回 `{ "answer": "回答正文", "sources": [{ "label": "来源名称", "url": "/help/h1" }] }`。历史最多发送最近 12 条消息。来源只允许站内栏目路径。当前预留的是非流式 JSON 协议，具体模型/流式协议需收到提供方说明后适配。

模型密钥必须由服务端环境变量保存，不得放入 `content.js`、浏览器存储或前端请求参数。服务端还需实现鉴权、限流、输入验证及模型供应商调用。前端已提供中止、30 秒超时和失败重试输入恢复。

## 文件

- `dist/index.html`：入口与元信息。
- `dist/content.js`：站点内容与配置。
- `dist/app.js`：栏目、路由及公共交互。
- `dist/assistant.js`：聊天界面及回答服务适配。
- `dist/knowledge.js`：纯函数站内内容检索。
- `dist/styles.css`：基础组件样式。
- `dist/design.css`：科技风视觉、对话界面与响应式覆盖。
- `tests/knowledge.test.cjs`：问答范围与真实性回归检查。

执行 `node --test tests/knowledge.test.cjs` 验证问答。视觉采用轻量 CSS/SVG，不依赖外部字体、图片或动画库，尊重 `prefers-reduced-motion`。

当前网站不包含真实业务提交、后台审核或外部模型连接。机构资料须由运营方核实。设计参考阅读了 Seesaw 的产品导向内容结构；Supahero 当时无法访问，视觉以需求指定的克制科技、细线与通透表面为准。

## 页脚配置

深炭灰四栏页脚：平台介绍、联系我们、快捷导航、掌上办理。`footer.description` 和 `footer.disclaimer` 控制介绍与平台声明；`footer.company` 控制公司名称（未填写时显示品牌版权），`contact.mobile` 为联系手机，`contact.phone` 为服务热线，`contact.qrImage` 为微信小程序二维码。备案使用 `contact.filing`，公安备案使用 `footer.publicSecurityFiling`。未提供的备案信息不显示，未提供的二维码显示小程序开通提示，不生成虚假二维码。

导航栏高度为 48px；桌面（宽度大于 800px）页脚高度为 300px。窄屏页脚随内容展开，避免文字被裁切。
