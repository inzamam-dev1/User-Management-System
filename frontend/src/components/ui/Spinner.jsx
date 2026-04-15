const styles = {
  wrap: {
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  fullscreen: {
    position: "fixed", inset: 0, background: "var(--bg)", zIndex: 9999,
  },
  ring: {
    width: 36, height: 36,
    border: "3px solid var(--border)",
    borderTopColor: "var(--primary)",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
};

const injectKeyframes = () => {
  if (document.getElementById("spinner-kf")) return;
  const s = document.createElement("style");
  s.id = "spinner-kf";
  s.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
  document.head.appendChild(s);
};

export default function Spinner({ fullscreen = false, size = 36 }) {
  injectKeyframes();
  return (
    <div style={{ ...styles.wrap, ...(fullscreen ? styles.fullscreen : {}) }}>
      <div style={{ ...styles.ring, width: size, height: size }} />
    </div>
  );
}
