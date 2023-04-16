import React from "react";
import { Button, Card, Stack, Typography } from "@mui/material";
import BasicDatePicker from "./DatePicker";
import Search from "./Search";

const Header = ({ filterDates, setFilterDates, name, stock }) => {
  return (
    <>
      <Card sx={{ overflow: "visible" }}>
        <Stack p={2} spacing={2}>
          <Typography variant="h5">
            <b>
              {stock} - {name}
            </b>
          </Typography>
          <Search />
          {/* <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel htmlFor="Stock"> Stock </InputLabel>
            <Select value={stock} label="Stock" onChange={handleChange}>
              {symbols.map((item, i) => (
                <MenuItem key={i} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
          <Stack flexDirection={"row"}>
            <BasicDatePicker
              label="Start Date"
              value={filterDates.startDate}
              onChange={(e) =>
                setFilterDates((prev) => ({ ...prev, startDate: e }))
              }
            />
            <BasicDatePicker
              label="End Date"
              value={filterDates.endDate}
              onChange={(e) =>
                setFilterDates((prev) => ({ ...prev, endDate: e }))
              }
            />
            <Button sx={{ m: 1 }} variant="contained">
              Show Price
            </Button>
          </Stack>
        </Stack>
      </Card>
    </>
  );
};

export default Header;
