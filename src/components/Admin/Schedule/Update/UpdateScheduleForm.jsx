import {
    Button,
    Group,
    LoadingOverlay,
    TextInput,
    Select,
    Title,
} from "@mantine/core";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import { showNotification } from "../../../../utils/notication";
import { getScheduleByIdService, updateScheduleService } from "../../../../services/scheduleService";
import { getRoomsService } from "../../../../services/roomService";

const MAX_ITEMS = 150;

const breadcumbData = [
    { title: "Admin", href: "/admin" },
    { title: "Schedules", href: "/admin/schedules" },
    { title: "Update schedule", href: "/admin/schedules/update" },
];

const FORM_VALIDATION = {
    roomId: {
        required: "Room is required",
    },
    date: {
        required: "Date is required",
    },
    time: {
        required: "Time is required",
    },
    status: {
        required: "Status is required",
    },
};

const UpdateScheduleForm = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const [schedule, setSchedule] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, control, reset } = useForm({
        defaultValues: {
            roomId: "",
            date: "",
            time: "",
            status: "Available",
        },
        mode: "onChange",
    });

    useEffect(() => {
        const fetchRooms = async (search, page, sortBy, sortOrder) => {
            try {
                const res = await getRoomsService({
                    search,
                    page,
                    size: MAX_ITEMS,
                    sortBy,
                    sortOrder,
                });

                if (res.success) {
                    const data = res.data.map((Room) => ({
                        value: Room.id,
                        label: Room.name,
                    }));

                    setRooms(data);
                }
            } catch (error) {
                console.error("Error fetching Rooms:", error);
            }
        };

        fetchRooms();

        const fetchData = async () => {
            try {
                const res = await getScheduleByIdService(id);
                if (res.success) {
                    const schedule = res.data;
                    setSchedule(schedule);

                    const date = new Date(schedule.date);
                    const formattedDate = date.toISOString().split("T")[0];

                    let hours = date.getHours();
                    const minutes = date.getMinutes();
                    const seconds = date.getSeconds();

                    hours -= 7;
                    if (hours < 0) {
                        hours += 24; 
                    }

                    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

                    reset({
                        roomId: schedule.roomId,
                        date: formattedDate,
                        time: formattedTime,
                        status: schedule.status,
                    });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [id, reset]);

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);

            const res = await updateScheduleService(id, data);

            if (res.success) {
                showNotification(res.message, "Success");
                navigate("/admin/schedules");
            } else {
                showNotification(res.message, "Error");
            }
        } catch (error) {
            console.error("Error updating schedule:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
            />

            <BreadcumbsComponent items={breadcumbData} />
            <Title order={1} mt={32}>
                Update schedule
            </Title>
            <div className="bg-white p-8 rounded-lg mt-7">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Group grow gap={60}>
                        <Controller
                            name="roomId"
                            control={control}
                            rules={FORM_VALIDATION.roomId}
                            render={({ field, fieldState: { error } }) => (
                                <Select
                                    {...field}
                                    error={error?.message}
                                    label="Room"
                                    size="md"
                                    placeholder="Select room"
                                    data={rooms}
                                    allowDeselect={false}
                                    searchable
                                    nothingFound="No rooms found"
                                    maxDropdownHeight={MAX_ITEMS}
                                />
                            )}
                        />
                        <Controller
                            name="date"
                            control={control}
                            rules={FORM_VALIDATION.date}
                            render={({ field, fieldState: { error } }) => (
                                <TextInput
                                    {...field}
                                    error={error?.message}
                                    label="Date"
                                    size="md"
                                    placeholder="Enter date"
                                />
                            )}
                        />
                    </Group>
                    <Group grow gap={60} mt={24}>

                        <Controller
                            name="status"
                            control={control}
                            rules={FORM_VALIDATION.status}
                            render={({ field, fieldState: { error } }) => (
                                <Select
                                    {...field}
                                    error={error?.message}
                                    label="Status"
                                    size="md"
                                    placeholder="Select status"
                                    data={[
                                        { value: "Available", label: "Available" },
                                        { value: "Ended", label: "Ended" },
                                        { value: "Canceled", label: "Canceled" },
                                    ]}
                                />
                            )}
                        />
                        <Controller
                            name="time"
                            control={control}
                            rules={FORM_VALIDATION.time}
                            render={({ field, fieldState: { error } }) => (
                                <TextInput
                                    {...field}
                                    error={error?.message}
                                    label="Time"
                                    size="md"
                                    placeholder="Enter time"
                                />
                            )}
                        />
                    </Group>

                    <Group mt={32} justify="flex-end">
                        <Link to="/admin/Schedules">
                            <Button variant="filled" color="gray">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" variant="filled">
                            Save
                        </Button>
                    </Group>
                </form>
            </div>
        </>
    )
};

export default UpdateScheduleForm;