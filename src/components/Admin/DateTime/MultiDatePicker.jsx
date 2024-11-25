import { Controller } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import "./MultiDatePicker.scss";

const MultiDatePicker = ({ FORM_VALIDATION, control }) => {
  return (
    <Controller
      name="dates"
      control={control}
      rules={FORM_VALIDATION.status}
      render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
        <>
          <DatePicker
            {...field}
            value={value}
            onChange={(dates) => {
              const formattedDates = dates.map(
                (date) => date.format("YYYY-MM-DD")
              );
              onChange(formattedDates);
            }}
            id="dates"
            error={error?.message}
            placeholder="Select dates"
            multiple
            plugins={[<DatePanel key="datePanel" />]}
            style={{
              ...(error && {
                borderColor: "#fa5252",
              }),
            }}
          />
          {error && <p className="text-[#fa5252] text-sm">{error.message}</p>}
        </>
      )}
    />
  );
};

export default MultiDatePicker;
