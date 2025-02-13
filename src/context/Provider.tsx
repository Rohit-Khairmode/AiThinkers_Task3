"use client";

import { Toaster } from "react-hot-toast";
import { AuthContextProvider } from "./AuthContext";

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AuthContextProvider>{children}</AuthContextProvider>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "var(--secondary-background)",
            color: "var(--secondary-text)",
          },
        }}
      />
    </div>
  );
}

export default Provider;
