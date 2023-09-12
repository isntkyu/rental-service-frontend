import {
  Button,
  Center,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Checkbox,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Spacing, Stack } from "@toss/emotion-utils";
import { useRouter } from "next/router";
import { Suspense, useState } from "react";
import { FixedBottom } from "../components/FixedBottom";

async function fakeApi(id: number) {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve({
        userId: 1,
        email: "zz@zz",
        name: "이준규",
        // rentalInfo: null,
        rentalInfo: {
          rentalId: 1,
          status: "RETURN",
        },
      });
    }, 1000);
  });
}

export default function MyPage() {
  return (
    <Suspense fallback={<MyPageFallback />}>
      <MyPageContent />
    </Suspense>
  );
}

function MyPageFallback() {
  return <Spinner />;
}

function MyPageContent() {
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isPayAgree, setIsPayAgree] = useState(false);
  const router = useRouter();
  console.log(router.query.id);
  /*
  상태: 렌탈있음 | 반납하고 결제전 | 렌탈 없음
  
  */
  const pushRentalPage = () => {};

  const result = useQuery(
    ["/my-page", "router.query.id"],
    () => fakeApi(Number(router.query.id)),
    {
      suspense: true,
    }
  );

  return (
    <div>
      <Heading>사용자</Heading>
      <Spacing size={20} />
      <Text fontSize="2xl">{result.data.name}님, 반갑습니다 !</Text>
      <Spacing size={20} />

      <Stack>
        <Stack.Horizontal>
          <FormLabel style={{ minWidth: "50px" }}>아이디</FormLabel>
          <Input value={result.data.email} isDisabled={true} />
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

      <Spacing size={40} />
      <Heading size="sm">렌털정보</Heading>
      <Spacing size={20} />

      {result.data.rentalInfo === null ? (
        <div>
          <Text color={"GrayText"} align={"center"}>
            고객님의 렌털 정보를 확인할 수 없습니다.
          </Text>
          <FixedBottom>
            <Button
              isLoading={loading}
              colorScheme="blue"
              onClick={pushRentalPage}
              style={{ width: "100%" }}
              size="lg"
            >
              렌털하기
            </Button>
          </FixedBottom>
        </div>
      ) : result.data.rentalInfo.status === "RETURN" ? (
        <div>
          <Text>aa</Text>
          <Checkbox
            colorScheme="blue"
            isChecked={!isPayAgree}
            onChange={() => {
              setIsPayAgree(!isPayAgree);
            }}
          >
            위 결제 내용을 확인하였습니다.
          </Checkbox>
        </div>
      ) : (
        <Text>bb</Text>
      )}
    </div>
  );
}
