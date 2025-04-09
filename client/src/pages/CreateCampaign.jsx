import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { useStateContext } from "../context";
// import { money } from '../assets';
import { CustomButton, FormField } from "../components";
import Loader from "../components/Loader";
import { checkIfImage } from "../utils";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import axios from "axios";
import OTP_Modal_Component from "../components/OTP_Modal";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 28.6139, // Default: New Delhi
  lng: 77.209,
};

const libraries = ["places"];

const predefinedTags = [
  "Education",
  "Health",
  "Environment",
  "Women Empowerment",
  "Child Welfare",
  "Animal Welfare",
  "Poverty Alleviation",
  "Mental Health",
  "Disaster Relief",
  "Community Support",
  "Innovation",
  "Technology",
  "Arts & Culture",
];

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign, theme, fetchProfile, otpVerified, OTP_Modal, open_OTP_Modal } =
    useStateContext();
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [form, setForm] = useState({
    // ownerName: '',
    title: "",
    orgName: "",
    orgEmail: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
    location: "",
    videoLink: "",
    tags: [],
  });

  // const [otpSent, setOtpSent] = useState(false);
  const [hashedOtp, setHashedOtp] = useState("");

  const sendOtp = async () => {
    if (!form.orgEmail) {
      alert("Please enter your organisation email first.");
      return;
    }

    open_OTP_Modal();

    console.log("Sending OTP to:", form.orgEmail);
    try {
      const result = await axios.post("http://localhost:3000/send-otp", {
        orgEmail: form.orgEmail,
      });
      alert(`OTP sent to ${form.orgEmail}`);

      setHashedOtp(result.data.hashedOTP);
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const toggleTag = (tag) => {
    setCampaign((prev) => {
      const hasTag = prev.tags.includes(tag);
      return {
        ...prev,
        tags: hasTag ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      alert("Please verify the OTP before submitting.");
      return;
    }

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        const data = await fetchProfile();
        const FinalData = {
          ...form,
          ownerName: data.name,
          target: ethers.utils.parseUnits(form.target, 18),
        };
        console.log("FinalData:", FinalData);
        await createCampaign(FinalData);
        setIsLoading(false);
        navigate("/");
      } else {
        alert("Provide valid image URL");
        setForm({ ...form, image: "" });
      }
    });
  };

  // useEffect(() => {
  //   if (form.target) {
  //     const targetInEther = form.target.toString(); // Ensure it's a string
  //     const targetInWei = ethers.utils.parseUnits(targetInEther, 18); // Convert to Wei
  //     console.log(
  //       "target value in ethers : ",
  //       targetInEther,
  //       "target value in wei : ",
  //       targetInWei.toString()
  //     );
  //   }
  // }, [form.target]);

  return (
    <>
      {OTP_Modal && !otpVerified && <OTP_Modal_Component hashedOTP={hashedOtp} />}

      <div
        className={`${
          theme === "dark" ? "bg-[#1c1c24]" : "bg-[#C8BCFF]"
        } flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4`}
      >
        {isLoading && <Loader />}
        <div
          className={`flex justify-center items-center p-[16px] sm:min-w-[380px] text-white ${
            theme === "dark" ? "bg-gray-700" : "bg-[#584EFA]"
          } rounded-[10px]`}
        >
          <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] ">
            Start a Campaign
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full mt-[65px] flex flex-col gap-[30px]"
        >
          <div className="flex flex-wrap gap-[40px]">
            {/* <FormField 
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('ownerName', e)}
          /> */}
            <FormField
              labelName="Campaign Title *"
              placeholder="Write a title"
              inputType="text"
              value={form.title}
              handleChange={(e) => handleFormFieldChange("title", e)}
            />
          </div>

          <FormField
            labelName="Organisation Name *"
            placeholder="Write your organisation name"
            inputType="text"
            value={form.orgName}
            handleChange={(e) => handleFormFieldChange("orgName", e)}
          />

          <div className="w-full flex flex-col gap-2 ">
            <div className="flex gap-2 items-center">
              <FormField
                labelName="Organisation Email *"
                placeholder="Write your organisation email"
                inputType="email"
                value={form.orgEmail}
                handleChange={(e) => handleFormFieldChange("orgEmail", e)}
                sendOtp={sendOtp}
              />
            </div>

            {otpVerified && (
              <p className="text-green-600 font-semibold">✅ OTP Verified</p>
            )}
          </div>

          <FormField
            labelName="Story *"
            placeholder="Write your story"
            isTextArea
            value={form.description}
            handleChange={(e) => handleFormFieldChange("description", e)}
          />

          <div className="mb-4">
            <p className="mb-2 font-medium text-[#808191]">
              Select Categories:
            </p>
            <div className="flex flex-wrap gap-2">
              {predefinedTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full border text-sm transition ${
                    form.tags.includes(tag)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <label className="font-epilogue font-semibold text-[14px] text-[#808191]">
            Select Campaign Location *
          </label>

          {useLoadScript({
            googleMapsApiKey: "AIzaSyBEmTMsBcalkfogGu3Jud1r4m6xFrTOOAI",
            libraries,
          }).isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={5}
              center={center}
              onClick={(e) => {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                setLocation({ lat, lng });
                setForm({ ...form, location: `${lat},${lng}` });
              }}
            >
              {location.lat && (
                <Marker position={{ lat: location.lat, lng: location.lng }} />
              )}
            </GoogleMap>
          ) : (
            <p>Loading Map...</p>
          )}

          {/* <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <img src={money} alt="money" className="w-[40px] h-[40px] object-contain"/>
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">You will get 100% of the raised amount</h4>
        </div> */}

          <FormField
            labelName="Campaign Video Link (Optional)"
            placeholder="Place video URL of your campaign"
            inputType="url"
            value={form.videoLink}
            handleChange={(e) => handleFormFieldChange("videoLink", e)}
          />

          <div className="flex flex-wrap gap-[40px]">
            <FormField
              labelName="Goal *"
              placeholder="ETH 0.50"
              inputType="text"
              value={form.target}
              handleChange={(e) => handleFormFieldChange("target", e)}
            />
            <FormField
              labelName="End Date *"
              placeholder="End Date"
              inputType="date"
              value={form.deadline}
              handleChange={(e) => handleFormFieldChange("deadline", e)}
            />
          </div>

          <FormField
            labelName="Campaign image *"
            placeholder="Place image URL of your campaign"
            inputType="url"
            value={form.image}
            handleChange={(e) => handleFormFieldChange("image", e)}
          />

          <div className="flex justify-center items-center mt-[40px]">
            <CustomButton
              btnType="submit"
              title="Submit new campaign"
              styles="bg-[#1dc071]"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateCampaign;
