import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hook";
import {
  login,
  clearError,
  selectIsAuthenticated,
  selectAuthError,
  selectAuthLoading,
} from "./../../store/slices/authSlice";

// ─── Inline styles (no external CSS needed) ────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "#0a0a0f",
    fontFamily: "'DM Sans', sans-serif",
    overflow: "hidden",
    position: "relative",
  },
  // Left decorative panel
  panel: {
    flex: "0 0 45%",
    background: "linear-gradient(135deg, #0f1923 0%, #0d1f2d 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "64px",
    position: "relative",
    overflow: "hidden",
  },
  panelGlow: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(0,212,180,0.12) 0%, transparent 70%)",
    top: "-100px",
    left: "-100px",
    pointerEvents: "none",
  },
  panelGlow2: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(0,140,255,0.08) 0%, transparent 70%)",
    bottom: "-80px",
    right: "-80px",
    pointerEvents: "none",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "64px",
  },
  brandIcon: {
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, #00d4b4, #008cff)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.5px",
  },
  headline: {
    fontSize: "42px",
    fontWeight: 800,
    lineHeight: 1.15,
    color: "#fff",
    letterSpacing: "-1.5px",
    marginBottom: "20px",
  },
  headlineAccent: {
    background: "linear-gradient(90deg, #00d4b4, #008cff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtext: {
    fontSize: "16px",
    color: "rgba(255,255,255,0.45)",
    lineHeight: 1.7,
    maxWidth: "340px",
  },
  featureList: {
    marginTop: "48px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "rgba(255,255,255,0.6)",
    fontSize: "14px",
  },
  featureDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #00d4b4, #008cff)",
    flexShrink: 0,
  },

  // Right form panel
  formSide: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
  },
  cardTitle: {
    fontSize: "28px",
    fontWeight: 800,
    color: "#fff",
    letterSpacing: "-0.8px",
    marginBottom: "8px",
  },
  cardSubtitle: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.4)",
    marginBottom: "40px",
  },

  // Form elements
  fieldGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.6px",
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.5)",
    marginBottom: "8px",
  },
  inputWrap: {
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
    boxSizing: "border-box" as const,
  },
  inputFocused: {
    borderColor: "#00d4b4",
    background: "rgba(0,212,180,0.05)",
  },
  inputError: {
    borderColor: "#ff4d6d",
  },

  // Toggle password button
  toggleBtn: {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "rgba(255,255,255,0.35)",
    fontSize: "18px",
    padding: 0,
    lineHeight: 1,
  },

  // Remember me row
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
  },
  checkLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "rgba(255,255,255,0.45)",
    cursor: "pointer",
  },
  checkbox: {
    accentColor: "#00d4b4",
    width: "15px",
    height: "15px",
    cursor: "pointer",
  },
  forgotLink: {
    fontSize: "13px",
    color: "#00d4b4",
    textDecoration: "none",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },

  // Submit button
  submitBtn: {
    width: "100%",
    padding: "15px",
    background: "linear-gradient(135deg, #00d4b4, #008cff)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 700,
    letterSpacing: "0.3px",
    cursor: "pointer",
    transition: "opacity 0.2s, transform 0.15s",
    marginBottom: "24px",
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    transform: "none",
  },

  // Error banner
  errorBanner: {
    padding: "12px 16px",
    background: "rgba(255,77,109,0.12)",
    border: "1px solid rgba(255,77,109,0.3)",
    borderRadius: "8px",
    color: "#ff4d6d",
    fontSize: "13px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "rgba(255,255,255,0.2)",
    fontSize: "12px",
    marginBottom: "20px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "rgba(255,255,255,0.08)",
  },

  registerRow: {
    textAlign: "center" as const,
    fontSize: "14px",
    color: "rgba(255,255,255,0.4)",
  },
  registerLink: {
    color: "#00d4b4",
    textDecoration: "none",
    fontWeight: 600,
    marginLeft: "6px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    fontSize: "14px",
  },

  // Spinner
  spinner: {
    display: "inline-block",
    width: "18px",
    height: "18px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    verticalAlign: "middle",
    marginRight: "8px",
  },
};

// ─── Component ─────────────────────────────────────────────────────────────────

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const error = useAppSelector(selectAuthError);
  const isLoading = useAppSelector(selectAuthLoading("login"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Redirect after successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Clear error when user starts editing
  useEffect(() => {
    if (error) dispatch(clearError());
  }, [email, password]); // eslint-disable-line

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    await dispatch(login({ email: email.trim(), password }));
  };

  const getInputStyle = (field: string, hasError = false) => ({
    ...styles.input,
    ...(focusedField === field ? styles.inputFocused : {}),
    ...(hasError ? styles.inputError : {}),
  });

  return (
    <>
      {/* Global keyframe for spinner */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={styles.page}>
        {/* ── Left panel ─────────────────────────────────────────── */}
        <div style={styles.panel}>
          <div style={styles.panelGlow} />
          <div style={styles.panelGlow2} />

          <div style={styles.brand}>
            <div style={styles.brandIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span style={styles.brandName}>Nexus</span>
          </div>

          <h1 style={styles.headline}>
            Your workspace,{" "}
            <span style={styles.headlineAccent}>reimagined.</span>
          </h1>
          <p style={styles.subtext}>
            A modern platform built for teams who move fast and ship with
            confidence.
          </p>

          <div style={styles.featureList}>
            {[
              "Real-time collaboration across teams",
              "Enterprise-grade security by default",
              "Seamless integrations with your stack",
            ].map((f) => (
              <div key={f} style={styles.featureItem}>
                <div style={styles.featureDot} />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right form ─────────────────────────────────────────── */}
        <div style={styles.formSide}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Welcome back</h2>
            <p style={styles.cardSubtitle}>
              Sign in to continue to your workspace
            </p>

            {/* Error banner */}
            {error && (
              <div style={styles.errorBanner}>
                <span>⚠</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="email">
                  Email address
                </label>
                <div style={styles.inputWrap}>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    style={getInputStyle("email")}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="password">
                  Password
                </label>
                <div style={styles.inputWrap}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...getInputStyle("password"),
                      paddingRight: "44px",
                    }}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    style={styles.toggleBtn}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot */}
              <div style={styles.row}>
                <label style={styles.checkLabel}>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    style={styles.checkbox}
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  style={styles.forgotLink}
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  ...styles.submitBtn,
                  ...(isLoading || !email || !password
                    ? styles.submitBtnDisabled
                    : {}),
                }}
                disabled={isLoading || !email.trim() || !password.trim()}
              >
                {isLoading && <span style={styles.spinner} />}
                {isLoading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            {/* Divider */}
            <div style={styles.divider}>
              <span style={styles.dividerLine} />
              OR
              <span style={styles.dividerLine} />
            </div>

            {/* Register link */}
            <div style={styles.registerRow}>
              Don't have an account?
              <button
                style={styles.registerLink}
                onClick={() => navigate("/register")}
              >
                Create one
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
