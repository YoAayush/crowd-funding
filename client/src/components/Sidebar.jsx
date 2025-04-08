import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { logo, sun } from "../assets";
import { navlinks } from "../constants";
import { useStateContext } from "../context";

import { MdSunny } from "react-icons/md";
import { IoMdMoon } from "react-icons/io";

const Icon = ({
  styles,
  name,
  imgUrl: IconComponent,
  isActive,
  disabled,
  handleClick,
  theme,
}) => (
  <div
    className={`w-[48px] h-[48px] rounded-[10px] ${
      isActive && isActive === name && "bg-[#676e75]"
    } flex justify-center items-center ${
      !disabled && "cursor-pointer"
    } ${styles}`}
    onClick={handleClick}
  >
    {IconComponent && typeof IconComponent === "function" ? (
      <IconComponent
        className={`w-1/2 h-1/2 ${
          isActive !== name ? "text-gray-400" : "text-white"
        }`}
        size={24}
      />
    ) : (
      <img
        src={IconComponent}
        alt="fund_logo"
        className={`w-1/2 h-1/2 ${isActive !== name && "grayscale"}`}
      />
    )}
  </div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = window.location.pathname;
  const [isActive, setIsActive] = useState("dashboard");

  const { theme, setTheme } = useStateContext();

  useEffect(() => {
    // console.log("Current location:", location);
    const activeLink = navlinks.find((link) => link.link === location);
    // console.log("Active link:", activeLink);
    if (activeLink) {
      setIsActive(activeLink.name);
    }
  }, [location]);

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      <Link to="/">
        <div className="w-[80px] h-[80px] flex justify-center items-center">
          <img src={logo} alt="logo" className="w-full h-full object-contain" />
        </div>
      </Link>

      <div
        className={`flex-1 flex flex-col justify-between items-center ${
          theme === "dark" ? "bg-[#1c1c24]" : "bg-[#C8BCFF]"
        } rounded-[20px] w-[76px] py-4 mt-8`}
      >
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <Icon
              styles={theme === "dark" ? "bg-[#1c1c24]" : "bg-[#584EFA]"}
              key={link.name}
              {...link}
              theme={theme}
              isActive={isActive}
              handleClick={() => {
                if (!link.disabled) {
                  setIsActive(link.name);
                  navigate(link.link);
                }
              }}
            />
          ))}
        </div>

        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className={`p-2 rounded ${theme === "dark" ? "bg-[#676e75] text-white" : "bg-[#584EFA] text-gray-200"}`}
          // className={`w-[48px] h-[48px] rounded-[10px] bg-[#1818F2]
          // flex justify-center items-center cursor-pointer`}
        >
          {theme === "light" ? <IoMdMoon /> : <MdSunny />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
