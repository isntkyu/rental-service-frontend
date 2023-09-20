import {
  Heading,
  Spinner,
  useToast,
  Text,
  FormLabel,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
} from "@chakra-ui/react";
import { Suspense, useState } from "react";
import { UserType } from "./LoginPage";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Spacing, Stack } from "@toss/emotion-utils";
import { FixedBottom } from "../components/FixedBottom";
import api from "../api";

async function fakeApi(userType: UserType, userId: number) {
  const res = await api.get(`/user/business/${userId}`);
  return res.data;
}

export default function Business() {
  return (
    <Suspense fallback={<BusinessFallback />}>
      <BusinessContent />
    </Suspense>
  );
}

function BusinessFallback() {
  return <Spinner />;
}

function BusinessContent() {
  const [settled, setSettled] = useState(false);

  const toast = useToast({
    position: "top",
  });

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    // await api.post("/rental/settlement", {
    //   rentalId: result.data.rentalList.map((rental: any) => {
    //     return rental.rentalIds;
    //   }),
    // });
    toast({
      title: "정산이 완료되었습니다.",
      description: "",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    setSettled(true);
    setLoading(false);
  };

  const result = useQuery(
    ["/business", router.query.id, settled],
    () => fakeApi("business", Number(router.query.id)),
    {
      suspense: true,
    }
  );

  return (
    <div>
      <Heading>사업자</Heading>
      <Spacing size={20} />
      <Text fontSize="2xl">{result.data.name}님, 안녕하세요 !</Text>

      <Spacing size={20} />
      <Stack>
        <Stack.Horizontal>
          <FormLabel style={{ minWidth: "70px" }}>아이디</FormLabel>
          <Text fontSize={20}>{result.data.email}</Text>
        </Stack.Horizontal>

        <Stack.Horizontal>
          <FormLabel style={{ minWidth: "50px" }}>사업자 코드</FormLabel>
          <Text fontSize={20}>{result.data.businessCode}</Text>
        </Stack.Horizontal>
      </Stack>

      <Spacing size={20} />

      <Heading size="sm">렌털 회원 목록</Heading>

      <Spacing size={20} />
      <TableContainer>
        <Table variant="simple" size="sm">
          {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
          <Thead>
            <Tr>
              <Th>사용자</Th>
              <Th>렌털 기간</Th>
              <Th>제품명</Th>
            </Tr>
          </Thead>
          <Tbody>
            {result.data.rentalList.map((item: any) => (
              <Tr key={item.rentalId}>
                <Td>{item.email}</Td>
                <Td>{item.rentalPeriod}</Td>
                <Td>{item.productType}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <FixedBottom>
        <Button
          isDisabled={result.data == null || result.data?.length === 0}
          colorScheme="blue"
          isLoading={loading}
          onClick={handleSubmit}
          style={{ width: "100%" }}
          size="lg"
        >
          정산받기
        </Button>
      </FixedBottom>
    </div>
  );
}
