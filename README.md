# codaway-home

Codaway 产品宣传、用户注册与路线图展示独立前端应用 (Homepage of Codaway Software)。

## 技术特性

- **风格设计**：严格遵循 Vercel 极简设计规范（纯黑暗色基调、微光渐变、Bento 网格卡片、Geist 字体质感）。
- **完全解耦**：作为独立的静态 Web 产物，不依赖任何特定服务端运行环境，由 Nginx 直接提供静态文件服务并反向代理 API。
- **三大核心功能**：
  1. **产品宣传**：CPS v1 端到端加密（Curve25519 + ChaCha20-Poly1305）、全驱动 PTY 统一会话（Codex, Claude Code, OpenCode, DeepSeek TUI）、Pocket iOS 灵动岛进度感知与 Sovereign Worker 常驻守护。
  2. **用户注册**：支持邮箱输入、获取 6 位数字验证码（带 60s 倒计时与频率拦截）、密码设置并直接调用 Pipe 的 `/v1/auth/verify` 完成账户激活。
  3. **特性矩阵与 Roadmap**：Pocket (iOS)、Worker (Mac/Linux)、Pipe (Relay) 三端版本特性全览，以及 Phase 1 至 Phase 5 演进路线图。

## 部署规范

- **服务器路径**：部署在与 `pipe` 同机器的 `/codaway/homepage/` 目录。
- **Nginx 反向代理配置**：详见 `deploy/nginx/codaway-users.conf`。
- **构建投递**：统一由 `artifacts/build home` 脚本打包并通过 scp 发送至远程主机。
