# LuckyPets 8-Week Development Plan / 8 周开发计划

## Goal / 目标

Deliver an internal-test-ready iOS and Android MVP in 8 weeks. The MVP must support accounts, pet profiles, matching, chat, report/block/unmatch, basic health record review status, breeding eligibility gates, and store readiness preparation.

用 8 周交付可进入 iOS 和 Android 内测的 MVP。MVP 必须支持账号、宠物资料、匹配、聊天、举报/拉黑/解除匹配、基础健康记录审核状态、繁育资格门槛，以及商店准备工作。

## Workstreams / 工作流

- Mobile App / 移动端：Expo/React Native screens, navigation, state, API integration, upload flows, app permissions.
- Backend API / 后端 API：auth, pet profiles, matching, conversations, reports, moderation, breeding eligibility.
- Admin Console / 管理后台：review queues for reports and breeding eligibility.
- Platform / 平台：database, object storage, push notifications, CI, EAS build, internal testing.
- Product & QA / 产品与测试：acceptance checks, safety copy, store metadata, screenshots, review notes.

## Week 1 / 第 1 周：Foundation / 基础建设

- Mobile: replace prototype-only state with app navigation, screen folders, reusable UI components, and local session placeholder.
- Backend: define API modules, database migration strategy, auth approach, and environment configuration.
- Admin: define review queue states and reviewer roles.
- Platform: set up CI checks for typecheck, lint, and tests once dependencies are installed.
- Product/QA: finalize MVP acceptance checklist and store policy risk list.

- 移动端：把原型状态拆成正式导航、页面目录、通用 UI 组件和本地会话占位。
- 后端：定义 API 模块、数据库迁移策略、认证方案和环境配置。
- 后台：定义审核队列状态和审核人员角色。
- 平台：安装依赖后建立 typecheck、lint、tests 的 CI 检查。
- 产品/测试：确认 MVP 验收清单和商店审核风险清单。

## Week 2 / 第 2 周：Account And Pet Profiles / 账号与宠物资料

- Current progress: mobile auth gate, sign in/create account mock actions, sign out, account deletion request, pet profile list, editable draft, create/update/delete mock actions, and profile API boundary are in place.
- Mobile: implement sign up, sign in, sign out, account deletion request, pet profile CRUD screens.
- Backend: implement user, session, pet profile, and account deletion request endpoints.
- Data: create initial tables for User, Pet, and audit timestamps.
- Admin: show basic user and pet profile read-only views.
- QA: test account lifecycle and pet profile validation.

- 移动端：实现注册、登录、退出、账号删除请求和宠物资料 CRUD 页面。
- 后端：实现用户、会话、宠物资料和账号删除请求接口。
- 数据：创建 User、Pet 和审计时间字段。
- 后台：展示基础用户和宠物资料只读视图。
- 测试：验证账号生命周期和宠物资料校验。

## Week 3 / 第 3 周：Photos And Health Records / 照片与健康记录

- Current progress: mobile photo list, mock photo creation, health record list, mock health record creation, private medical record copy, and media API boundary are in place.
- Mobile: implement photo upload, health record upload, upload progress, and review status display.
- Backend: implement signed upload flow, object storage integration, HealthRecord records, and private document access rules.
- Admin: add health record review list and approve/reject actions.
- QA: test permissions, upload failure, file size limits, private document access, and retry behavior.

- 移动端：实现照片上传、健康记录上传、上传进度和审核状态展示。
- 后端：实现签名上传、对象存储集成、HealthRecord 记录和私密文件访问规则。
- 后台：增加健康记录审核列表和通过/拒绝操作。
- 测试：验证权限、上传失败、文件大小限制、私密文件访问和重试。

## Week 4 / 第 4 周：Matching / 匹配

- Mobile: implement swipe queue from API, intent/species filters, like/pass, empty states, and match confirmation.
- Backend: implement matching queue, like/pass events, mutual match creation, and basic anti-spam limits.
- Data: create Match and swipe event storage.
- QA: test duplicate likes, repeated passes, blocked users, empty queues, and mutual match creation.

- 移动端：实现来自 API 的滑动队列、目的/物种筛选、喜欢/跳过、空状态和配对确认。
- 后端：实现匹配队列、喜欢/跳过事件、双向配对创建和基础反刷限制。
- 数据：创建 Match 和滑动事件存储。
- 测试：验证重复喜欢、重复跳过、已拉黑用户、空队列和双向配对创建。

