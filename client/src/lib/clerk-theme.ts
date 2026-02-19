/**
 * Shared Clerk appearance for sign-in and sign-up.
 * Uses same values as globals.css (5-7): --background, --surface, --error.
 */
const background = "#121212";
const surface = "#121212";
const error = "#cf6679";

export const clerkAppearance = {
  variables: {
    colorPrimary: error,
    colorBackground: background,
    colorInputBackground: "#1e1e1e",
    colorInputText: "#ffffff",
    colorText: "#ffffff",
    colorTextSecondary: "#a4b3b6",
    colorForeground: "#ffffff",
    colorMutedForeground: "#a4b3b6",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: {
      background,
    },
    card: {
      background: surface,
      boxShadow: "none",
    },
    headerTitle: {
      color: "#ffffff",
    },
    headerSubtitle: {
      color: "#a4b3b6",
    },
    formFieldLabel: {
      color: "#a4b3b6",
    },
    formFieldInput: {
      background: "#1e1e1e",
      color: "#ffffff",
    },
    formButtonPrimary: {
      background: error,
      color: "#ffffff",
    },
    footerActionLink: {
      color: error,
    },
    socialButtonsBlockButton: {
      background: "#1e1e1e",
      color: "#ffffff",
      border: "1px solid rgba(255,255,255,0.12)",
    },
    dividerLine: {
      background: "rgba(255,255,255,0.12)",
    },
    dividerText: {
      color: "#a4b3b6",
    },
    identityPreviewEditButton: {
      color: "#a4b3b6",
    },
  },
};
