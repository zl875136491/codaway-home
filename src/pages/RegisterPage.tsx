import { useEffect, useState } from "react";
import { CheckCircle2, KeyRound, Mail, ShieldCheck, UserPlus } from "lucide-react";
import { OtpInput, type OtpStatus } from "../components/affectui/ui/otp-input-clean";
import { toast } from "../components/affectui/ui/toaster-clean";
import { GridBackground } from "../components/affectui/motion/grid-background";
import { useSiteTheme } from "../theme/siteTheme";

type AuthMode = "signup" | "reset";

export function RegisterPage() {
  const { siteTheme } = useSiteTheme();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [codeSending, setCodeSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [otpStatus, setOtpStatus] = useState<OtpStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<{ tone: "info" | "success" | "error"; text: string } | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = window.setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [countdown]);

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setCode("");
    setOtpStatus("idle");
    setStatusMessage(null);
    setCompleted(false);
  };

  const handleSendCode = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      const msg = "请输入有效的邮箱地址";
      setStatusMessage({ tone: "error", text: msg });
      toast.error(msg);
      return;
    }

    setCodeSending(true);
    setStatusMessage({ tone: "info", text: "正在发送 6 位数字验证码..." });
    try {
      const res = await fetch("/v1/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, purpose: mode }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 429 && data.retry_after) {
          setCountdown(Number(data.retry_after) || 60);
        }
        throw new Error(data.message || data.error || "发送验证码失败，请稍后重试");
      }
      setCountdown(60);
      setOtpStatus("idle");
      setStatusMessage({ tone: "success", text: `验证码已发送至 ${cleanEmail}，有效期 10 分钟（请查收收件箱或垃圾箱）` });
      toast.success("验证码已发送", { description: cleanEmail });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "网络请求失败";
      setStatusMessage({ tone: "error", text: msg });
      toast.error("发送失败", { description: msg });
    } finally {
      setCodeSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanCode = code.trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setStatusMessage({ tone: "error", text: "请输入有效的邮箱地址" });
      return;
    }
    if (cleanCode.length !== 6) {
      setOtpStatus("error");
      setStatusMessage({ tone: "error", text: "请输入完整的 6 位数字验证码" });
      return;
    }
    if (password.length < 8) {
      setStatusMessage({ tone: "error", text: "密码长度至少需要 8 个字符" });
      return;
    }
    if (password !== confirmPassword) {
      setStatusMessage({ tone: "error", text: "两次输入的密码不一致，请重新确认" });
      return;
    }

    setSubmitting(true);
    setOtpStatus("verifying");
    setStatusMessage({ tone: "info", text: mode === "signup" ? "正在核验并创建账号..." : "正在核验并重置密码..." });

    const endpoint = mode === "signup" ? "/v1/auth/verify" : "/v1/auth/reset-password";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          code: cleanCode,
          password,
          new_password: password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setOtpStatus("error");
        throw new Error(data.message || data.error || "操作失败，请核对验证码后重试");
      }

      setOtpStatus("success");
      setCompleted(true);
      const successTitle = mode === "signup" ? "账号注册成功" : "密码已重置";
      setStatusMessage({ tone: "success", text: `${successTitle}！请使用此邮箱和密码登录 Worker 与 Pocket 客户端。` });
      toast.success(successTitle, { description: "现在即可运行 codaway login 进行工作站配对" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "请求失败，请检查网络连接";
      setStatusMessage({ tone: "error", text: msg });
      toast.error("校验失败", { description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative flex-1 py-12 sm:py-16">
      <GridBackground
        size={44}
        speed={0}
        fade={75}
        color={siteTheme === "dark" ? "rgba(56, 189, 248, 0.06)" : "rgba(2, 132, 199, 0.08)"}
      >
        <div className="mx-auto max-w-lg px-4 sm:px-6">
          <div className="codaway-card rounded-3xl p-6 sm:p-8">
            <div className="mb-6 space-y-2 text-center">
              <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs text-sky-300 site-light:border-sky-600/25 site-light:text-sky-700">
                <ShieldCheck size={13} /> Codaway Identity Portal
              </div>
              <h1 className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
                {mode === "signup" ? "开通您的 Codaway 账号" : "找回并重置登录密码"}
              </h1>
              <p className="text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
                单一账号打通本机 Worker 与 iPhone Pocket，端到端密钥始终在您的设备本地生成。
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="mb-6 grid grid-cols-2 gap-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1">
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className={`inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition sm:text-sm ${
                  mode === "signup"
                    ? "bg-white text-zinc-950 shadow-sm site-light:bg-slate-900 site-light:text-white"
                    : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                }`}
              >
                <UserPlus size={14} /> 创建新账号
              </button>
              <button
                type="button"
                onClick={() => switchMode("reset")}
                className={`inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition sm:text-sm ${
                  mode === "reset"
                    ? "bg-white text-zinc-950 shadow-sm site-light:bg-slate-900 site-light:text-white"
                    : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                }`}
              >
                <KeyRound size={14} /> 忘记 / 重置密码
              </button>
            </div>

            {statusMessage && (
              <div
                role="status"
                className={`mb-5 rounded-2xl border px-4 py-3 text-xs leading-relaxed ${
                  statusMessage.tone === "success"
                    ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-200 site-light:border-emerald-600/30 site-light:text-emerald-800"
                    : statusMessage.tone === "error"
                      ? "border-rose-500/35 bg-rose-500/10 text-rose-200 site-light:border-rose-600/30 site-light:text-rose-800"
                      : "border-sky-500/35 bg-sky-500/10 text-sky-200 site-light:border-sky-600/30 site-light:text-sky-800"
                }`}
              >
                {statusMessage.text}
              </div>
            )}

            {completed ? (
              <div className="space-y-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
                <CheckCircle2 size={32} className="mx-auto text-emerald-400 site-light:text-emerald-600" />
                <div className="text-base font-bold text-[var(--text-main)]">
                  {mode === "signup" ? "欢迎加入 Codaway！" : "密码更新完成"}
                </div>
                <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                  接下来在电脑终端执行以下指令即可完成登录并生成配对短码：
                </p>
                <pre className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[#07090f] p-3 text-left font-mono text-xs text-sky-300 site-light:bg-slate-900">
                  codaway login{"\n"}codaway workspace add /path/to/repo{"\n"}codaway start --pair
                </pre>
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="text-xs text-[var(--text-muted)] underline hover:text-[var(--text-main)]"
                >
                  返回表单
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="auth-email" className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-main)]">
                    <Mail size={13} className="text-[var(--text-muted)]" /> 电子邮箱 Email
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="auth-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      autoComplete="email"
                      className="min-w-0 flex-1 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-code)] px-3.5 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-sub)] focus:border-sky-400 focus:outline-none site-light:bg-white"
                    />
                    <button
                      type="button"
                      disabled={codeSending || countdown > 0}
                      onClick={handleSendCode}
                      className="shrink-0 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-xs font-semibold text-[var(--text-main)] transition hover:bg-[var(--surface-strong)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {codeSending ? "发送中..." : countdown > 0 ? `${countdown}s 后重发` : "发送验证码"}
                    </button>
                  </div>
                </div>

                {/* AffectUI OTP Input tracks siteTheme */}
                <div className="space-y-2">
                  <span className="block text-xs font-medium text-[var(--text-main)]">6 位邮箱验证码（支持粘贴自动填充）</span>
                  <div
                    data-theme={siteTheme}
                    className={`${siteTheme === "dark" ? "dark bg-black/35" : "bg-slate-50"} rounded-2xl border border-[var(--border)] p-3 transition-colors`}
                  >
                    <OtpInput
                      length={6}
                      separator
                      value={code}
                      onChange={(v) => {
                        setCode(v);
                        if (otpStatus === "error") setOtpStatus("idle");
                      }}
                      status={otpStatus}
                      errorMessage="验证码校验未通过，请重新确认"
                      successLabel="已验证"
                      resendIn={countdown}
                      onResend={handleSendCode}
                      align="center"
                      label="6 位邮箱验证码"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label htmlFor="auth-password" className="block text-xs font-medium text-[var(--text-main)]">
                    {mode === "signup" ? "设置密码（至少 8 位）" : "输入新密码（至少 8 位）"}
                  </label>
                  <input
                    id="auth-password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="至少 8 个字符"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-code)] px-3.5 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-sub)] focus:border-sky-400 focus:outline-none site-light:bg-white"
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label htmlFor="auth-confirm" className="block text-xs font-medium text-[var(--text-main)]">
                    确认密码
                  </label>
                  <input
                    id="auth-confirm"
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="请再次输入以上密码"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-code)] px-3.5 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-sub)] focus:border-sky-400 focus:outline-none site-light:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 site-light:bg-slate-900 site-light:text-white site-light:hover:bg-slate-800"
                >
                  {submitting
                    ? "正在提交校验..."
                    : mode === "signup"
                      ? "验证邮箱并完成注册"
                      : "确认并更新密码"}
                </button>
              </form>
            )}
          </div>
        </div>
      </GridBackground>
    </section>
  );
}
