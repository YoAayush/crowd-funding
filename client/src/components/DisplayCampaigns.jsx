import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import FundCard from "./FundCard";
import { loader } from "../assets";
import { useStateContext } from "../context";
import DeleteLoader from "./DeleteLoader";

const categories = [
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

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const { handleDelete, searchQuery, theme } = useStateContext();
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const categoryFilteredCampaigns =
    selectedCategory === "All"
      ? filteredCampaigns
      : filteredCampaigns.filter(
          // (campaign) => campaign.category === selectedCategory
          (campaign) => campaign.tags.includes(selectedCategory)
        );

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
        <h1
          className={`font-epilogue font-semibold text-[18px] ${
            theme === "dark" ? "text-white" : "text-[#13131a]"
          } text-left`}
        >
          {title} (
          {categoryFilteredCampaigns.length > 0
            ? categoryFilteredCampaigns.length
            : checkTotalCampaigns()}
          )
        </h1>

        {/* Category Filter Dropdown */}
        <div className="mt-4 mb-4">
          <label
            htmlFor="categoryFilter"
            className={`font-epilogue font-medium text-[14px] ${
              theme === "dark" ? "text-white" : "text-[#13131a]"
            } mr-2`}
          >
            Filter by Category:
          </label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`p-2 rounded-md ${
              theme === "dark"
                ? "bg-[#2c2f32] text-white"
                : "bg-gray-200 text-[#13131a]"
            }`}
          >
            <option value="All">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap mt-[20px] gap-[26px]">
          {isLoading && (
            <img
              src={loader}
              alt="loader"
              className="w-[100px] h-[100px] object-contain"
            />
          )}

          {!isLoading && categoryFilteredCampaigns.length === 0 && (
            <p
              className={`font-epilogue font-semibold text-[14px] leading-[30px] ${
                theme === "dark" ? "text-[#818183]" : "text-white"
              }`}
            >
              You have not created any campaigns yet
            </p>
          )}

          {!isLoading &&
            categoryFilteredCampaigns.length > 0 &&
            categoryFilteredCampaigns.map((campaign) => (
              <FundCard
                key={uuidv4()}
                {...campaign}
                handleCampaignDelete={handleDeleteClick}
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
