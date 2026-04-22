# LuckyPets Release Candidate Checklist / 候选版本检查清单

## Goal / 目标

Use this checklist before creating an internal-test or release-candidate build. A release candidate should be installable, testable, and clear about remaining store submission blockers.

在创建内测包或候选版本前使用本清单。候选版本应能安装、能测试，并清楚标出正式提交商店前仍然阻塞的事项。

## Local Verification / 本地验证

Run these checks before any EAS build:

```bash
bun install
bun run assets:generate
bun run typecheck
bunx expo-doctor
bun run release:check
```

构建前必须先运行以上检查。

## EAS Setup / EAS 配置

- Run `eas login`.
- Run `eas init`.
- Replace `extra.eas.projectId` in `app.json` with the real EAS project ID.
- Confirm `eas whoami` shows the expected Expo account.
- Keep `preview` for internal testing and `production` for release candidates.

- 执行 `eas login`。
- 执行 `eas init`。
- 将 `app.json` 里的 `extra.eas.projectId` 替换为真实 EAS project ID。
- 确认 `eas whoami` 显示正确 Expo 账号。
- `preview` 用于内测，`production` 用于候选版本。

## Build Commands / 构建命令

Internal testing:

```bash
eas build --profile preview --platform ios
eas build --profile preview --platform android
```

Release candidate:

```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

## Functional Regression / 功能回归

- Account: sign in, create account, sign out, account deletion request.
- Pet profiles: create, edit, delete, switch active pet.
- Photos and health: add mock photo, add health record, verify review status copy.
- Matching: filters, like, pass, match list, empty queue reasons.
- Messages: conversation list, chat messages, safety prompts.
- Safety: report, block, unmatch, removed conversation behavior.
- Breeding: pending eligibility gate, required evidence, reviewer note, blocked guidance.

- 账号：登录、创建账号、退出、账号删除请求。
- 宠物资料：创建、编辑、删除、切换当前宠物。
- 照片与健康：添加 mock 照片、添加健康记录、验证审核状态文案。
- 匹配：筛选、喜欢、跳过、配对列表、空队列原因。
- 消息：会话列表、聊天消息、安全提示。
- 安全：举报、拉黑、解除匹配、会话移除行为。
- 繁育：待审核门禁、必备材料、审核备注、阻断提示。

## Store Submission Blockers / 商店提交阻塞项

- Replace placeholder EAS project ID.
- Publish privacy policy URL.
- Publish terms of service URL.
- Add support URL or support email.
- Prepare App Store privacy nutrition labels.
- Prepare Google Play Data safety form.
- Create App Store Connect app record.
- Create Google Play app record.
- Capture screenshots for required device sizes.

- 替换 EAS project ID 占位值。
- 发布隐私政策链接。
- 发布服务条款链接。
- 添加支持链接或支持邮箱。
- 准备 App Store 隐私标签。
- 准备 Google Play 数据安全表单。
- 创建 App Store Connect 应用记录。
- 创建 Google Play 应用记录。
- 按要求设备尺寸截图。
