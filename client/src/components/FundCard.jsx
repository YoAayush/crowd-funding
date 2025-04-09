import React from "react";
import { tagType, thirdweb } from "../assets";
import { daysLeft } from "../utils";
import { useStateContext } from "../context";

const FundCard = ({
  ownerName,
  owner,
  title,
  description,
  target,
  deadline,
  amountCollected,
  image,
  handleClick,
  pId,
  handleCampaignDelete,
}) => {
  const { address, theme } = useStateContext();

  const remainingDays = daysLeft(deadline);
  const isExpired = remainingDays <= 0;

  const targetAmount = target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const amountRaised = amountCollected
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const amountCollectedFormatted = `${amountRaised} of ${targetAmount}`;
  const amountCollectedWithCurrency = `₹ ${amountCollectedFormatted}`;

  return (
    <div
      className={`sm:w-[288px] w-full rounded-[15px] cursor-pointer shadow-xl ${
        theme === "dark" ? "bg-[#1c1c24]" : "bg-[#f1f1f1]"
      }`}
    >
      <img
        src={image}
        alt="fund"
        className="w-full h-[158px] object-cover rounded-t-[15px]"
        onClick={handleClick}
      />

      <div className="flex flex-col p-4">
        <div className="block" onClick={handleClick}>
          <h3
            className={`font-epilogue font-semibold text-[16px] text-left leading-[26px] truncate ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            {title}
          </h3>
          <p
            className={`mt-[5px] font-epilogue font-normal text-left leading-[18px] truncate ${
              theme === "dark" ? "text-[#808191]" : "text-gray-600"
            }`}
          >
            {description}
          </p>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4
              className={`font-epilogue font-semibold text-[14px] leading-[22px] ${
                theme === "dark" ? "text-[#b2b3bd]" : "text-gray-800"
              }`}
            >
              ₹ {amountRaised}
            </h4>
            <p
              className={`mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] sm:max-w-[120px] truncate ${
                theme === "dark" ? "text-[#808191]" : "text-gray-500"
              }`}
            >
              Raised of ₹ {targetAmount}
            </p>
          </div>
          <div className="flex flex-col">
            <h4
              className={`font-epilogue font-semibold text-[14px] leading-[22px] ${
                theme === "dark" ? "text-[#b2b3bd]" : "text-gray-800"
              }`}
            >
              {remainingDays > 0 ? `${remainingDays} Days Left` : "Expired"}
            </h4>
          </div>
        </div>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div
            className={`w-[30px] h-[30px] rounded-full flex justify-center items-center ${
              theme === "dark" ? "bg-[#13131a]" : "bg-gray-300"
            }`}
          >
            <img
              src={thirdweb}
              alt="user"
              className="w-1/2 h-1/2 object-contain"
            />
          </div>
          <p
            className={`flex-1 font-epilogue font-normal text-[12px] truncate ${
              theme === "dark" ? "text-[#808191]" : "text-gray-600"
            }`}
          >
            by{" "}
            <span
              className={`${
                theme === "dark" ? "text-[#b2b3bd]" : "text-gray-800"
              }`}
            >
              {ownerName}
            </span>
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {/* Donate button */}
          <button
            className={`px-4 py-2 rounded-lg transition ${
              isExpired
                ? "bg-gray-400 text-white cursor-not-allowed"
                : theme === "dark"
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={isExpired}
            onClick={handleClick}
          >
            {isExpired ? "Funding Closed" : "Donate"}
          </button>

          {/* Delete button (only for owner) */}
          {owner === address && (
            <button
              className={`px-4 py-2 rounded-lg transition ${
                theme === "dark"
                  ? "bg-red-500 hover:bg-red-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
              onClick={() => handleCampaignDelete(pId)}
            >
              Delete Campaign
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FundCard;
