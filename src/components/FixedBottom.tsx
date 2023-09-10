import { ReactNode } from "react";

export function FixedBottom({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        position: "fixed",
        left: 0,
        bottom: 0,
        padding: "24px 24px",
      }}
    >
      {children}
    </div>
  );
}
