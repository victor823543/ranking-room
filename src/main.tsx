import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { GOOGLE_CLIENT_ID } from "./config";
import AuthProvider from "./provider/authProvider";
import { ThemeProvider } from "./provider/themeProvider";
import Routes from "./routes";
import "./styles/global.css";
import "./styles/index.css";
import "./styles/theme.css";
import "./styles/variables.css";

const queryClient = new QueryClient({
  defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
});

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <ThemeProvider>
                <Routes />
              </ThemeProvider>
            </AuthProvider>
          </QueryClientProvider>
        </Provider>
      </GoogleOAuthProvider>
    </React.StrictMode>,
  );
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  );
}
