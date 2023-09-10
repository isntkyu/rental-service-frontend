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
} from "@chakra-ui/react";
import { Spacing, Stack } from "@toss/emotion-utils";
import { Suspense, useEffect, useState } from "react";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FixedBottom } from "../components/FixedBottom";

async function fakeApi(
  order: "asc" | "desc",
  startDate: string,
  endDate: string
) {
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      if (order === "asc") {
        resolve(["1", "2", "3", "4"]);
      } else if (startDate === "") {
        resolve(["", "2"]);
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
  console.log("fallback");
  return <Spinner />;
}

function AdminContent() {
  const queryClient = useQueryClient();
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  // const router = useRouter();
  const result = useQuery(
    ["/admin", order, startDate, endDate],
    () => fakeApi(order, startDate, endDate),
    {
      suspense: true,
    }
  );

  const toast = useToast();
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

  console.log({ startDate, endDate });

  return (
    <div>
      <Heading>관리자</Heading>
      <Spacing size={24} />
      <Heading size="lg">렌털 총괄 현황표</Heading>
      <Spacing size={24} />

      <Stack>
        <div>
          <Menu closeOnSelect={false}>
            <MenuButton as={Button} colorScheme="blue">
              정렬
            </MenuButton>
            <MenuList minWidth="240px">
              <MenuOptionGroup
                defaultValue="asc"
                title="Order"
                type="radio"
                onChange={(value) => {
                  setOrder(value as "asc" | "desc");
                  queryClient.refetchQueries(["/admin"]);
                }}
              >
                <MenuItemOption value="asc">오름차순</MenuItemOption>
                <MenuItemOption value="desc">내림차순</MenuItemOption>
              </MenuOptionGroup>
            </MenuList>
          </Menu>
        </div>
      </Stack>
      <Spacing size={20} />
      <Stack.Horizontal>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            result.refetch();
          }}
        />
        <Text>~</Text>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            result.refetch();
          }}
        />
      </Stack.Horizontal>
      <Spacing size={20} />
      <OrderedList>
        {result.data?.map((x) => (
          <ListItem key={x}>{x}</ListItem>
        ))}
      </OrderedList>

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
