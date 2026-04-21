# LuckyPets Product Plan / 产品计划

## Positioning / 产品定位

LuckyPets is a pet-first matching app for owners who want safe social introductions, playdates, and responsible breeding conversations.

LuckyPets 是一个以宠物为中心的匹配 App，服务于希望安全认识同城宠友、安排宠物玩伴，以及进行负责任繁育沟通的宠物家长。

The product must not become a classified ads board or casual breeding marketplace. Breeding-related flows must be gated by health, identity, and welfare requirements.

产品不能变成分类广告或随意繁育市场。所有繁育相关路径都必须经过健康、身份和动物福利门槛。

## Target Users / 目标用户

- Pet owners who want nearby social introductions for dogs, cats, rabbits, and future supported species.
- Owners who want playdates with clear safety boundaries.
- Owners who want breeding conversations only after eligibility checks.
- Admin reviewers who handle reports, unsafe profiles, and breeding eligibility cases.

- 希望为狗狗、猫咪、兔兔等宠物寻找附近朋友的宠物家长。
- 希望安排玩伴但需要清晰安全边界的家长。
- 希望在资格审核后再进入繁育沟通的家长。
- 处理举报、不安全资料和繁育资格审核的后台审核人员。

## MVP Scope / MVP 范围

- Account creation, sign in, sign out, and account deletion request.
- Pet profile creation with photos, species, breed, age, sex, city area, temperament, intent, and safety notes.
- Swipe queue with like/pass actions and filters for social, playdate, and breeding intent.
- Mutual match creation and chat entry after both sides like each other.
- Report, block, and unmatch flows.
- Basic health record upload and review status display.
- Breeding eligibility status that blocks approved breeding chat until review passes.
- Admin console for report review and breeding eligibility review.
- Internal testing preparation for iOS and Android.

- 账号注册、登录、退出和账号删除请求。
- 宠物资料创建，包含照片、物种、品种、年龄、性别、城市区域、性格、目的和安全说明。
- 滑动匹配队列，支持喜欢/跳过，以及交友、玩伴、繁育意图筛选。
- 双向喜欢后创建配对并进入聊天。
- 举报、拉黑和解除匹配。
- 基础健康记录上传和审核状态展示。
- 繁育资格状态，在审核通过前阻止“已认证繁育沟通”。
- 用于举报审核和繁育资格审核的管理后台。
- iOS 和 Android 内测准备。

## Core User Journey / 核心路径

1. Owner creates an account and adds one pet profile.
2. Owner uploads pet photos and basic health information.
3. Owner browses the swipe queue with clear intent filters.
4. Owner likes or passes suggested pets.
5. A mutual match opens a structured chat.
6. If either pet has breeding intent, the app shows eligibility state before breeding chat is allowed.
7. Either owner can report, block, or unmatch at any time.
8. Admin reviewers resolve reports and breeding eligibility cases.

1. 家长创建账号并添加一个宠物资料。
2. 家长上传宠物照片和基础健康信息。
3. 家长通过明确的目的筛选浏览滑动队列。
4. 家长对推荐宠物选择喜欢或跳过。
5. 双向喜欢后开启结构化聊天。
6. 如果任一方有繁育意图，App 在允许繁育沟通前展示资格状态。
7. 任一家长都可以随时举报、拉黑或解除匹配。
8. 后台审核人员处理举报和繁育资格审核。

## Responsible Breeding Rules / 繁育安全规则

- Breeding intent must be visually separate from social and playdate matching.
- Breeding chat approval requires owner identity verification.
- Pet age and health eligibility must be checked before approval.
- Vaccination and parasite prevention records must be reviewable.
- Genetic screening is required when breed-specific risk is known.
- Welfare agreement must be accepted before breeding chat is approved.
- Bulk breeding, sale-like listings, unsafe language, and coercive behavior must be reportable and reviewable.

- 繁育意图必须和普通交友、玩伴匹配在视觉和流程上区分。
- 繁育聊天批准前必须完成家长身份核验。
- 宠物年龄和健康资格必须先被检查。
- 疫苗和驱虫记录必须可审核。
- 已知有品种遗传风险时，需要基因筛查。
- 繁育聊天批准前必须同意动物福利条款。
- 批量繁育、售卖式资料、不安全表达和胁迫行为必须可举报、可审核。

## Success Metrics / 成功指标

- Activation: percentage of new users who create a pet profile within the first session.
- Match quality: mutual matches per active pet profile.
- Safety: report rate, block rate, and median moderation response time.
- Breeding compliance: percentage of breeding-intent profiles with completed eligibility review.
- Retention: day 7 active owners after first match.
- Store readiness: TestFlight and Google Play internal testing approval without critical review blockers.

- 激活：新用户首个会话内完成宠物资料创建的比例。
- 匹配质量：每个活跃宠物资料获得的双向配对数。
- 安全：举报率、拉黑率和审核响应中位时间。
- 繁育合规：繁育意图资料中完成资格审核的比例。
- 留存：首次配对后第 7 天仍活跃的家长比例。
- 上架准备：TestFlight 和 Google Play 内测通过且没有严重审核阻塞。

## Product Phases / 产品阶段

- Phase 0: Static prototype and Expo mobile shell.
- Phase 1: 8-week MVP with accounts, pet profiles, matching, chat, reporting, basic admin review, and internal testing.
- Phase 2: stronger verification, health document review, push notifications, moderation analytics, and store submission.
- Phase 3: recommendation ranking, meetup scheduling, community events, shelter/adoption partner flows.

- 阶段 0：静态原型和 Expo 移动端骨架。
- 阶段 1：8 周 MVP，包含账号、宠物资料、匹配、聊天、举报、基础后台审核和内测。
- 阶段 2：强化认证、健康文件审核、推送通知、审核数据分析和商店提交。
- 阶段 3：推荐排序、见面预约、社区活动、救助/领养合作路径。

## Out Of Scope For MVP / MVP 暂不包含

- Payments, deposits, or paid breeding transactions.
- Precise real-time location sharing.
- Public sale listings.
- Fully automated medical document approval.
- Multi-region legal automation.

- 支付、押金或付费繁育交易。
- 精确实时位置共享。
- 公开售卖列表。
- 完全自动化医疗文件审批。
- 多地区法律规则自动化。

## Related Documents / 相关文档

- [Architecture](./architecture.md)
- [Development Plan](./development-plan.md)
- [Product Roadmap](./product-roadmap.md)
- [Store Readiness Checklist](./store-readiness.md)
