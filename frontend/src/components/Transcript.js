import {
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  allSymbolDates,
  summaryTrans,
  symbolJsons,
} from "../utils/api/stock-api";

export default function Transcripts({ symbol }) {
  const [dates, setDates] = useState([]);
  const [date, setDate] = useState("");
  const [jsons, setJsons] = useState([]);
  const [json, setJson] = useState("");
  const [summarizedData, setSummarizedData] = useState("");

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const res = await allSymbolDates(symbol);
        setDates(res.data.slice(0, 10));
      } catch (error) {
        console.log(error);
      }
    };
    fetchSymbols();
  }, [symbol]);

  useEffect(() => {
    const fetchSymbols = async () => {
      if (date === "") return;
      try {
        const res = await symbolJsons(symbol, date);
        setJsons(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSymbols();
  }, [date, symbol]);

  useEffect(() => {
    const fetchSymbols = async () => {
      if (json === "") return;
      try {
        const res = await summaryTrans(symbol, date, json);
        setSummarizedData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSymbols();
  }, [date, symbol, json]);

  return (
    <Card sx={{ p: 2, overflow: "scroll" }}>
      <Stack spacing={2}>
        <Typography variant="h6">
          <strong>Transcript Summarization</strong>
        </Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel htmlFor="Year">Year</InputLabel>
          <Select
            value={date}
            label="Year"
            onChange={(e) => setDate(e.target.value)}
          >
            <MenuItem value={""}>Select a Year</MenuItem>
            {dates.map((item, i) => (
              <MenuItem key={i} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {date ? (
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel htmlFor="Quater">Quater</InputLabel>
            <Select
              value={json}
              label="Quater"
              onChange={(e) => setJson(e.target.value)}
            >
              <MenuItem value={""}>Select a Quater</MenuItem>
              {jsons.map((item, i) => (
                <MenuItem key={i} value={item}>
                  {item.slice(0, -5)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          ""
        )}
        {summarizedData ? (
          <Typography>
            <strong> Summary of Transcript</strong> :
            {JSON.parse(summarizedData)["content"]}
          </Typography>
        ) : (
          ""
        )}
      </Stack>
    </Card>
  );
}
