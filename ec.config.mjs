// Shared by the Markdown integration and the Citation <Code> component.
export default {
  styleOverrides: {
    borderRadius: "0.5rem",
    borderWidth: "0",
    codeBackground: "var(--citation-background)",
    frames: {
      shadowColor: "transparent",
    },
  },
  themeCssSelector: (theme) =>
    theme.type === "dark" ? `[data-theme="dark"]` : `[data-theme="light"]`,
};
