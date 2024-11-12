import { IconPlus } from "@tabler/icons-react";
import { Button, Group, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import Search from "../Search/Search";
import VoucherTable from "./VoucherTable";

const breadcumbData = [{ title: "Admin", href: "/admin" }, { title: "Vouchers" }];

const Voucher = () => {
    return (
      <>
        <BreadcumbsComponent items={breadcumbData} />
        <Title order={1} mt={32}>
          Vouchers
        </Title>
  
        <div className="bg-white p-8 rounded-lg mt-7">
          <Group justify="space-between" mb={24}>
            <Search placeholder="Search vouchers" />
  
            <Group>
              
              <Link to="/admin/vouchers/create">
                <Button
                  leftSection={<IconPlus />}
                  variant="filled"
                  color="indigo"
                  radius="md"
                >
                  Create voucher
                </Button>
              </Link>
            </Group>
          </Group>
  
          <VoucherTable/>
        </div>
      </>
    );
}

export default Voucher;
