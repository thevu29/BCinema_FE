// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <MantineProvider
    theme={{
      fontFamily: "Inter, sans-serif",
      headings: { fontFamily: "Inter, sans-serif" },
    }}
  >
    <ModalsProvider>
      <QueryClientProvider client={queryClient}>
        <Notifications />
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ModalsProvider>
  </MantineProvider>
  // </StrictMode>
);
