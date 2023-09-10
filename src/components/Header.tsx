import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function Header({ children }: Props) {
  return (
    <>
      <h2>{children}</h2>
    </>
  );
}
