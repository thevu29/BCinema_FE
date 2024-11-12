import { useEffect, useState } from "react";
import { Table, Group, LoadingOverlay, Transition } from "@mantine/core";
import { IconChevronUp } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import PaginationComponent from "../../Pagination/Pagination";
import { handleSorting } from "../../../utils/sort";
import { getVouchersService } from "../../../services/voucherService";

const ITEMS_PER_PAGE = 4;

const VoucherTable = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [vouchers, setVouchers] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchVouchers = async (search, page, sortBy, sortOrder) => {
    try {
      const res = await getVouchersService({
        search,
        page,
        size: ITEMS_PER_PAGE,
        sortBy,
        sortOrder,
      });

      if (res.success) {
        setVouchers(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const search = params.get("search") || "";
    const page = parseInt(params.get("page")) || 1;
    const _sortBy = params.get("sortBy") || "";
    const _sortOrder = params.get("sortOrder") || "";

    setSortBy(_sortBy);
    setSortOrder(_sortOrder);

    fetchVouchers(search, page, _sortBy, _sortOrder);
  }, [location.search]);


  const rows =
    vouchers &&
    vouchers.data &&
    vouchers.data.length > 0 &&
    vouchers.data.map((voucher) => {
      const createAt = new Date(voucher.createAt).toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
      const expireAt = new Date(voucher.expireAt).toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
    return (
      <Table.Tr
        key={voucher.id}
      >
        <Table.Td>{voucher.code}</Table.Td>
        <Table.Td>{voucher.discount}%</Table.Td>
        <Table.Td>{voucher.description}</Table.Td>
        <Table.Td>{createAt}</Table.Td>
        <Table.Td>{expireAt}</Table.Td>
      </Table.Tr>
    );
  }); 

  const handleSort = (field) => {
    let newOrder = "asc";
    if (sortBy === field) {
      newOrder = sortOrder === "asc" ? "desc" : "asc";
    }
    setSortBy(field);
    setSortOrder(newOrder);
    handleSorting(field, newOrder, location, pathname, navigate);
  };

  return (
    <>
      <LoadingOverlay
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

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
            </Table.Th>
            <Table.Th
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Description</span>
                <Transition
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                </Transition>
              </Group>
            </Table.Th>
            <Table.Th
              onClick={() => handleSort("createAt")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Create Date</span>
                <Transition
                  mounted={sortBy === "createAt"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "createAt" && (
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
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Expire Date</span>
                <Transition
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                </Transition>
              </Group>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        {vouchers && (
          <span className="text-sm italic text-gray-700 dark:text-gray-400">
            Showing <strong>{vouchers.take}</strong> of{" "}
            <strong>{vouchers.totalElements}</strong> entries
          </span>
        )}

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
