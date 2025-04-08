import React from "react";
import { useStateContext } from "../context";

const CountBox = ({ title, value }) => {
  const { theme } = useStateContext();

  const isLight = theme === "light";

  return (
    <div className="flex flex-col items-center w-[150px] overflow-hidden">
      <h4
        className={`font-epilogue font-bold text-[30px] ${
          isLight ? "text-black bg-gray-200" : "text-white bg-[#1c1c24]"
        } p-3 rounded-t-[10px] w-full text-center truncate`}
      >
        {value}
      </h4>
      <p
        className={`font-epilogue font-normal text-[16px] ${
          isLight ? "text-gray-800 bg-gray-100" : "text-[#808191] bg-[#28282e]"
        } px-3 py-2 w-full rounded-b-[10px] text-center`}
      >
        {title}
      </p>
    </div>
  );
};

export default CountBox;
