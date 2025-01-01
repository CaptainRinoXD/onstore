import { Grid, Typography } from "@mui/material";
import OrderList from "../components/main/main.orderlist";
import Layout from "../components/Layout";

export default async function Order() {
  return (
    <Layout>
      <Grid sx={{ margin: "10px 40px" }}>
        <Grid>
          <Typography sx={{ fontSize: "30px", fontWeight: "bold" }}>
            Đơn hàng đã đặt
          </Typography>
        </Grid>
        <Grid >
          <OrderList></OrderList>
        </Grid>
      </Grid>
    </Layout>
  );
}
