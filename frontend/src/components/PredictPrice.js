import React, { useEffect, useState } from "react";
import { predictData } from "../utils/api/stock-api";
import {
  Box,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { formatDate } from "../utils/helpers/date-helper";

const PricePredictor = ({ stock }) => {
  const [data, setData] = useState([]);
  const [days, setDays] = useState(0);

  const handleChange = (event) => {
    setDays(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (days === 0) return;
      if (!stock) alert("please select a stock first");
      try {
        const res = await predictData(stock, undefined, days);
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [days, stock]);

  return (
    <>
      <Card sx={{ ml: 2, width: "50%" }}>
        <Stack p={2} spacing={2}>
          <Typography variant="h6">
            <b>Predict Price</b>
          </Typography>
          <Stack flexDirection={"row"} justifyContent={"space-around"}>
            <FormControl sx={{ minWidth: 120, width: "50%" }}>
              <InputLabel htmlFor="days"> Select number of days </InputLabel>
              <Select
                value={days}
                label="Select number of days"
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5].map((item, i) => (
                  <MenuItem key={i} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          {data.slice(1).map((value, i) => (
            <Stack flexDirection={"row"}>
              <Box component={"div"}>
                At <b>{formatDate(value[1])}</b>, Price is{" "}
                <b>{value[0].toString().slice(0, 7)}</b>
              </Box>
              <Box
                component={"div"}
                sx={{ color: data[0][0] > value[0] ? "red" : "green", ml: 2 }}
              >
                {data[0][0] > value[0]
                  ? "Drops by " +
                    (
                      (Math.abs(value[0] - data[0][0]) / data[0][0]) *
                      100
                    ).toFixed(3) +
                    " %"
                  : "Rises by " +
                    (
                      (Math.abs(value[0] - data[0][0]) / data[0][0]) *
                      100
                    ).toFixed(3) +
                    " %"}
              </Box>
            </Stack>
          ))}
        </Stack>
      </Card>
    </>
  );
};

export default PricePredictor;
