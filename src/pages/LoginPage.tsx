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
import api from "../api";

export type UserType = "admin" | "general" | "business";

async function fakeApi(id: string, password: string, userType: UserType) {
  try {
    const res = await api.post("/user/login", {
      userType: userType,
      email: id,
      password: password,
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return err;
  }
}

export default function LoginPage() {
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userType, setUserType] = useState<UserType>("general");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toast = useToast({
    position: "top",
  });

  const canSubmit = id.length > 0 && password.length > 0 && !loading;

  const handleSubmit = async () => {
    setLoading(true);
    // TODO API Login
    const res = await fakeApi(id, password, userType);
    await delay(500);
    setLoading(false);

    if (res.body?.code != null) {
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
      const userId = res.userId;
      const userType = res.userType;

      if (userType === "admin") {
        router.push(`/admin/${userId}`);
      } else if (userType === "business") {
        router.push(`/business/${userId}`);
      } else if (userType === "general") {
        router.push(`/my-page/${userId}`);
      } else {
        toast({
          title: "존재하지 않는 회원입니다.",
          description: "",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
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
          onChange={(value: UserType) => {
            setUserType(value);
          }}
          value={userType}
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
