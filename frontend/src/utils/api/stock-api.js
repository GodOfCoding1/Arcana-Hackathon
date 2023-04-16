import axios from "axios";
const basePath = "https://finnhub.io/api/v1";
const transcriptPath = "http://127.0.0.1:8000/api/transcripts/csv/";
const pricePath = "http://127.0.0.1:8000/api/price/csv/";
const predictPath = "http://127.0.0.1:8000/api/price/predict/";
const checkPath = "http://127.0.0.1:8000/api/price/checkModel/";

/**
 * Searches best stock matches based on a user's query
 * @param {string} query - The user's query, e.g. 'fb'
 * @returns {Promise<Object[]>} Response array of best stock matches
 */
export const checkModel = async (symbol) => {
  return await axios.get(checkPath, {
    params: {
      symbol,
    },
  });
};

export const predictData = async (symbol, date, days) => {
  return await axios.get(predictPath, {
    params: {
      symbol,
      date,
      days,
    },
  });
};

export const fetchOldData = async (symbol, from, to) => {
  return await axios.get(pricePath, {
    params: {
      symbol,
      from,
      to,
    },
  });
};

export const allSymbols = async () => {
  return await axios.get(transcriptPath);
};

export const allSymbolDates = async (symbol) => {
  return await axios.get(transcriptPath, {
    params: {
      symbol,
    },
  });
};

export const symbolJsons = async (symbol, date) => {
  return await axios.get(transcriptPath, {
    params: {
      symbol,
      date,
    },
  });
};

export const summaryTrans = async (symbol, date, json) => {
  return await axios.get(transcriptPath, {
    params: {
      symbol,
      date,
      json,
    },
  });
};

export const searchSymbol = async (query) => {
  const allStocks = await axios.get(transcriptPath);
  return allStocks.data.filter((item) => item.includes(query));
};

/**
 * Fetches the details of a given company
 * @param {string} stockSymbol - Symbol of the company, e.g. 'FB'
 * @returns {Promise<Object>} Response object
 */
export const fetchStockDetails = async (stockSymbol) => {
  const url = `${basePath}/stock/profile2?symbol=${stockSymbol}&token=${process.env.REACT_APP_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
};

/**
 * Fetches the latest quote of a given stock
 * @param {string} stockSymbol - Symbol of the company, e.g. 'FB'
 * @returns {Promise<Object>} Response object
 */
export const fetchQuote = async (stockSymbol) => {
  const url = `${basePath}/quote?symbol=${stockSymbol}&token=${process.env.REACT_APP_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
};

/**
 * Fetches historical data of a stock (to be displayed on a chart)
 * @param {string} stockSymbol - Symbol of the company, e.g. 'FB'
 * @param {string} resolution - Resolution of timestamps. Supported resolution includes: 1, 5, 15, 30, 60, D, W, M
 * @param {number} from - UNIX timestamp (seconds elapsed since January 1st, 1970 at UTC). Interval initial value.
 * @param {number} to - UNIX timestamp (seconds elapsed since January 1st, 1970 at UTC). Interval end value.
 * @returns {Promise<Object>} Response object
 */
export const fetchHistoricalData = async (
  stockSymbol,
  resolution,
  from,
  to
) => {
  const url = `${basePath}/stock/candle?symbol=${stockSymbol}&resolution=${resolution}&from=${from}&to=${to}&token=${process.env.REACT_APP_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
};
