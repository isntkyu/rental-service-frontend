import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Text,
  Input,
  Radio,
  RadioGroup,
  useToast,
} from "@chakra-ui/react";
import { Spacing, Stack } from "@toss/emotion-utils";
import { FixedBottom } from "../components/FixedBottom";
import { useState } from "react";
import { delay } from "@toss/utils";
import { useRouter } from "next/router";
import api from "../api";

export default function Rental() {
  const userId = Number(localStorage.getItem("userId"));
  const [productType, setProductType] = useState<string>("");
  const [serialNumber, setSerialNumber] = useState<string>("");
  const [businessCode, setBusinessCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState<string>("");
  const [isRentalAgree, setIsRentalAgree] = useState<boolean>(false);

  const [success, setSuccess] = useState<boolean>(false);

  const router = useRouter();

  const canSubmit =
    productType !== "" &&
    serialNumber.length === 9 &&
    businessCode.length === 5 &&
    password.length > 0 &&
    isRentalAgree &&
    !loading;

  const toast = useToast();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await api.post("/rental", {
        serialNumber: serialNumber,
        productType: productType,
        rentalUserId: userId,
        businessCode: businessCode,
        password: password,
      });
      setLoading(false);
      setSuccess(true);
      return;
    } catch (err) {
      toast({
        title: "정확한 정보를 입력해주세요.",
        description: "",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
      return err;
    }
  };

  return (
    <div>
      <Heading>렌털하기</Heading>
      <Spacing size={24} />

      <Text fontSize="2xl">완료되었습니다.</Text>
      <Spacing size={20} />
      {success ? (
        <div>
          <FixedBottom>
            <Button
              isLoading={loading}
              colorScheme="blue"
              onClick={() => {
                router.push(`/my-page/${userId}`);
              }}
              style={{ width: "100%" }}
              size="lg"
            >
              확인
            </Button>
          </FixedBottom>
        </div>
      ) : (
        <div>
          <FormControl>
            <FormLabel>제품선택</FormLabel>
            <RadioGroup
              onChange={(value: string) => {
                setProductType(value);
              }}
              value={productType}
            >
              <Stack.Horizontal>
                <Radio value="유니버셜 프로 & 미니">유니버셜 프로 & 미니</Radio>
                <Radio value="유니버셜 라이트">유니버설 라이트</Radio>
              </Stack.Horizontal>
            </RadioGroup>

            <Spacing size={40} />

            <Stack>
              <Stack.Horizontal>
                <FormLabel style={{ minWidth: "59px" }}>시리얼 번호</FormLabel>
                <Input
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="제품 내부 시리얼 번호 8자리 입력"
                />
              </Stack.Horizontal>

              <Stack.Horizontal>
                <FormLabel style={{ minWidth: "59px" }}>사업자 코드</FormLabel>
                <Input
                  value={businessCode}
                  onChange={(e) => setBusinessCode(e.target.value)}
                  placeholder="렌털하는 사업장의 코드 5자리 입력"
                />
              </Stack.Horizontal>

              <Stack.Horizontal>
                <FormLabel style={{ minWidth: "59px" }}>패스워드</FormLabel>
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

            <Spacing size={50} />
            <Checkbox
              colorScheme="blue"
              isChecked={isRentalAgree}
              size="sm"
              onChange={() => {
                setIsRentalAgree(!isRentalAgree);
              }}
            >
              다이브로이드 렌탈 정책에 대해서 사업자를 통해<br></br> 충분히
              내용을 전달받았음을 확인합니다.
            </Checkbox>

            <FixedBottom>
              <Button
                isDisabled={!canSubmit}
                isLoading={loading}
                colorScheme="blue"
                onClick={handleSubmit}
                style={{ width: "100%" }}
                size="lg"
              >
                렌털하기
              </Button>
            </FixedBottom>
          </FormControl>
        </div>
      )}
    </div>
  );
}
