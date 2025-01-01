import { Button, Result } from "antd";
import Layout from "../components/Layout";
import Link from "next/link";


export default async function Thank() {
  return (
    <Layout>
        <Result
            status="success"
            title="Cảm ơn bạn đã mua hàng !"
            extra={[
            <Link href={'/'} passHref>
                <Button key="buy">Về trang chủ</Button>
            </Link>
        ]}
    />
    </Layout>
  );
}
