import { useCallback, useEffect, useState } from "react";
import {
  Table,
  Group,
  ActionIcon,
  Transition,
  Text,
  NumberInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronUp, IconEye } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import { handleSorting } from "../../../utils/sort";
import { getPaymentsService } from "../../../services/paymentService";
import { formatCurrency } from "../../../utils/currency";
import { formatDate } from "../../../utils/date";
import { getScheduleByIdService } from "../../../services/scheduleService";
import PaginationComponent from "../../Pagination/Pagination";
import FilterPayment from "./Filter/FilterPayment";
import PaymentDetailModal from "./Modal/PaymentDetailModal";

const PaymentTable = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const [payments, setPayments] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [size, setSize] = useState(4);

  const [opened, { open, close }] = useDisclosure(false);

  const fetchPayments = useCallback(
    async (search, date, page, sortBy, sortOrder) => {
      try {
        const res = await getPaymentsService({
          search,
          date,
          page,
          size,
          sortBy,
          sortOrder,
        });

        if (res.success) {
          for (let payment of res.data) {
            const schedule = await getScheduleByIdService(payment.scheduleId);

            payment.schedule = schedule.data;
            delete payment.scheduleId;
          }

          setPayments(res);
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
    const date = params.get("date") || "";
    const page = parseInt(params.get("page")) || 1;
    const _sortBy = params.get("sortBy") || "";
    const _sortOrder = params.get("sortOrder") || "";

    setSortBy(_sortBy);
    setSortOrder(_sortOrder);

    fetchPayments(search, date, page, _sortBy, _sortOrder);
  }, [location.search, fetchPayments]);

  const rows =
    payments &&
    payments.data &&
    payments.data.length > 0 &&
    payments.data.map((payment) => (
      <Table.Tr key={payment.id}>
        <Table.Td>{payment?.userName}</Table.Td>
        <Table.Td>{payment?.schedule?.movieName}</Table.Td>
        <Table.Td>{formatDate(payment?.date)}</Table.Td>
        <Table.Td>{payment?.voucherId ?? "N/A"}</Table.Td>
        <Table.Td>{payment?.point}</Table.Td>
        <Table.Td>{formatCurrency(payment?.totalPrice)}đ</Table.Td>
        <Table.Td>
          <Group gap={6}>
            <ActionIcon
              variant="transparent"
              color="blue"
              radius="xl"
              title="Payment details"
              onClick={() => handleOpenPaymentDetailModal(payment)}
            >
              <IconEye style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Table.Td>
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
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleOpenPaymentDetailModal = (payment) => {
    setSelectedPayment(payment);
    open();
  };

  return (
    <>
      <Table highlightOnHover horizontalSpacing="md" verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>User</Table.Th>
            <Table.Th>Movie</Table.Th>
            <Table.Th
              onClick={() => handleSort("date")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group>
                <Group justify="space-between">
                  <span>Date</span>
                  <Transition
                    mounted={sortBy === "date"}
                    transition={{
                      type: "rotate-left",
                      duration: 200,
                      timingFunction: "ease",
                    }}
                  >
                    {(styles) =>
                      sortBy === "date" && (
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

                <FilterPayment />
              </Group>
            </Table.Th>
            <Table.Th>Voucher</Table.Th>
            <Table.Th>Point</Table.Th>
            <Table.Th
              onClick={() => handleSort("totalPrice")}
              className="cursor-pointer hover:bg-slate-50"
            >
              <Group justify="space-between">
                <span>Total</span>
                <Transition
                  mounted={sortBy === "totalPrice"}
                  transition={{
                    type: "rotate-left",
                    duration: 200,
                    timingFunction: "ease",
                  }}
                >
                  {(styles) =>
                    sortBy === "totalPrice" && (
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
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Group justify="space-between" mt={24}>
        <Group>
          {payments && (
            <span className="text-sm italic text-gray-700 dark:text-gray-400">
              Showing <strong>{payments.take}</strong> of{" "}
              <strong>{payments.totalElements}</strong> entries
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
          currentPage={payments?.page || 1}
          totalPages={payments?.totalPages || 1}
        />
      </Group>

      <PaymentDetailModal
        payment={selectedPayment}
        opened={opened}
        close={close}
      />
    </>
  );
};

export default PaymentTable;
