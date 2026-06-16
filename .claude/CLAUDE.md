# CLAUDE.md

## 项目简介

项目名称：

SAP Panda Academy

项目类型：

培训和工作、求职平台

目标用户：

* 日本企业员工
* SAP顾问
* SAP学习者

核心功能：

* 用户管理
* 课程管理
* 视频学习
* 每日测试
* 学习积分
* AI助教
* SAP知识库
* 记事
* 会员订阅

---

## 技术栈

### Frontend

* React 18
* TypeScript
* Vite
* axios



### Backend

* WordPress
* PHP 8.3+
* ACF
* Custom Post Type UI
* JWT
* Kadence模版
* REST API
* WordPress Coding Standard
* PSR12


### Database

* MySQL 8

### AI

* OpenAI
* DeepSeek

### Infrastructure

* Docker
* Nginx

---

## 项目目录

docs/
agents/
wordpress/
admin-react/
tests/

---

## 编码规范

### 通用

* 遵循 SOLID 原则
* 不允许硬编码
* 不允许重复代码
* 优先使用依赖注入
* 保持函数单一职责

### 命名规范

变量：

camelCase

函数：

camelCase

类：

PascalCase

数据库：

snake_case

---

## WordPress规范

### 自定义文章类型

允许：

course
teacher
exam
knowledge
news

禁止使用默认Post存储业务数据。

### ACF规范

字段必须添加前缀：

course_
teacher_
exam_

示例：

course_price
course_duration
teacher_avatar

禁止：

price
duration
avatar

### REST API

统一使用：

/wp-json/sap/v1/

示例：

/wp-json/sap/v1/courses
/wp-json/sap/v1/teachers
/wp-json/sap/v1/exams

禁止直接暴露 wp/v2 接口给管理后台。

---

## React规范

必须：

* TypeScript
* React Hooks
* Functional Components

禁止：

Class Components

页面结构：

pages/
components/
services/
hooks/
types/

---

## 测试规范

后端：

PHPUnit

前端：

Vitest

E2E：

Playwright

覆盖率：

最低 80%

---

## 安全规范

检查：

* SQL Injection
* XSS
* CSRF
* 权限绕过

所有接口必须验证：

JWT
Nonce
Capability

---

## 输出规范

当生成代码时：

必须输出：

1. 目录结构
2. 完整代码
3. 测试代码
4. 数据库变更
5. API文档
6. 部署步骤

禁止只输出伪代码。

---

## Agent工作流程

开发新功能时：

PM Agent
↓
Architect Agent
↓
Backend Agent
↓
Frontend Agent
↓
QA Agent
↓
Review Agent
↓
deploy Agent

严格按照顺序执行。

---

## Code Review规则

检查：

1. 架构问题
2. 性能问题
3. 安全漏洞
4. 测试覆盖率
5. 可维护性

输出：

* 问题列表
* 严重级别
* 修改建议

---

## 文档规范

所有功能必须生成：

docs/features/

格式：

feature-name.md

包含：

* 功能说明
* API设计
* 数据模型
* 测试方案

---

## AI开发原则

优先：

可维护性 > 开发速度

优先：

清晰代码 > 炫技代码

优先：

长期扩展 > 短期实现

禁止生成未经验证的代码。
