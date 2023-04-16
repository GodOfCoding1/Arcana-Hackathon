import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { any, func, string } from "prop-types";

BasicDatePicker.propTypes = { value: any, onChange: func, label: string };
function BasicDatePicker({ value, onChange, label }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <DatePicker
          disableFuture={true}
          sx={{ m: 1 }}
          value={value}
          onChange={onChange}
          label={label}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

export default BasicDatePicker;
