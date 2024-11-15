import {
    Button,
    Group,
    LoadingOverlay,
    TextInput,
    Title,
    Select,
    Textarea,
} from "@mantine/core";
import { DateInput } from '@mantine/dates';
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import BreadcumbsComponent from "../../../Breadcumbs/Breadcumbs";
import { showNotification } from "../../../../utils/notication";
import { addScheduleService } from "../../../../services/scheduleService";
import { getRoomsService } from "../../../../services/roomService";
import moment from "moment-timezone";

const MAX_ITEMS = 150;

const breadcumbData = [
    { title: "Admin", href: "/admin" },
    { title: "Schedules", href: "/admin/schedules" },
    { title: "Create schedule" },
];

const FORM_VALIDATION = {
    movieId: {
        required: "Movie is required",
    },
    roomId: {
        required: "Room is required",
    },
    date: {
        required: "Date is required",
    },
    times: {
        required: "Times is required",
    },
    status: {
        required: "Status is required",
    },
};

const CreateScheduleForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [rooms, setRooms] = useState([]);

    const { handleSubmit, control } = useForm({
        defaultValues: {
            movieId: "",
            roomId: "",
            date: "",
            times: "",
            status: "Available",
        },
        mode: "onChange"
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
    }, []);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const timeArray = data.times.split(",").map((time) => time.trim());
            const formattedDate = moment.tz(data.date, "Asia/Bangkok").format("YYYY-MM-DD");
            const scheduleData = { 
                ...data, 
                times: timeArray,
                date: formattedDate,
            };

            const res = await addScheduleService(scheduleData);

            if (res.success) {
                showNotification(res.message, "Schedule created successfully");
                navigate("/admin/schedules");
            } else {
                showNotification(res.message, "Error");
            }
        } catch (error) {
            showNotification("Error adding schedule:", error);
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
                Create Room
            </Title>
            <div className="bg-white p-8 rounded-lg mt-7">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Group grow gap={60}>
                        <Controller
                            name="movieId"
                            control={control}
                            rules={FORM_VALIDATION.movieId}
                            render={({ field, fieldState: { error } }) => (
                                <TextInput
                                    {...field}
                                    error={error?.message}
                                    label="Movie ID"
                                    size="md"
                                    placeholder="Enter movie ID"
                                />
                            )}
                        />

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
                    </Group>
                    <Group grow gap={60} mt={24}>
                        <Controller
                            name="date"
                            control={control}
                            rules={FORM_VALIDATION.date}
                            render={({ field, fieldState: { error } }) => (
                                <DateInput 
                                    valueFormat="YYYY-MM-DD"
                                    withSeconds
                                    {...field}
                                    error={error?.message}
                                    label="Date"
                                    size="md"
                                    placeholder="Enter date"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />

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
                    </Group>

                    <Group grow gap={60} mt={24}>
                        <Controller
                            name="times"
                            control={control}
                            rules={FORM_VALIDATION.times}
                            render={({ field, fieldState: { error } }) => (
                                <Textarea
                                    {...field}
                                    error={error?.message}
                                    label="Times"
                                    size="md"
                                    placeholder="Enter times separated by commas"
                                />
                            )}
                        />
                    </Group>

                    <Group mt={32} justify="flex-end">
                        <Link to="/admin/schedules">
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
    );
};

export default CreateScheduleForm;