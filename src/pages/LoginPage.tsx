import {
  Heading,
  Input,
  Text,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { Spacing, Stack } from "@toss/emotion-utils";
import { delay } from "@toss/utils";
import { Radio, RadioGroup, Button } from "@chakra-ui/react";
import { ComponentProps, useCallback, useState } from "react";
import { FixedBottom } from "../components/FixedBottom";
import { InputLabel } from "../components/InputLabel";
import { useRouter } from "next/router";

type LoginType = "general" | "business" | "admin";
export type UserType = "ADMIN" | "GENERAL" | "BUSINESS";

interface Res {
  body: {
    code?: string;
    userId: number;
    userType: UserType;
  };
}

async function fakeApi(id: string, password: string, loginType: LoginType) {
  return new Promise<Res>((resolve) => {
    setTimeout(() => {
      resolve({
        body: {
          userType: "BUSINESS",
          userId: 1,
        },
      });
    }, 1000);
  });
}

export default function LoginPage() {
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginType, setLoginType] = useState<LoginType>("general");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toast = useToast({
    position: "top",
  });

  const canSubmit = id.length > 0 && password.length > 0 && !loading;

  const handleSubmit = async () => {
    setLoading(true);
    // TODO API Login
    const res: Res = await fakeApi(id, password, loginType);
    await delay(500);
    setLoading(false);

    if (res.body.code != null) {
      if (res.body?.code === "Fail") {
        toast({
          title: "아이디/패스워드를 확인해주세요.",
          description: "",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else if (res.body?.code === "NotFound") {
        toast({
          title: "존재하지 않는 회원입니다.",
          description: "",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "서버 에러",
          description: "",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } else {
      const userId = res.body.userId;
      const userType = res.body.userType;

      if (userType === "ADMIN") {
        router.push(`/admin/${userId}`);
      } else if (userType === "BUSINESS") {
        router.push(`/business/${userId}`);
      } else if (userType === "GENERAL") {
        router.push(`/my-page/${userId}`);
      }
    }
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
              placeholder="******"
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
