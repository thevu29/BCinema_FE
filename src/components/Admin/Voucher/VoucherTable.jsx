import { useCallback, useEffect, useState } from "react";
import {
  Table,
  Group,
  LoadingOverlay,
  Transition,
  Text,
  NumberInput,
} from "@mantine/core";
import { IconChevronUp } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import { handleSorting } from "../../../utils/sort";
import { getVouchersService } from "../../../services/voucherService";
import { formatDate } from "../../../utils/date";
import PaginationComponent from "../../Pagination/Pagination";
import FilterVoucher from "./Filter/FilterVoucher";

const VoucherTable = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [vouchers, setVouchers] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [size, setSize] = useState(4);

  const fetchVouchers = useCallback(
    async (search, discount, page, sortBy, sortOrder) => {
      try {
        const res = await getVouchersService({
          search,
          discount,
          page,
          size,
          sortBy,
          sortOrder,
        });

        if (res.success) {
          setVouchers(res);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [size]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const search = params.get("search") || "";
    const discount = params.get("discount") || "";
    const page = parseInt(params.get("page")) || 1;
    const _sortBy = params.get("sortBy") || "";
    const _sortOrder = params.get("sortOrder") || "";

    setSortBy(_sortBy);
    setSortOrder(_sortOrder);

    fetchVouchers(search, discount, page, _sortBy, _sortOrder);
  }, [location.search, fetchVouchers]);

  const rows =
    vouchers &&
    vouchers.data &&
    vouchers.data.length > 0 &&
    vouchers.data.map((voucher) => (
      <Table.Tr key={voucher.id}>
        <Table.Td>{voucher.code}</Table.Td>
        <Table.Td>{voucher.discount}%</Table.Td>
        <Table.Td>{voucher.description}</Table.Td>
        <Table.Td>{formatDate(voucher.expireAt)}</Table.Td>
      </Table.Tr>
    ));

  const handleSort = (field) => {
    let newOrder = "asc";
    if (sortBy === field) {
      newOrder = sortOrder === "asc" ? "desc" : "asc";
    }
    setSortBy(field);
    setSortOrder(newOrder);
    handleSorting(field, newOrder, location, pathname, navigate);
  };

  const handleSizeChange = (size) => {
    setSize(+size);
    const params = new URLSearchParams(location.search);
    params.delete("page");
  };

  return (
    <>
      <LoadingOverlay zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      <Table highlightOnHover horizontalSpacing="md" verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th
              onClick={() => handleSort("code")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Code</span>
                <Transition
                  mounted={sortBy === "code"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "code" && (
                      <IconChevronUp
                        style={{
                          transform:
                            sortOrder === "asc"
                              ? "rotate(0deg)"
                              : "rotate(180deg)",
                          ...styles,
                        }}
                        width={16}
                        height={16}
                      />
                    )
                  }
                </Transition>
              </Group>
            </Table.Th>
            <Table.Th
              onClick={() => handleSort("discount")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group>
                <Group justify="space-between">
                  <span>Discount</span>
                  <Transition
                    mounted={sortBy === "discount"}
                    transition={{
                      type: "rotate-left",
                      duration: 200,
                      timingFunction: "ease",
                    }}
                  >
                    {(styles) =>
                      sortBy === "discount" && (
                        <IconChevronUp
                          style={{
                            transform:
                              sortOrder === "asc"
                                ? "rotate(0deg)"
                                : "rotate(180deg)",
                            ...styles,
                          }}
                          width={16}
                          height={16}
                        />
                      )
                    }
                  </Transition>
                </Group>

                <FilterVoucher />
              </Group>
            </Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => handleSort("expireAt")}
            >
              <Group justify="space-between">
                <span>Expire Date</span>
                <Transition
                  mounted={sortBy === "expireAt"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "expireAt" && (
                      <IconChevronUp
                        style={{
                          transform:
                            sortOrder === "asc"
                              ? "rotate(0deg)"
                              : "rotate(180deg)",
                          ...styles,
                        }}
                        width={16}
                        height={16}
                      />
                    )
                  }
                </Transition>
              </Group>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        <Group>
          {vouchers && (
            <span className="text-sm italic text-gray-700 dark:text-gray-400">
              Showing <strong>{vouchers.take}</strong> of{" "}
              <strong>{vouchers.totalElements}</strong> entries
            </span>
          )}

          <Group gap={4}>
            <Text size="xs" fw={700}>
              Per page:
            </Text>
            <NumberInput
              maw={50}
              size="xs"
              value={size}
              onChange={(e) => handleSizeChange(e)}
            />
          </Group>
        </Group>

        <PaginationComponent
          currentPage={
            parseInt(new URLSearchParams(location.search).get("page")) || 1
          }
          totalPages={vouchers?.totalPages || 1}
        />
      </Group>
    </>
  );
};

export default VoucherTable;
