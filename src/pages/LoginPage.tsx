import { Heading, Input, Text, FormControl, FormLabel } from "@chakra-ui/react";
import { Spacing, Stack } from "@toss/emotion-utils";
import { delay } from "@toss/utils";
import { Radio, RadioGroup, Button } from "@chakra-ui/react";
import { ComponentProps, useCallback, useState } from "react";
import { FixedBottom } from "../components/FixedBottom";
import { InputLabel } from "../components/InputLabel";

type LoginType = "general" | "business" | "admin";

export default function LoginPage() {
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginType, setLoginType] = useState<LoginType>("general");
  const [loading, setLoading] = useState(false);

  const canSubmit = id.length > 0 && password.length > 0 && !loading;

  const handleSubmit = async () => {
    setLoading(true);
    // TODO API
    await delay(500);
    setLoading(false);
  };

  return (
    <div>
      <Heading>로그인</Heading>
      <Spacing size={24} />

      <FormControl>
        <FormLabel>분류</FormLabel>
        <RadioGroup
          onChange={(value: LoginType) => {
            setLoginType(value);
          }}
          value={loginType}
        >
          <Stack.Horizontal>
            <Radio value="general">사용자</Radio>
            <Radio value="business">사업자</Radio>
            <Radio value="admin">관리자</Radio>
          </Stack.Horizontal>
        </RadioGroup>

        <Spacing size={40} />

        <Stack>
          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "60px" }}>아이디</FormLabel>
            <Input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="example@gmail.com"
            />
          </Stack.Horizontal>

          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "60px" }}>패스워드</FormLabel>
            <Input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="*****"
              type="password"
            />
          </Stack.Horizontal>
        </Stack>

        <FixedBottom>
          <Button
            isDisabled={!canSubmit}
            isLoading={loading}
            colorScheme="blue"
            onClick={handleSubmit}
            style={{ width: "100%" }}
            size="lg"
          >
            로그인
          </Button>
        </FixedBottom>
      </FormControl>
    </div>
  );
}
