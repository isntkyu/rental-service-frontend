import {
  Button,
  Heading,
  ListItem,
  UnorderedList,
  Text,
  OrderedList,
  Select,
  Spinner,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuOptionGroup,
  MenuItemOption,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Center,
} from "@chakra-ui/react";
import { Spacing, Stack } from "@toss/emotion-utils";
import { Suspense, useEffect, useState } from "react";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FixedBottom } from "../components/FixedBottom";
import { format } from "date-fns";

async function fakeApi(order: "asc" | "desc", month: string) {
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      if (order === "asc") {
        resolve(["1", "2", "3", "4"]);
      } else {
        resolve(["4", "3", "2", "1"]);
      }
    }, 1000);
  });
}

export default function Admin() {
  return (
    <Suspense fallback={<AdminFallback />}>
      <AdminContent />
    </Suspense>
  );
}

function AdminFallback() {
  return <Spinner />;
}

function AdminContent() {
  // const queryClient = useQueryClient();
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);
  // const [startDate, setStartDate] = useState<string>("");
  // const [endDate, setEndDate] = useState<string>("");
  const [month, setMonth] = useState<string>(format(new Date(), "yyyy-MM"));
  // const router = useRouter();
  const result = useQuery(
    ["/admin", order, month],
    () => fakeApi(order, month),
    {
      suspense: true,
    }
  );

  const toast = useToast({
    position: "top",
  });

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      toast({
        title: "정산이 완료되었습니다.",
        description: "",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
    }, 2000);
  };

  const pickMonth = (month: string) => {
    const monthString = month.split("-")[1];
    return Number(monthString).toString();
  };

  return (
    <div>
      <Heading>관리자</Heading>
      <Spacing size={24} />
      <Heading size="lg">렌털 총괄 현황표</Heading>
      <Spacing size={24} />

      <Stack>
        <div>
          <Stack.Horizontal>
            <Menu closeOnSelect={false}>
              <MenuButton as={Button} colorScheme="blue">
                정렬
              </MenuButton>
              <MenuList minWidth="240px">
                <MenuOptionGroup
                  defaultValue="asc"
                  title="렌털시작일"
                  type="radio"
                  onChange={(value) => {
                    setOrder(value as "asc" | "desc");
                    // queryClient.refetchQueries(["/admin"]);
                    result.refetch();
                  }}
                >
                  <MenuItemOption value="asc">오름차순</MenuItemOption>
                  <MenuItemOption value="desc">내림차순</MenuItemOption>
                </MenuOptionGroup>
              </MenuList>
            </Menu>
            <Input
              width={40}
              type="month"
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
                result.refetch();
              }}
            />
          </Stack.Horizontal>
        </div>
      </Stack>
      <Spacing size={20} />
      <Stack.Horizontal>
        {/* <Text>~</Text>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            result.refetch();
          }}
        /> */}
      </Stack.Horizontal>
      <Spacing size={20} />

      <Heading>{pickMonth(month)}월 렌털 내역</Heading>
      <Spacing size={20} />

      {/* <OrderedList>
        {result.data?.map((x) => (
          <ListItem key={x}>{x}</ListItem>
        ))}
      </OrderedList> */}
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
            {result.data?.map((x) => (
              <Tr>
                <Td>a</Td>
                <Td>a</Td>
                <Td>a</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Spacing size={50} />
      <Heading size="md" textAlign="center">
        {pickMonth(month)}월 총 렌털 비용: ${0}
      </Heading>

      <FixedBottom>
        <Button
          isDisabled={result.data == null || result.data?.length === 0}
          colorScheme="blue"
          isLoading={loading}
          onClick={handleSubmit}
          style={{ width: "100%" }}
          size="lg"
        >
          정산하기
        </Button>
      </FixedBottom>
    </div>
  );
}
