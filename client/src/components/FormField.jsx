import React from "react";

import { useStateContext } from "../context";

const FormField = ({
  labelName,
  placeholder,
  inputType,
  isTextArea,
  value,
  handleChange,
  sendOtp,
}) => {
  const { theme, OTP_Modal, } = useStateContext();

  return (
    <label className="flex-1 w-full flex flex-col">
      {labelName && (
        <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
          {labelName === "Story *"
            ? `${labelName} (Should be of atleast 500 characters)`
            : labelName}
        </span>
      )}
      {isTextArea ? (
        <textarea
          required
          value={value}
          onChange={handleChange}
          rows={10}
          placeholder={placeholder}
          className={`py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-gray-200 text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]`}
        />
      ) : labelName === "Organisation Email *" ? (
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <input
            required
            value={value}
            onChange={handleChange}
            type={inputType}
            placeholder={placeholder}
            className={`w-full py-[15px] px-[15px] outline-none border border-[#3a3a43] bg-transparent font-epilogue ${
              theme === "dark" ? "text-white" : "text-gray-900"
            } text-[14px] placeholder:text-[#4b5264] rounded-[10px]`}
          />
          <button
            type="button"
            onClick={sendOtp}
            disabled={OTP_Modal}
            className="w-full sm:w-auto py-[5px] px-8 bg-blue-500 text-white rounded-[10px] hover:bg-blue-600 transition-all duration-200"
          >
            {OTP_Modal ? "OTP Sent" : "Send OTP"}
          </button>
        </div>
      ) : (
        <input
          required
          value={value}
          onChange={handleChange}
          type={inputType}
          step="0.1"
          placeholder={placeholder}
          className={`py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue ${
            theme === "dark" ? " text-white" : " text-gray-900"
          } text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]`}
        />
      )}
    </label>
  );
};

export default FormField;
