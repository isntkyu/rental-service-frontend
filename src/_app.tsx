import type { AppProps } from "next/app";
import { padding } from "@toss/emotion-utils";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: "24px 24px",
      }}
    >
      {children}
    </div>
  );
}
