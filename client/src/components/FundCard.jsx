import React, { useState } from "react";

import { tagType, thirdweb } from "../assets";
import { daysLeft } from "../utils";
import { useStateContext } from "../context";

const FundCard = ({
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

  // console.log("isDeleted:", isDeleted);
  const remainingDays = daysLeft(deadline);
  const isExpired = remainingDays <= 0;

  const targetAmount = target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const amountRaised = amountCollected
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const amountCollectedFormatted = `${amountRaised} of ${targetAmount}`;
  const amountCollectedWithCurrency = `₹ ${amountCollectedFormatted}`;
  const targetWithCurrency = `₹ ${targetAmount}`;

  // console.log("amountCollectedWithCurrency:", amountCollectedWithCurrency);
  // console.log("targetWithCurrency:", targetWithCurrency);

  // console.log("FundCard props:", {
  //   owner,
  //   title,
  //   description,
  //   target,
  //   remainingDays,
  //   amountCollected,
  //   image,
  // });

  return (
    <>
      <div
        className={`sm:w-[288px] w-full rounded-[15px] ${
          theme === "dark" ? "bg-[#1c1c24]" : "bg-gray-400"
        } cursor-pointer`}
      >
        <img
          src={image}
          alt="fund"
          className="w-full h-[158px] object-cover rounded-[15px]"
        />

        <div className="flex flex-col p-4">
          {/* <div
            className="flex flex-row items-center mb-[18px]"
            onClick={handleClick}
          >
            <img
              src={tagType}
              alt="tag"
              className="w-[17px] h-[17px] object-contain"
            />
            <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#808191]">
              Education
            </p>
          </div> */}

          <div className="block" onClick={handleClick}>
            <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">
              {title}
            </h3>
            <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">
              {description}
            </p>
          </div>

          <div className="flex justify-between flex-wrap mt-[15px] gap-2">
            <div className="flex flex-col">
              <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                {amountCollected}
              </h4>
              <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
                Raised of {target}
              </p>
            </div>
            <div className="flex flex-col">
              <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                {remainingDays > 0 ? `${remainingDays} Days Left` : "Expired"}
              </h4>
            </div>
          </div>

          <div className="flex items-center mt-[20px] gap-[12px]">
            <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
              <img
                src={thirdweb}
                alt="user"
                className="w-1/2 h-1/2 object-contain"
              />
            </div>
            <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">
              by <span className="text-[#b2b3bd]">{ownerName}</span>
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {/* Disable donate button if campaign expired */}
            <button
              className={`px-4 py-2 rounded-lg ${
                isExpired
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700"
              }`}
              disabled={isExpired}
              onClick={handleClick}
            >
              {isExpired ? "Funding Closed" : "Donate"}
            </button>

            {/* Show Delete button only for owner */}
            {owner === address && (
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-700 rounded-lg"
                onClick={() => handleCampaignDelete(pId)}
              >
                Delete Campaign
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FundCard;
