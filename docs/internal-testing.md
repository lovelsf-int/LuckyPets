# LuckyPets Internal Testing Runbook / 内测运行手册

## Goal / 目标

Prepare LuckyPets for TestFlight and Google Play Internal Testing. The first internal build should validate the complete owner journey: account, pet profile, photo/health records, matching, messages, report/block/unmatch, and breeding eligibility gates.

让 LuckyPets 进入 TestFlight 与 Google Play Internal Testing。第一版内测包重点验证完整家长路径：账号、宠物资料、照片/健康记录、匹配、消息、举报/拉黑/解除匹配，以及繁育资格门禁。

## Build Profiles / 构建配置

- Development / 开发包：use the `development` EAS profile for local device debugging.
- Preview / 内测包：use the `preview` EAS profile for internal testers.
- Production / 候选包：use the `production` EAS profile only after privacy, moderation, and store metadata are ready.

- 开发包：使用 EAS `development` profile，服务于本地真机调试。
- 内测包：使用 EAS `preview` profile，分发给内部测试人员。
- 候选包：隐私、审核、商店资料准备好后，再使用 EAS `production` profile。

## Pre-Build Checklist / 构建前检查

- `bun install`
- `bun run assets:generate`
- `bun run typecheck`
- `bunx expo-doctor`
- Confirm `app.json` has app icon, adaptive icon, splash screen, bundle identifier, and Android package name.
- Confirm `extra.eas.projectId` is replaced after `eas init`.

- 确认 `app.json` 已配置 App 图标、Android adaptive icon、启动页、iOS bundle identifier 和 Android package name。
- `eas init` 后，把 `extra.eas.projectId` 从占位值替换成真实项目 ID。

## Internal Test Scope / 内测范围

- Account: sign in, create account, sign out, account deletion request.
- Pet profile: create, edit, delete, switch active pet.
- Media: add mock photo and health record, confirm review status copy.
- Matching: filters, like/pass, queue empty states, duplicate action protection.
- Messages: load conversations/messages, switch chats, report, block, unmatch.
- Breeding: verify pending gate, required evidence list, reviewer note, and blocked guidance.
- Store readiness: app icon, splash, app name, support contact, privacy policy, terms draft.

- 账号：登录、创建账号、退出、账号删除请求。
- 宠物资料：创建、编辑、删除、切换当前宠物。
- 媒体资料：添加 mock 照片和健康记录，确认审核状态文案。
- 匹配：筛选、喜欢/跳过、空队列、防重复操作。
- 消息：加载会话/消息、切换聊天、举报、拉黑、解除匹配。
- 繁育：验证待审核门禁、必备材料、审核备注和阻断提示。
- 商店准备：图标、启动页、App 名称、支持联系方式、隐私政策、服务条款草稿。

## Tester Notes / 测试说明

Internal testers should not use real medical records or precise home addresses in this phase. Use mock data and report any flow that makes breeding feel approved before eligibility review passes.

内测人员不要上传真实医疗记录或精确家庭地址。本阶段使用 mock 数据；如果任何流程让繁育在审核通过前显得“已批准”，需要立即记录为阻塞问题。
