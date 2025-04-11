import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { useStateContext } from "../context";
import { CountBox, CustomButton, Loader } from "../components";
import { daysLeft } from "../utils";
import profileIcon from "../assets/profileIcon.png";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import axios from "axios";

const CampaignDetails = () => {
  const { state } = useLocation();
  // console.log("State:", state);
  const navigate = useNavigate();
  const { donate, getDonations, contract, address, theme, supabase, orgEmail } =
    useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);

  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [campaignOwnerEmail, setCampaignOwnerEmail] = useState("");
  const [isEnquirySent, setIsEnquirySent] = useState(false);

  const fetchProfile = async () => {
    if (!address) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("wallet", state.owner)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
      } else {
        setCampaignOwnerEmail(data.email);
        // console.log("Profile data:", data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    }
  };

  useEffect(() => {
    fetchProfile(); // Call the async function without await in useEffect
  }, [address, state.owner]); // Dependencies for useEffect

  const handleSendEnquiry = async () => {
    if (!enquiryMessage) {
      alert("Please fill in both email and message fields.");
      return;
    }

    setIsEnquirySent(true);
    try {
      const response = await axios.post("http://localhost:3000/enquiry-email", {
        senderEmail: orgEmail,
        campaignOwnerEmail: campaignOwnerEmail,
        message: enquiryMessage,
      });

      if (response.status === 200) {
        alert("Enquiry sent successfully!");
        setEnquiryMessage("");
      } else {
        alert("Failed to send enquiry. Please try again.");
      }
    } catch (error) {
      console.error("Error sending enquiry:", error.message);
      alert("Failed to send enquiry. Please try again.");
    } finally {
      setIsEnquirySent(false);
    }
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

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

  const [latitude, longitude] = (state.location || "19.0760, 72.8777")
    .split(",")
    .map(Number);
  // console.log("Latitude:", latitude, "Longitude:", longitude);
  // const videoLink = "https://www.youtube.com/embed/dQw4w9WgXcQ";
  // const tags = ["Education", "Health", "Community"];

  // Function to open Google Maps app
  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, "_blank"); // Opens in a new tab/window; mobile devices may redirect to the app
  };

  // const embedVideoLink = state.videoLink
  //   ? state.videoLink.replace("www.youtube.com/", "www.youtube.com/embed/")
  //   : null;

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
          <div className="flex flex-row items-center gap-4">
            {/* <h4
              className={`font-epilogue font-semibold text-[18px] uppercase ${textColor}`}
            >
              Title :-
            </h4> */}
            <p
              className={`font-epilogue font-semibold text-[22px] break-all ${textColor}`}
            >
              {state.title}
            </p>
          </div>

          {/* Creator */}
          <div>
            <h4
              className={`font-epilogue font-semibold text-[16px] uppercase ${textColor}`}
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

          {/* Location */}
          <div>
            <h4
              className={`font-epilogue font-semibold text-[16px] uppercase ${textColor}`}
            >
              Location
            </h4>
            {/* <p className={`mt-2 ${mutedText}`}>
              {state.location || "Not specified"}
            </p> */}

            {isLoaded && !isNaN(latitude) && !isNaN(longitude) ? (
              <div className="mt-4 mb-16 h-[250px] w-full rounded-lg">
                <GoogleMap
                  center={{ lat: latitude, lng: longitude }}
                  zoom={12}
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  // onClick={openGoogleMaps}
                >
                  <Marker position={{ lat: latitude, lng: longitude }} />
                </GoogleMap>
                {/* Button to open in Google Maps */}
                <CustomButton
                  btnType="button"
                  title="Open in Google Maps"
                  styles="w-full mt-2 bg-[#8c6dfd]"
                  handleClick={openGoogleMaps}
                />
              </div>
            ) : (
              <p className={`mt-2 italic ${mutedText}`}>Loading map...</p>
            )}
          </div>

          {/* Story */}
          <div>
            <h4
              className={`font-epilogue font-semibold text-[16px] uppercase ${textColor}`}
            >
              Story
            </h4>
            <p
              className={`mt-[20px] font-epilogue font-normal text-[16px] leading-[26px] text-justify ${mutedText}`}
            >
              {state.description}
            </p>
          </div>

          {/* Tags */}
          <div>
            <h4
              className={`font-epilogue font-semibold text-[16px] uppercase ${textColor}`}
            >
              Tags
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {/* {(state.tags || []).map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-full text-sm ${
                    isDark
                      ? "bg-[#2c2f32] text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  #{tag}
                </span>
              ))} */}
              {(state.tags || []).map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-full text-sm ${
                    isDark
                      ? "bg-[#2c2f32] text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Video */}
          {state.videoLink && (
            <div>
              <h4
                className={`font-epilogue font-semibold text-[16px] uppercase ${textColor}`}
              >
                Video
              </h4>
              <div className="mt-3 w-full aspect-video">
                <iframe
                  src={state.videoLink}
                  title="Campaign Video"
                  className="w-full h-full rounded-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Donators */}
          <div>
            <h4
              className={`font-epilogue font-semibold text-[16px] uppercase ${textColor}`}
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
                      className={`font-epilogue font-normal text-[16px] leading-[26px] break-all ${mutedText}`}
                    >
                      {index + 1}. {item.donator}
                    </p>
                    <p
                      className={`font-epilogue font-normal text-[16px] leading-[26px] ${mutedText}`}
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

          <div
            className={`mt-[30px] flex flex-col p-4 rounded-[10px] ${bgColor}`}
          >
            <h4
              className={`font-epilogue font-semibold text-[18px] leading-[30px] ${textColor}`}
            >
              Enquiry
            </h4>
            <p
              className={`mt-[10px] font-epilogue font-medium text-[16px] leading-[24px] ${mutedText}`}
            >
              Send an enquiry to the campaign creator.
            </p>

            <p
              className={`mt-[20px] font-epilogue font-medium text-[16px] leading-[24px] ${mutedText}`}
            >
              From :-
            </p>
            <input
              type="email"
              placeholder="Your Email"
              className={`w-full py-[10px] sm:px-[20px] px-[15px] mt-[10px] outline-none border-[1px] border-[#3a3a43] ${
                isDark ? "bg-transparent text-white" : "bg-white text-black"
              } font-epilogue text-[16px] leading-[24px] placeholder:text-[#4b5264] rounded-[10px]`}
              value={orgEmail}
              disabled
              // onChange={(e) => setEnquiryEmail(e.target.value)}
            />

            <p
              className={`mt-[20px] font-epilogue font-medium text-[16px] leading-[24px] ${mutedText}`}
            >
              To :-
            </p>
            <input
              type="email"
              placeholder="Creator Email"
              className={`w-full py-[10px] sm:px-[20px] px-[15px] mt-[10px] outline-none border-[1px] border-[#3a3a43] ${
                isDark ? "bg-transparent text-white" : "bg-white text-black"
              } font-epilogue text-[16px] leading-[24px] placeholder:text-[#4b5264] rounded-[10px]`}
              value={campaignOwnerEmail}
              disabled
              // onChange={(e) => setEnquiryEmail(e.target.value)}
            />
            <p
              className={`mt-[20px] font-epilogue font-medium text-[16px] leading-[24px] ${mutedText}`}
            >
              Enquiry Message :-
            </p>
            <textarea
              placeholder="Your Message"
              className={`w-full py-[10px] sm:px-[20px] px-[15px] mt-[10px] outline-none border-[1px] border-[#3a3a43] ${
                isDark ? "bg-transparent text-white" : "bg-white text-black"
              } font-epilogue text-[16px] leading-[24px] placeholder:text-[#4b5264] rounded-[10px] h-[100px] resize-none`}
              value={enquiryMessage}
              onChange={(e) => setEnquiryMessage(e.target.value)}
            />
            {/* <CustomButton
              btnType="button"
              title="Send Enquiry"
              styles="w-full bg-[#6adf8d] mt-[20px]"
              handleClick={handleSendEnquiry}
            /> */}
            <button
              className={`mt-6 w-full flex justify-center items-center gap-2 ${
                isEnquirySent
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              } text-white font-semibold py-3 rounded-lg transition duration-200`}
              disabled={isEnquirySent}
              onClick={handleSendEnquiry}
            >
              {isEnquirySent ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Sending Email...
                </>
              ) : (
                "Send Enquiry"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
