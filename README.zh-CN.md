# LuckyPets 中文说明

LuckyPets 是一个以宠物主人为中心的宠物匹配应用原型，目标是帮助用户进行宠物社交、约玩、配对沟通，以及带有安全审核边界的负责任繁育对话。

项目当前包含两个入口：

- 静态 MVP 原型：直接打开 `index.html` 体验，不需要构建步骤。
- Expo / React Native 移动端应用：从 `App.tsx` 进入，面向 iOS 和 Android。

## 产品方向

MVP 版本围绕类似滑卡匹配的核心体验展开：

- 宠物资料：照片、年龄、城市、性格、健康状态、匹配意图。
- 喜欢 / 跳过：用户可以快速浏览并表达兴趣。
- 筛选条件：支持社交、约玩、繁育意图以及宠物类型筛选。
- 双向匹配：双方互相喜欢后进入会话。
- 安全动作：会话中支持举报、拉黑、解除匹配。
- 繁育门槛：繁育相关沟通需要健康记录、年龄条件、绝育状态、遗传筛查和兽医记录等审核依据。

## 负责任繁育原则

繁育匹配不应该被设计成普通滑卡。LuckyPets 的长期方向是：

- 在繁育对话开始前要求健康记录证明。
- 校验宠物年龄、疫苗、驱虫、绝育和遗传风险信息。
- 要求主人身份和动物福利承诺。
- 保留审核和风控记录，便于处理违规、欺诈、虐待或非法交易风险。
- 将社交 / 约玩匹配与繁育意图明确区分。

## 技术栈

- TypeScript
- Expo SDK 55
- React 19
- React Native 0.83
- react-native-safe-area-context
- 静态原型：HTML、CSS、JavaScript

## 目录结构

```text
.
├── App.tsx                         # Expo 应用入口
├── app.js                          # 静态原型脚本
├── index.html                      # 静态 MVP 原型入口
├── styles.css                      # 静态原型样式
├── app.json                        # Expo 应用配置
├── eas.json                        # EAS 构建配置
├── assets/                         # 应用图标、启动图、favicon
├── docs/                           # 产品、架构、发布、隐私和服务条款文档
├── scripts/                        # 资源生成和发布前检查脚本
└── src/
    ├── api/                        # API 合同和 mock client
    ├── app/                        # 应用状态和顶层容器
    ├── components/                 # 通用 UI 组件
    ├── data/                       # mock 宠物数据
    └── features/                   # auth、matching、messages、profile 功能页
```

## 本地运行

推荐使用 Bun，因为仓库中已经包含 `bun.lock`。

安装依赖：

```bash
bun install
```

启动 Expo：

```bash
bun run start
```

运行指定平台：

```bash
bun run ios
bun run android
bun run web
```

如果只是查看静态原型，可以直接用浏览器打开：

```text
index.html
```

## 常用脚本

```bash
bun run assets:generate
bun run typecheck
bun run release:check
bunx expo-doctor
eas --version
```

脚本说明：

- `assets:generate`：生成或校验应用图标、启动图等资源。
- `typecheck`：运行 TypeScript 类型检查。
- `release:check`：检查发布前配置、资源和必要文档。

## 当前开发状态

当前代码已经具备移动端 MVP 的雏形：

- 账号入口和本地会话占位。
- 宠物资料列表、编辑草稿、新建、保存、删除等 mock 流程。
- 匹配队列、喜欢、跳过、空状态和匹配结果。
- 会话列表、消息加载、举报、拉黑和解除匹配流程。
- 繁育资格状态、所需材料、审核备注和未通过前的阻断提示。
- 应用图标、启动图、发布前检查脚本和内部测试相关文档。

## 重要文档

- [产品路线图](docs/product-roadmap.md)
- [产品计划](docs/product-plan.md)
- [架构设计](docs/architecture.md)
- [移动端架构说明](docs/mobile-architecture.md)
- [8 周开发计划](docs/development-plan.md)
- [商店准备清单](docs/store-readiness.md)
- [内部测试手册](docs/internal-testing.md)
- [候选发布检查清单](docs/release-candidate-checklist.md)
- [隐私政策草稿](docs/privacy-policy.md)
- [服务条款草稿](docs/terms-of-service.md)
- [支持信息](docs/support.md)

## 下一步开发建议

1. 将 mock API 替换为真实后端 API。
2. 实现账号注册、登录、登出和账号删除请求的真实流程。
3. 接入宠物照片和健康记录上传。
4. 增加位置隐私控制和基于城市 / 区域的匹配。
5. 建设后台审核工具，处理繁育资格和举报队列。
6. 补充自动化测试、lint 和 CI 检查。
7. 完成 EAS projectId、隐私政策公开 URL、服务条款公开 URL 等上架前配置。

## 发布提醒

在准备 iOS / Android 内测构建前，至少需要完成：

- 运行 `bun run typecheck`。
- 运行 `bun run release:check`。
- 运行 `bunx expo-doctor`。
- 使用 `eas init` 生成正式 EAS projectId。
- 准备可公开访问的隐私政策和服务条款 URL。
- 按照 `docs/release-candidate-checklist.md` 完成回归测试。
