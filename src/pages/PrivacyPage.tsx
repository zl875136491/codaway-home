import { LockKeyhole, FileText, ArrowLeft } from "lucide-react";
import { useRouter } from "../router";

export function PrivacyPage() {
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
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 site-light:text-emerald-700">
          <LockKeyhole size={14} /> 隐私政策 · Privacy Policy
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)] sm:text-3xl">
          Codaway 隐私政策
        </h1>
        <p className="mt-2 text-xs text-[var(--text-muted)]">更新日期：2026 年 11 月 16 日 · 零知识盲中继隐私承诺</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-[var(--text-sub)]">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-main)]">1. 零知识架构：我们不读取您的代码与对话</h2>
            <p className="mt-1.5">
              Codaway 采用严格的端到端加密（E2EE）设计：您的 X25519 / Ed25519 私钥仅存储在您的手机 Keychain 与本地 Worker 文件系统中，从不离开您的设备。会话指令、AI 输出、工具审批摘要、Git 差异及通过 R2 中转的图片与文件，均在离开设备前完成 ChaCha20-Poly1305 AEAD 加密；Pipe 服务端和对象存储均只接触密文。
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--text-main)]">2. 我们收集的最小必要信息</h2>
            <ul className="mt-1.5 list-disc space-y-1 pl-5">
              <li>账号信息：电子邮箱地址、密码哈希、TOTP 启用状态与恢复码哈希、当前套餐等级（Free / Pro）及到期时间。</li>
              <li>设备元信息：您绑定的 Worker / Pocket 设备 ID、设备名称、公钥指纹与用于离线提醒的 APNs Device Token（如已开启推送）。</li>
              <li>安全与配额遥测：登录验证码限流计数、设备并发配额状态与必要的安全审计日志（如登录、TOTP 变更、Apple 购买凭证核验结果）。</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--text-main)]">3. 相机、麦克风与语音识别权限（iOS）</h2>
            <ul className="mt-1.5 list-disc space-y-1 pl-5">
              <li>相机权限（Camera）：仅在您主动扫描 Worker 终端配对二维码时启用，图像仅在本地用于解析二维码，不上传至任何服务器。</li>
              <li>麦克风与语音识别（Microphone &amp; Speech Recognition）：仅在您主动点击会话输入框语音听写按钮时将语音转换为文本填入编辑框；原始音频不留存、不由 Codaway 服务器存储。</li>
              <li>生物识别（Face ID / Touch ID）：仅用于在 iPhone 本地解锁敏感审批签名操作，验证结果保留在系统安全飞地中。</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--text-main)]">4. 数据留存与对象生命周期</h2>
            <p className="mt-1.5">
              离线消息帧与待推送作业在 MongoDB 中最多保留 7 天（投递确认后立即删除），安全审计记录按策略保留不超过 90 天；通过 Cloudflare R2 中转的密文附件由存储桶生命周期策略按预定周期自动回收过期清理。
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--text-main)]">5. 您的控制权</h2>
            <p className="mt-1.5">
              您可随时在 Pocket App 或命令行吊销任意已配对设备、关闭两步验证、撤销推送令牌，或联系支持注销账号并清理所有绑定设备记录。
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2 border-t border-[var(--border)] pt-5 text-xs text-[var(--text-muted)]">
          <FileText size={14} className="text-sky-400" />
          <span>配合阅读：</span>
          <a
            href="/terms"
            onClick={(e) => {
              e.preventDefault();
              navigate("/terms");
            }}
            className="text-sky-400 underline underline-offset-4 hover:text-sky-300 site-light:text-sky-600"
          >
            用户服务协议 (Terms of Service)
          </a>
        </div>
      </div>
    </section>
  );
}
