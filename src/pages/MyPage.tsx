import {
  Button,
  Center,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Checkbox,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Spacing, Stack } from "@toss/emotion-utils";
import { useRouter } from "next/router";
import { Suspense, useState } from "react";
import { FixedBottom } from "../components/FixedBottom";
import { resourceLimits } from "worker_threads";

async function fakeApi(id: number) {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve({
        userId: 1,
        email: "zz@zz",
        name: "이준규",
        rentalInfo: null,
        // rentalInfo: {
        //   rentalId: 1,
        //   status: "RENTAL",
        //   serialNumber: "ABCD_EFBS",
        //   businessCode: "01234",
        //   rentalDate: "2023-01-01",
        //   // returnDate: "2023-01-05",
        //   // price: 100,
        // },
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
  const toast = useToast({
    position: "top",
  });

  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isPayAgree, setIsPayAgree] = useState(false);
  const router = useRouter();
  /*
  상태: 렌탈있음 | 반납하고 결제전 | 렌탈 없음
  
  */
  const pushRentalPage = () => {
    localStorage.setItem("userId", String(router.query.id));
    router.push("/rental");
  };

  const result = useQuery(
    ["/my-page", "router.query.id"],
    () => fakeApi(Number(router.query.id)),
    {
      suspense: true,
    }
  );

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      toast({
        title: "결제가 완료되었습니다.",
        description: "",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
    }, 1000);
  };

  const handleReturn = () => {
    setLoading(true);
    setTimeout(() => {
      // TODO 반납 API 호출
      result.refetch();
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      <Heading>사용자</Heading>
      <Spacing size={20} />
      <Text fontSize="2xl">{result.data.name}님, 반갑습니다 !</Text>
      <Spacing size={20} />

      <Stack>
        <Stack.Horizontal>
          <FormLabel style={{ minWidth: "66px" }}>아이디</FormLabel>
          {/* <Input value={result.data.email} isDisabled={true} /> */}
          <Text fontSize={20}>{result.data.email}</Text>
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
      <Spacing size={30} />

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
          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "66px" }}>시리얼번호</FormLabel>
            {/* <Input value={result.data.email} isDisabled={true} /> */}
            <Text fontSize={20}>{result.data.rentalInfo.serialNumber}</Text>
          </Stack.Horizontal>
          <Spacing size={10} />
          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "66px" }}>사업자코드</FormLabel>
            {/* <Input value={result.data.email} isDisabled={true} /> */}
            <Text fontSize={20}>{result.data.rentalInfo.businessCode}</Text>
          </Stack.Horizontal>
          <Spacing size={10} />
          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "66px" }}>렌털시작일</FormLabel>
            {/* <Input value={result.data.email} isDisabled={true} /> */}
            <Text fontSize={20}>{result.data.rentalInfo.rentalDate}</Text>
          </Stack.Horizontal>
          <Spacing size={10} />
          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "66px" }}>렌털반납일</FormLabel>
            {/* <Input value={result.data.email} isDisabled={true} /> */}
            <Text fontSize={20}>{result.data.rentalInfo.returnDate}</Text>
          </Stack.Horizontal>
          <Spacing size={10} />
          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "66px" }}>최종결제금</FormLabel>
            {/* <Input value={result.data.email} isDisabled={true} /> */}
            <Text fontSize={20}>${result.data.rentalInfo.price}</Text>
          </Stack.Horizontal>
          <Spacing size={50} />
          <Checkbox
            colorScheme="blue"
            isChecked={isPayAgree}
            size="sm"
            onChange={() => {
              setIsPayAgree(!isPayAgree);
            }}
          >
            위 결제 내용을 확인하였습니다.
          </Checkbox>

          <FixedBottom>
            <Button
              isLoading={loading}
              colorScheme="blue"
              onClick={handlePayment}
              style={{ width: "100%" }}
              size="lg"
            >
              결제하기
            </Button>
          </FixedBottom>
        </div>
      ) : (
        <div>
          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "66px" }}>시리얼번호</FormLabel>
            {/* <Input value={result.data.email} isDisabled={true} /> */}
            <Text fontSize={20}>{result.data.rentalInfo.serialNumber}</Text>
          </Stack.Horizontal>
          <Spacing size={10} />
          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "66px" }}>사업자코드</FormLabel>
            {/* <Input value={result.data.email} isDisabled={true} /> */}
            <Text fontSize={20}>{result.data.rentalInfo.businessCode}</Text>
          </Stack.Horizontal>
          <Spacing size={10} />
          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "66px" }}>렌털시작일</FormLabel>
            {/* <Input value={result.data.email} isDisabled={true} /> */}
            <Text fontSize={20}>{result.data.rentalInfo.rentalDate}</Text>
          </Stack.Horizontal>
          <FixedBottom>
            <Button
              isLoading={loading}
              colorScheme="blue"
              onClick={handleReturn}
              style={{ width: "100%" }}
              size="lg"
            >
              반납하기
            </Button>
          </FixedBottom>
        </div>
      )}
    </div>
  );
}
