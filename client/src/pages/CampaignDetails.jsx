import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { useStateContext } from "../context";
import { CountBox, CustomButton, Loader } from "../components";
import { daysLeft } from "../utils";
import profileIcon from "../assets/profileIcon.png";

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, contract, address, theme } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);

  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);
    setDonators(data);
  };

  useEffect(() => {
    if (contract) fetchDonators();
  }, [contract, address]);

  const handleDonate = async () => {
    setIsLoading(true);
    await donate(state.pId, amount);
    navigate("/");
    setIsLoading(false);
  };

  const isTargetReached = ethers.utils
    .parseUnits(state.amountCollected.toString(), 18)
    .gte(ethers.utils.parseUnits(state.target.toString(), 18));

  const calculateBarPercentage = (goal, raisedAmount) => {
    return Math.round((raisedAmount * 100) / goal);
  };

  // Dynamic styles based on theme
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-[#1c1c24]" : "bg-gray-100";
  const secondaryBg = isDark ? "bg-[#13131a]" : "bg-gray-200";
  const textColor = isDark ? "text-white" : "text-gray-800";
  const mutedText = isDark ? "text-[#808191]" : "text-gray-700";
  const boxBg = isDark ? "bg-[#2c2f32]" : "bg-gray-300";
  const progressBg = isDark ? "bg-[#3a3a43]" : "bg-gray-300";
  const barColor = isDark ? "bg-[#4acd8d]" : "bg-green-400";

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img
            src={state.image}
            alt="campaign"
            className="w-full h-[410px] object-cover rounded-xl"
          />
          <div className={`relative w-full h-7 ${progressBg} mt-2 rounded-xl`}>
            <div
              className={`absolute h-full ${barColor} rounded-xl flex justify-center`}
              style={{
                width: `${calculateBarPercentage(
                  state.target,
                  state.amountCollected
                )}%`,
                maxWidth: "100%",
              }}
            >
              <p className={`font-bold text-xl ${textColor}`}>
                {calculateBarPercentage(state.target, state.amountCollected)}%
              </p>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={remainingDays} />
          <CountBox
            title={`Raised of ${state.target}`}
            value={state.amountCollected}
          />
          <CountBox title="Total Backers" value={donators.length} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          {/* Creator */}
          <div>
            <h4
              className={`font-epilogue font-semibold text-[18px] uppercase ${textColor}`}
            >
              Creator
            </h4>
            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div
                className={`w-[52px] h-[52px] flex items-center justify-center rounded-full ${boxBg}`}
              >
                <img
                  src={profileIcon}
                  alt="user"
                  className="w-[60%] h-[60%] object-contain"
                />
              </div>
              <div>
                <h4
                  className={`font-epilogue font-semibold text-[14px] break-all ${textColor}`}
                >
                  {state.ownerName}
                </h4>
              </div>
            </div>
          </div>

          {/* Story */}
          <div>
            <h4
              className={`font-epilogue font-semibold text-[18px] uppercase ${textColor}`}
            >
              Story
            </h4>
            <div className="mt-[20px]">
              <p
                className={`font-epilogue font-normal text-[16px] leading-[26px] text-justify ${mutedText}`}
              >
                {state.description}
              </p>
            </div>
          </div>

          {/* Donators */}
          <div>
            <h4
              className={`font-epilogue font-semibold text-[18px] uppercase ${textColor}`}
            >
              Donators
            </h4>
            <div className="mt-[20px] flex flex-col gap-4">
              {donators.length > 0 ? (
                donators.map((item, index) => (
                  <div
                    key={`${item.donator}-${index}`}
                    className="flex justify-between items-center gap-4"
                  >
                    <p
                      className={`font-epilogue font-normal text-[16px] leading-[26px] break-ll ${mutedText}`}
                    >
                      {index + 1}. {item.donator}
                    </p>
                    <p
                      className={`font-epilogue font-normal text-[16px] leading-[26px] break-ll ${mutedText}`}
                    >
                      {item.donation}
                    </p>
                  </div>
                ))
              ) : (
                <p
                  className={`font-epilogue font-normal text-[16px] leading-[26px] text-justify ${mutedText}`}
                >
                  No donators yet. Be the first one!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1">
          <h4
            className={`font-epilogue font-semibold text-[18px] uppercase ${textColor}`}
          >
            Fund
          </h4>

          <div
            className={`mt-[20px] flex flex-col p-4 rounded-[10px] ${bgColor}`}
          >
            {isTargetReached ? (
              <div className="w-full bg-green-600 text-white text-center py-3 rounded-[10px] font-semibold text-[18px] animate-pulse">
                🎯 Target Reached! Thank you for the support.
              </div>
            ) : (
              <div className="mt-[30px]">
                <p
                  className={`font-epilogue font-medium text-[20px] leading-[30px] text-center ${mutedText}`}
                >
                  Fund the campaign
                </p>
                <input
                  type="number"
                  placeholder="ETH 0.1"
                  step="0.01"
                  className={`w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] ${
                    isDark ? "bg-transparent text-white" : "bg-white text-black"
                  } font-epilogue text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <div className={`my-[20px] p-4 rounded-[10px] ${secondaryBg}`}>
                  <h4
                    className={`font-epilogue font-semibold text-[14px] leading-[22px] ${textColor}`}
                  >
                    Back it because you believe in it.
                  </h4>
                  <p
                    className={`mt-[20px] font-epilogue font-normal leading-[22px] ${mutedText}`}
                  >
                    Support the project for no reward, just because it speaks to
                    you.
                  </p>
                </div>

                <CustomButton
                  btnType="button"
                  title="Fund Campaign"
                  styles="w-full bg-[#8c6dfd]"
                  handleClick={handleDonate}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
