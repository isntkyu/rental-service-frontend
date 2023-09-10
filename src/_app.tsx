import type { AppProps } from "next/app";
import { padding } from "@toss/emotion-utils";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
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
