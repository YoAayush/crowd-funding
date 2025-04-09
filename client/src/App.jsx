import React from "react";
import { Route, Routes } from "react-router-dom";

import { Sidebar, Navbar } from "./components";
import { CampaignDetails, CreateCampaign, Home, Profile } from "./pages";
import { useStateContext } from "./context";
import Modal from "./components/Modal";

const App = () => {
  const { theme, isModalOpen } = useStateContext();
  return (
    <>
      {/* {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" />
      )} */}
      {isModalOpen && <Modal />}

      <div
        className={`relative sm:-8 p-4 ${
          theme === "dark" ? `bg-[#13131a]` : `bg-[#e8e6ff]`
        } min-h-screen flex flex-row`}
      >
        <div className="sm:flex hidden mr-10 relative">
          <Sidebar />
        </div>

        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-campaign" element={<CreateCampaign />} />
            <Route path="/campaign-details/:id" element={<CampaignDetails />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
