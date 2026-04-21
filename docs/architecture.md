# LuckyPets Architecture / 架构设计

## Overview / 总览

LuckyPets is planned as a mobile-first pet matching product with responsible breeding guardrails. The long-term architecture uses an Expo/React Native client, a self-hosted backend API, PostgreSQL, object storage, push notifications, analytics/crash logs, and an admin console for moderation and breeding review.

LuckyPets 规划为移动端优先的宠物匹配产品，并把负责任繁育作为核心安全边界。长期架构采用 Expo/React Native 客户端、自建后端 API、PostgreSQL、对象存储、推送通知、分析/崩溃日志，以及用于内容审核和繁育资格审核的管理后台。

This document records the target architecture only. It does not declare implemented API contracts or database schemas yet.

本文只记录目标架构，不代表当前已经实现 API 契约或数据库表结构。

## System Context / 系统上下文

```mermaid
flowchart LR
  User["Pet Owner / 宠物家长"]
  App["iOS & Android App<br/>Expo / React Native"]
  API["Backend API<br/>自建后端服务"]
  Auth["Auth Service<br/>账号与认证"]
  DB[("PostgreSQL<br/>业务数据")]
  Storage[("Object Storage<br/>照片与医疗文件")]
  Push["Push Notification<br/>APNs / FCM"]
  Admin["Admin Console<br/>审核后台"]
  Queue["Moderation Queue<br/>举报与审核队列"]
  Analytics["Analytics & Crash Logs<br/>分析与崩溃日志"]

  User --> App
  App --> API
  App --> Analytics
  API --> Auth
  API --> DB
  API --> Storage
  API --> Push
  API --> Queue
  Admin --> API
  Admin --> Queue
  Queue --> DB
```

## Core Product Flow / 核心产品流程

```mermaid
flowchart TD
  Start["Open App / 打开 App"]
  SignIn["Sign up or sign in<br/>注册或登录"]
  PetProfile["Create pet profile<br/>创建宠物资料"]
  Health["Add health records<br/>补充健康记录"]
  Swipe["Swipe queue<br/>浏览匹配队列"]
  Like["Like or pass<br/>喜欢或跳过"]
  Mutual["Mutual match?<br/>是否双向喜欢"]
  Chat["Open chat<br/>开启聊天"]
  ReportBlock["Report / block / unmatch<br/>举报 / 拉黑 / 解除匹配"]
  BreedingIntent["Breeding intent?<br/>是否繁育意图"]
  Eligibility["Breeding eligibility review<br/>繁育资格审核"]
  BreedingChat["Breeding chat allowed<br/>允许繁育沟通"]

  Start --> SignIn --> PetProfile --> Health --> Swipe --> Like --> Mutual
  Mutual -- "No / 否" --> Swipe
  Mutual -- "Yes / 是" --> BreedingIntent
  BreedingIntent -- "No / 否" --> Chat
  BreedingIntent -- "Yes / 是" --> Eligibility
  Eligibility -- "Approved / 通过" --> BreedingChat
  Eligibility -- "Rejected or pending / 拒绝或待审核" --> Chat
  Chat --> ReportBlock
  BreedingChat --> ReportBlock
```

## Domain Model / 领域模型

```mermaid
erDiagram
  User ||--o{ Pet : owns
  User ||--o{ Report : submits
  Pet ||--o{ HealthRecord : has
  Pet ||--o{ BreedingEligibility : reviews
  Pet ||--o{ Match : participates
  Match ||--o| Conversation : creates
  Conversation ||--o{ Message : contains
  Report ||--o| ReviewCase : opens
  ReviewCase }o--|| User : assigned_to

  User {
    string id
    string phone_or_email
    string display_name
    string verification_status
  }

  Pet {
    string id
    string owner_id
    string species
    string breed
    string age
    string intent
    string city_area
  }

  HealthRecord {
    string id
    string pet_id
    string record_type
    string review_status
  }

  BreedingEligibility {
    string id
    string pet_id
    string status
    string reason
  }

  Match {
    string id
    string pet_a_id
    string pet_b_id
    string status
  }

  Conversation {
    string id
    string match_id
    string safety_state
  }

  Message {
    string id
    string conversation_id
    string sender_id
    string message_type
  }

  Report {
    string id
    string reporter_id
    string target_type
    string category
  }

  ReviewCase {
    string id
    string report_id
    string status
    string reviewer_id
  }
```

## Release Flow / 发布流程

```mermaid
flowchart LR
  Dev["Local development<br/>本地开发"]
  CI["CI checks<br/>类型检查 / 测试 / Lint"]
  EAS["EAS Build<br/>iOS & Android"]
  TF["TestFlight<br/>iOS 内测"]
  GPInternal["Google Play Internal Testing<br/>Android 内测"]
  Review["Store Review<br/>商店审核"]
  AppStore["App Store Production<br/>iOS 正式版"]
  PlayStore["Google Play Production<br/>Android 正式版"]
  Monitor["Monitoring<br/>崩溃 / 分析 / 用户反馈"]

  Dev --> CI --> EAS
  EAS --> TF --> Review
  EAS --> GPInternal --> Review
  Review --> AppStore --> Monitor
  Review --> PlayStore --> Monitor
```

## Module Boundaries / 模块边界

- Mobile App / 移动端：matching, messages, pet profile, health records, reporting, account deletion, notification preferences.
- Backend API / 后端 API：authentication gateway, pet profile service, matching service, chat service, moderation service, breeding eligibility service.
- Admin Console / 管理后台：review queue, report handling, breeding eligibility review, profile takedown, audit logs.
- Data Layer / 数据层：PostgreSQL for relational business data, object storage for pet photos and private health documents.
- Platform Services / 平台服务：APNs/FCM for push, analytics/crash logs for app quality, EAS for build and submit.

## Architecture Rules / 架构原则

- Use coarse location by default; never expose precise home location in public pet profiles.
- Keep medical documents private unless the owner explicitly shares them.
- Separate social/playdate matching from breeding intent and review.
- Require review before breeding chat is treated as approved or eligible.
- Keep moderation actions auditable.
- Design API and database contracts in a later implementation phase before building backend features.

## Related Documents / 相关文档

- [Product Roadmap](./product-roadmap.md)
- [Mobile Architecture Notes](./mobile-architecture.md)
- [Store Readiness Checklist](./store-readiness.md)
- [Product Plan](./product-plan.md)
- [Development Plan](./development-plan.md)