## Week 5 / 第 5 周：Messages And Safety Actions / 消息与安全操作

- Mobile: implement conversation list, chat room, safety prompts, report, block, and unmatch.
- Backend: implement Conversation, Message, Report, block list, unmatch, and message visibility rules.
- Admin: add report review queue with categories and status transitions.
- QA: test chat after mutual match, blocked messaging, unmatch behavior, report creation, and moderation visibility.

- 移动端：实现会话列表、聊天室、安全提示、举报、拉黑和解除匹配。
- 后端：实现 Conversation、Message、Report、拉黑列表、解除匹配和消息可见规则。
- 后台：增加带分类和状态流转的举报审核队列。
- 测试：验证双向配对后聊天、拉黑后消息、解除匹配行为、举报创建和后台可见性。

## Week 6 / 第 6 周：Breeding Eligibility / 繁育资格

- Mobile: show breeding eligibility status, required checklist, blocked breeding chat state, and review result copy.
- Backend: implement BreedingEligibility records, required evidence checklist, review transitions, and audit logs.
- Admin: implement breeding eligibility review detail page.
- QA: test pending, approved, rejected, expired, and missing evidence states.

- 移动端：展示繁育资格状态、必备清单、阻止繁育聊天状态和审核结果文案。
- 后端：实现 BreedingEligibility 记录、必备材料清单、审核流转和审计日志。
- 后台：实现繁育资格审核详情页。
- 测试：验证待审核、通过、拒绝、过期和材料缺失状态。

## Week 7 / 第 7 周：Internal Testing Readiness / 内测准备

- Mobile: polish accessibility, error states, offline states, app icon, splash screen, and permission prompts.
- Backend: harden rate limits, logging, backup, moderation audit, and production environment configuration.
- Platform: configure EAS build profiles, TestFlight internal testing, and Google Play internal testing.
- Product/QA: prepare screenshots, privacy policy, terms, support contact, and review notes.

- 移动端：打磨可访问性、错误状态、离线状态、App 图标、启动页和权限提示。
- 后端：强化限流、日志、备份、审核审计和生产环境配置。
- 平台：配置 EAS 构建、TestFlight 内测和 Google Play 内测。
- 产品/测试：准备截图、隐私政策、服务条款、支持联系方式和审核备注。

## Week 8 / 第 8 周：QA And Release Candidate / 测试与候选版本

- QA: run full regression across account, profile, upload, matching, chat, report/block/unmatch, breeding review, and account deletion.
- Mobile: fix release-blocking bugs and generate release candidate builds.
- Backend/Admin: fix moderation and eligibility review blockers.
- Platform: submit internal builds, collect tester feedback, and prepare production submission checklist.
- Product: decide whether to proceed to public store review or extend internal testing.

- 测试：完整回归账号、资料、上传、匹配、聊天、举报/拉黑/解除匹配、繁育审核和账号删除。
- 移动端：修复阻塞发布的问题并生成候选版本。
- 后端/后台：修复审核和繁育资格流程阻塞问题。
- 平台：提交内测构建、收集测试反馈并准备正式提交清单。
- 产品：决定进入公开商店审核，或延长内测。

## Acceptance Criteria / 验收标准

- New owner can create an account, create a pet profile, upload photos, and browse a filtered swipe queue.
- Mutual likes create a match and open a chat.
- Report, block, unmatch, and account deletion request are available.
- Breeding-intent profiles show eligibility status and cannot be treated as approved until review passes.
- Admin reviewer can resolve reports and breeding eligibility cases.
- iOS and Android internal builds are available for tester installation.
- Store metadata, privacy policy, terms, support contact, screenshots, and review notes are drafted.

- 新家长可以创建账号、创建宠物资料、上传照片，并浏览带筛选的滑动队列。
- 双向喜欢会创建配对并开启聊天。
- 举报、拉黑、解除匹配和账号删除请求可用。
- 有繁育意图的资料会展示资格状态，审核通过前不能被视为已批准。
- 后台审核人员可以处理举报和繁育资格案例。
- iOS 和 Android 内测构建可供测试人员安装。
- 商店资料、隐私政策、服务条款、支持联系方式、截图和审核备注已完成草稿。

## Related Documents / 相关文档

- [Architecture](./architecture.md)
- [Product Plan](./product-plan.md)
- [Store Readiness Checklist](./store-readiness.md)
