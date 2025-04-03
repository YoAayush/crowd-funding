import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import FundCard from "./FundCard";
import { loader } from "../assets";
import { useStateContext } from "../context";
import DeleteLoader from "./DeleteLoader";

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const { handleDelete, searchQuery, theme } = useStateContext();
  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  const checkTotalCampaigns = () => {
    let counter = 0;
    campaigns.map((campaign) => {
      // console.log("Campaign:", campaign);
      if (campaign.isDeleted === true) {
        counter++;
      }
    });

    // console.log("Counter:", counter);
    // console.log("Campaigns length:", campaigns.length);

    return campaigns.length - counter;
  };

  const activeCampaigns = campaigns.filter((campaign) => !campaign.isDeleted);

  const filteredCampaigns =
    searchQuery.trim() === ""
      ? activeCampaigns
      : activeCampaigns.filter((campaign) =>
          campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // console.log("Filtered campaigns:", filteredCampaigns);

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      setIsDeleting(true); // Show loader before deleting
      try {
        await handleDelete(id);
        alert("Campaign deleted successfully!");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting campaign:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      {isDeleting && <DeleteLoader />}
      <div>
        <h1 className={`font-epilogue font-semibold text-[18px] ${theme === "dark" ? "text-white" : "text-[#13131a]"} text-left`}>
          {title} (
          {filteredCampaigns.length > 0
            ? filteredCampaigns.length
            : checkTotalCampaigns()}
          )
        </h1>

        <div className="flex flex-wrap mt-[20px] gap-[26px]">
          {isLoading && (
            <img
              src={loader}
              alt="loader"
              className="w-[100px] h-[100px] object-contain"
            />
          )}

          {!isLoading && filteredCampaigns.length === 0 && (
            <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
              You have not created any campigns yet
            </p>
          )}

          {!isLoading &&
            // campaigns.length > 0 &&
            filteredCampaigns.length > 0 &&
            filteredCampaigns
              .filter((campaign) => !campaign.isDeleted)
              .map((campaign) => (
                <FundCard
                  key={uuidv4()}
                  {...campaign}
                  handleCampaignDelete= {handleDeleteClick}
                  handleDelete={() => handleDelete(campaign.pId)}
                  handleClick={() => handleNavigate(campaign)}
                />
              ))}
        </div>
      </div>
    </>
  );
};

export default DisplayCampaigns;
