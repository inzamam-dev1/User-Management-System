const variants = {
  primary: {
    background: "var(--primary)", color: "#fff", border: "none",
  },
  secondary: {
    background: "var(--surface)", color: "var(--text)",
    border: "1px solid var(--border)",
  },
  danger: {
    background: "var(--danger)", color: "#fff", border: "none",
  },
  ghost: {
    background: "transparent", color: "var(--text-muted)",
    border: "1px solid var(--border)",
  },
};

const sizes = {
  sm: { padding: "6px 14px", fontSize: 13, minHeight: 36 },
  md: { padding: "9px 20px", fontSize: 14, minHeight: 40 },
  lg: { padding: "12px 28px", fontSize: 15, minHeight: 44 },
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
  style = {},
}) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: "var(--radius)",
    fontWeight: 500,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled || loading ? 0.65 : 1,
    transition: "opacity 0.15s, transform 0.1s",
    width: fullWidth ? "100%" : undefined,
    whiteSpace: "nowrap",
    ...variants[variant],
    ...sizes[size],
    ...style,
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} style={base}>
      {loading && (
        <span style={{
          width: 14, height: 14,
          border: "2px solid rgba(255,255,255,0.4)",
          borderTopColor: "#fff",
          borderRadius: "50%",
          display: "inline-block",
          animation: "spin 0.6s linear infinite",
        }} />
      )}
      {children}
    </button>
  );
}
