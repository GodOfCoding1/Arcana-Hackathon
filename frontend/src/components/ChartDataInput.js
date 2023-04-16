import React, { useContext, useEffect, useState } from "react";
import { Card, Checkbox, FormControlLabel, Stack } from "@mui/material";
import { Area, XAxis, YAxis, AreaChart, Tooltip } from "recharts";
import ThemeContext from "../context/ThemeContext";
import StockContext from "../context/StockContext";
const Chart = ({ data }) => {
  const { darkMode } = useContext(ThemeContext);



  return (
    <Stack spacing={1} sx={{ width: "100%" }}>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <AreaChart width={800} height={400} data={data}>
              <defs>
                <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={darkMode ? "#312e81" : "rgb(199 210 254)"}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={darkMode ? "#312e81" : "rgb(199 210 254)"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={darkMode ? { backgroundColor: "#111827" } : null}
                itemStyle={darkMode ? { color: "#818cf8" } : null}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#312e81"
                fill="url(#chartColor)"
                fillOpacity={0.5}
                strokeWidth={0.5}
              />
            

              <XAxis dataKey="date" />
              <YAxis domain={["dataMin", "dataMax"]} />
            </AreaChart>
          </div>
       
    </Stack>
  );
};

export default Chart;
