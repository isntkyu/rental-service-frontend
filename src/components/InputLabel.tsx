import { ComponentProps } from "react";
import { Text } from "@chakra-ui/react";

export function InputLabel({
  children,
  ...props
}: ComponentProps<typeof Text>) {
  return (
    <Text
      style={{
        minWidth: "60px",
        wordBreak: "keep-all",
      }}
      {...props}
    >
      {children}
    </Text>
  );
}
