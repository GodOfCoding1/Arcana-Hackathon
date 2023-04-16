import React, { useContext, useEffect, useState } from "react";
import ThemeContext from "../context/ThemeContext";
import { allSymbols } from "../utils/api/stock-api";
import SearchResults from "./SearchResults";
import { SearchIcon, XIcon } from "@heroicons/react/solid";

const Search = () => {
  const { darkMode } = useContext(ThemeContext);
  const [input, setInput] = useState("");
  const [bestMatches, setBestMatches] = useState([]);
  const [allStocks, setAllstocks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await allSymbols();
        setAllstocks(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const updateBestMatches = () => {
    try {
      if (input) {
        setBestMatches(allStocks.filter((item) => item.includes(input)));
      }
    } catch (error) {
      setBestMatches([]);
      console.log(error);
    }
  };
  useEffect(() => {
    updateBestMatches();
  }, [input]);

  const clear = () => {
    setInput("");
    setBestMatches([]);
  };

  return (
    <div
      className={`flex items-center my-4 border-2 rounded-md relative z-50 w-96 ${
        darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-neutral-200"
      }`}
    >
      <input
        type="text"
        value={input}
        className={`w-full px-4 py-2 focus:outline-none rounded-md ${
          darkMode ? "bg-gray-900" : null
        }`}
        placeholder="Search stock and Select by symbol..."
        onChange={(event) => {
          setInput(event.target.value.toUpperCase());
        }}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            updateBestMatches();
          }
        }}
      />
      {input && (
        <button onClick={clear} className="m-1">
          <XIcon className="h-4 w-4 fill-gray-500" />
        </button>
      )}
      <button
        onClick={updateBestMatches}
        className="h-8 w-8 bg-indigo-600 rounded-md flex justify-center items-center m-1 p-2 transition duration-300 hover:ring-2 ring-indigo-400"
      >
        <SearchIcon className="h-4 w-4 fill-gray-100" />
      </button>
      {input && bestMatches.length > 0 ? (
        <SearchResults clear={clear} results={bestMatches} />
      ) : null}
    </div>
  );
};

export default Search;
