import React, { useContext, useEffect, useState } from "react";
import Overview from "./Overview";
import Details from "./Details";
import Chart from "./Chart";
import Header from "./Header";
import StockContext from "../context/StockContext";
import {
  fetchStockDetails,
  fetchQuote,
  checkModel,
} from "../utils/api/stock-api";
import Transcripts from "./Transcript";
import { Card, Stack } from "@mui/material";
import PricePredictor from "./PredictPrice";
import dayjs from "dayjs";

const Dashboard = () => {
  const { stockSymbol } = useContext(StockContext);

  const [stockDetails, setStockDetails] = useState({});

  const [quote, setQuote] = useState({});
  const [filterDates, setFilterDates] = useState({
    startDate: dayjs("1/04/2022"),
    endDate: dayjs("1/04/2023"),
  });

  useEffect(() => {
    const updateStockDetails = async () => {
      try {
        const result = await fetchStockDetails(stockSymbol);
        setStockDetails(result);
      } catch (error) {
        setStockDetails({});
        console.log(error);
      }
    };

    const ck = async () => {
      try {
        const result = await checkModel(stockSymbol);

        if (result.data === "false")
          alert(
            "The model you have selected is being created, please wait 1 min for the graph to update"
          );
      } catch (error) {
        console.log(error);
      }
    };

    const updateStockOverview = async () => {
      try {
        const result = await fetchQuote(stockSymbol);
        setQuote(result);
      } catch (error) {
        setQuote({});
        console.log(error);
      }
    };

    updateStockDetails();
    updateStockOverview();
    ck();
  }, [stockSymbol]);

  return (
    <>
      <Stack spacing={2} sx={{ p: 2, backgroundColor: "#edf1f7" }}>
        <Stack flexDirection={"row"}>
          <Header
            filterDates={filterDates}
            setFilterDates={setFilterDates}
            stock={stockSymbol}
            name={stockDetails.name}
          />
         <Card sx={{ ml: 2, width: "50%" }}>
            <Details details={stockDetails} />
          </Card>
        </Stack> 
        <Stack flexDirection={"row"} height={100}>
          <Overview
            symbol={stockSymbol}
            price={quote.pc}
            change={quote.d}
            changePercent={quote.dp}
            currency={stockDetails.currency}
          />

         
        </Stack>
        <Card sx={{ pt: 1 }}>
          <Chart filterDates={filterDates} />
        </Card>
        <PricePredictor stock={stockSymbol} />
       
        <Card>
          <Transcripts symbol={stockSymbol} />
        </Card>
      </Stack>
    </>
  );
};

export default Dashboard;
