import { useRouter } from "next/router";

export default function MyPage() {
  const router = useRouter();
  console.log(router.query.id);
  /*
  상태: 렌탈있음 | 반납하고 결제전 | 렌탈 없음
  
  */

  return <div>hello profile</div>;
}
