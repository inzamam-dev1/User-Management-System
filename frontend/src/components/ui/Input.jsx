export default function Input({
  label,
  error,
  id,
  type = "text",
  style = {},
  ...props
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && (
        <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        style={{
          padding: "9px 13px",
          borderRadius: "var(--radius)",
          border: `1px solid ${error ? "var(--danger)" : "var(--border)"}`,
          fontSize: 14,
          color: "var(--text)",
          background: "var(--surface)",
          outline: "none",
          transition: "border-color 0.15s",
          width: "100%",
          minHeight: 44,
          ...style,
        }}
        {...props}
      />
      {error && (
        <span style={{ fontSize: 12, color: "var(--danger)" }}>{error}</span>
      )}
    </div>
  );
}
