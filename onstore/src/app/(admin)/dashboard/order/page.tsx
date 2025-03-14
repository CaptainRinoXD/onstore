import OrderTable from "@/app/components/admin/order/order.table";

interface IProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}
const ManageOrderPage = async (props: IProps) => {

  const respon = await fetch(`http://localhost:3002/api/orders`, {
    method: "GET", // Thay đổi method thành POST
    headers: {
      "Content-Type": "application/json", // Xác định loại dữ liệu được gửi
    },
    next: { tags: ["list-order"] }
  }).then(res => {
     return res.json() 
  })

  return (
    <div>
      <OrderTable orders={respon ?? []} />
    </div>
  );
};

export default ManageOrderPage;
