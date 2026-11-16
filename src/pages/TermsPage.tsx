import { ShieldCheck, FileText, ArrowLeft } from "lucide-react";
import { useRouter } from "../router";

export function TermsPage() {
  const { navigate } = useRouter();

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs text-[var(--text-sub)] transition hover:text-[var(--text-main)]"
      >
        <ArrowLeft size={14} /> 返回首页
      </button>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 sm:p-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-400 site-light:text-sky-700">
          <FileText size={14} /> 服务条款 · Terms of Service
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)] sm:text-3xl">
          Codaway 用户服务协议
        </h1>
        <p className="mt-2 text-xs text-[var(--text-muted)]">更新日期：2026 年 11 月 16 日 · 适用域名：codaway-users.13dot8billion.site</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-[var(--text-sub)]">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-main)]">1. 服务说明</h2>
            <p className="mt-1.5">
              Codaway 提供由客户端 Pocket、本地守护端 Worker 与盲中继节点 Pipe 组成的端到端加密（E2EE）远程编程工作台服务。所有业务会话、代码上下文、审批命令与文件内容均在您的设备端使用 X25519 + ChaCha20-Poly1305 完成加密，Pipe 仅负责身份鉴权、盲帧路由与短期加密附件预签名。
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--text-main)]">2. 账号与套餐配额</h2>
            <ul className="mt-1.5 list-disc space-y-1 pl-5">
              <li>Free 免费版：支持最多绑定 1 台 Worker 工作站、1 台 Pocket 移动设备，以及跨工作站最多 2 个并发活动会话。</li>
              <li>Pro 专业版：支持最多绑定 4 台 Worker 工作站、不限数量 Pocket 移动设备，以及跨工作站最多 10 个并发活动会话。</li>
              <li>自建开源 Worker 与 Pipe 节点仍遵循其开源许可与您自行部署的基础设施约束。</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--text-main)]">3. 订阅、续费与退款</h2>
            <p className="mt-1.5">
              当您通过 Apple App Store 应用内购买订阅 Codaway Pro 时，款项将在确认购买后由您的 Apple ID 账户扣款。连续订阅周期（月付 / 年付）将在当前周期结束前 24 小时内自动续订，您可随时在 iOS 系统「设置 → Apple 账户 → 订阅」中取消。退款与撤销裁决由 Apple 依据 App Store 政策处理，服务端将在收到 Apple Server Notifications V2 通知后同步调整会员权益。
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--text-main)]">4. 合规使用与安全责任</h2>
            <p className="mt-1.5">
              请妥善保管您的账号密码、两步验证（TOTP）恢复码及本地 Worker 私钥文件（`~/.codaway/identity.json`）。您不得利用 Codaway 中继基础设施从事未授权系统入侵、恶意流量攻击或违反适用法律法规的活动。对破坏平台稳定性的滥用账号，我们保留限流或终止服务的权利。
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--text-main)]">5. 协议变更与联系方式</h2>
            <p className="mt-1.5">
              如本协议因产品演进或合规要求发生更新，我们将在本页面公示最新版本。如有任何疑问，可通过产品内反馈渠道或项目主页联系维护团队。
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2 border-t border-[var(--border)] pt-5 text-xs text-[var(--text-muted)]">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>配合阅读：</span>
          <a
            href="/privacy"
            onClick={(e) => {
              e.preventDefault();
              navigate("/privacy");
            }}
            className="text-sky-400 underline underline-offset-4 hover:text-sky-300 site-light:text-sky-600"
          >
            隐私政策 (Privacy Policy)
          </a>
        </div>
      </div>
    </section>
  );
}
