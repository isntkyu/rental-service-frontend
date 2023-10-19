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
import api from "../api";
import { usePathname } from "next/navigation";

async function fakeApi(id: number) {
  try {
    const res = await api.get(`/user/general/${id}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return err;
  }
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
  const [returned, setReturned] = useState(false);
  const [depositer, setDepositer] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();

  const pushRentalPage = () => {
    localStorage.setItem("userId", String(pathname?.split("/")[2]));
    router.push("/rental");
  };

  const result = useQuery(
    ["/my-page", pathname?.split("/")[2], returned],
    () => fakeApi(Number(pathname?.split("/")[2])),
    {
      suspense: true,
    }
  );

  const handlePayment = async () => {
    setLoading(true);

    await api.post("/rental/payment", {
      rentalId: result.data.rentalInfo?.rentalId,
      depositer: depositer,
    });

    toast({
      title: "입금완료 요청이 되었습니다.",
      description: "",
      status: "success",
      duration: 9000,
      isClosable: true,
    });

    setReturned(true);
    result.refetch();
    setLoading(false);
  };

  const handleReturn = async () => {
    setLoading(true);
    try {
      await api.post("/rental/return", {
        email: result.data.email,
        password: password,
        rentalId: result.data.rentalInfo?.rentalId,
      });
      setReturned(true);
      toast({
        title: "반납신청이 완료되었습니다.",
        description: "",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      result.refetch();
      setLoading(false);
    } catch (err) {
      toast({
        title: "앱에서 기기 해제를 먼저 진행해주세요.",
        description: "",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleFinishRental = async () => {
    setLoading(true);

    await api.post("/rental/finish", {
      rentalId: result.data.rentalInfo?.rentalId,
    });

    toast({
      title: "최종반납이 완료되었습니다.",
      description: "",
      status: "success",
      duration: 9000,
      isClosable: true,
    });

    setReturned(true);
    result.refetch();
    setLoading(false);
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

      {result.data?.rentalInfo === null ? (
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
      ) : result.data.rentalInfo?.status === 201 ||
        result.data.rentalInfo?.status === 200 ? (
        <div>
          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "66px" }}>시리얼번호</FormLabel>
            {/* <Input value={result.data.email} isDisabled={true} /> */}
            <Text fontSize={20}>{result.data.rentalInfo?.serialNumber}</Text>
          </Stack.Horizontal>
          <Spacing size={10} />
          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "66px" }}>사업자코드</FormLabel>
            {/* <Input value={result.data.email} isDisabled={true} /> */}
            <Text fontSize={20}>{result.data.rentalInfo?.businessCode}</Text>
          </Stack.Horizontal>
          <Spacing size={10} />
          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "66px" }}>렌털시작일</FormLabel>
            {/* <Input value={result.data.email} isDisabled={true} /> */}
            <Text fontSize={20}>{result.data.rentalInfo?.rentalDate}</Text>
          </Stack.Horizontal>
          <Spacing size={10} />
          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "66px" }}>렌털반납일</FormLabel>
            {/* <Input value={result.data.email} isDisabled={true} /> */}
            <Text fontSize={20}>{result.data.rentalInfo?.returnDate}</Text>
          </Stack.Horizontal>
          <Spacing size={10} />
          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "66px" }}>최종결제금</FormLabel>
            {/* <Input value={result.data.email} isDisabled={true} /> */}
            <Text fontSize={20}>${result.data.rentalInfo?.price}</Text>
          </Stack.Horizontal>

          <Spacing size={40} />
          <Heading size="sm">결제정보</Heading>
          <Spacing size={30} />
          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "66px" }}>예금주</FormLabel>
            {/* <Input value={result.data.email} isDisabled={true} /> */}
            <Text fontSize={20}>이준규</Text>
          </Stack.Horizontal>
          <Spacing size={10} />
          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "66px" }}>계좌번호</FormLabel>
            {/* <Input value={result.data.email} isDisabled={true} /> */}
            <Text fontSize={20}>92883-2883-199</Text>
          </Stack.Horizontal>
          <Spacing size={10} />
          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "66px" }}>은행명</FormLabel>
            {/* <Input value={result.data.email} isDisabled={true} /> */}
            <Text fontSize={20}>국민은행</Text>
          </Stack.Horizontal>
          <Spacing size={10} />
          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "66px" }}>입금자명</FormLabel>
            <Input
              value={depositer}
              onChange={(e) => setDepositer(e.target.value)}
              placeholder="입금하실 성함을 입력해주세요."
            />
            <Button onClick={handlePayment}>입금완료</Button>
          </Stack.Horizontal>

          <Spacing size={40} />
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
              isDisabled={!isPayAgree || result.data.rentalInfo.status !== 200}
              onClick={handleFinishRental}
              style={{ width: "100%" }}
              size="lg"
            >
              반납완료
            </Button>
          </FixedBottom>
        </div>
      ) : (
        <div>
          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "66px" }}>시리얼번호</FormLabel>
            {/* <Input value={result.data.email} isDisabled={true} /> */}
            <Text fontSize={20}>{result.data.rentalInfo?.serialNumber}</Text>
          </Stack.Horizontal>
          <Spacing size={10} />
          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "66px" }}>사업자코드</FormLabel>
            {/* <Input value={result.data.email} isDisabled={true} /> */}
            <Text fontSize={20}>{result.data.rentalInfo?.businessCode}</Text>
          </Stack.Horizontal>
          <Spacing size={10} />
          <Stack.Horizontal>
            <FormLabel style={{ minWidth: "66px" }}>렌털시작일</FormLabel>
            {/* <Input value={result.data.email} isDisabled={true} /> */}
            <Text fontSize={20}>{result.data.rentalInfo?.rentalDate}</Text>
          </Stack.Horizontal>
          <FixedBottom>
            <Button
              isLoading={loading}
              colorScheme="blue"
              onClick={handleReturn}
              style={{ width: "100%" }}
              size="lg"
            >
              반납신청하기
            </Button>
          </FixedBottom>
        </div>
      )}
    </div>
  );
}
