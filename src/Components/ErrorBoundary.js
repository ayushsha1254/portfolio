import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(err) {
    return { error: err };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          width: "100%", height: "100%",
          background: "var(--bg-elevated)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-mono)",
          padding: "32px",
          textAlign: "center",
        }}>
          <div style={{
            fontSize: "10px",
            color: "var(--accent-red)",
            letterSpacing: "0.12em",
            marginBottom: "12px",
          }}>
            RUNTIME_ERROR
          </div>
          <div style={{
            fontSize: "11px",
            color: "var(--text-secondary)",
            letterSpacing: "0.02em",
            maxWidth: "320px",
            lineHeight: 1.6,
            marginBottom: "24px",
          }}>
            {this.state.error.message || "An unexpected error occurred."}
          </div>
          <button
            onClick={() => this.setState({ error: null })}
            style={{
              background: "transparent",
              border: "1px solid var(--border-default)",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.08em",
              padding: "6px 16px",
              cursor: "pointer",
              borderRadius: "3px",
              transition: "border-color 150ms, color 150ms",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--border-strong)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border-default)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            RETRY_
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
