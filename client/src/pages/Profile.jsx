import React from "react";
import { DisplayCampaigns } from "../components";
import { useStateContext } from "../context";

const Profile = () => {
  const { address, contract, getUserCampaigns, theme } = useStateContext();

  const [isLoading, setIsLoading] = React.useState(false);
  const [campaigns, setCampaigns] = React.useState([]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  // sample user profile data
  const userProfile = {
    name: "Aman Raj",
    bio: "Web3 enthusiast. Building decentralized futures.",
    location: "Mumbai, India",
    twitter: "@amanrajdev",
    address: address,
    joined: "January 2025",
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`,
  };

  return (
    <div className="mt-10">
      <div className="bg-[#1f1f1f] max-w-4xl mx-auto rounded-2xl p-6 shadow-lg flex items-center gap-6 mb-10">
        <img
          src={userProfile.avatar}
          alt="avatar"
          className="w-24 h-24 rounded-full border-2 border-green-500"
        />
        <div>
          <h2 className="text-2xl font-semibold text-white">
            {userProfile.name}
          </h2>
          <p className="text-gray-400 mt-1">{userProfile.bio}</p>
          <div className="mt-3 space-y-1 text-sm text-gray-300">
            <p>📍 {userProfile.location}</p>
            <p>
              🐦{" "}
              <a
                href={`https://twitter.com/${userProfile.twitter.replace(
                  "@",
                  ""
                )}`}
                target="_blank"
                className="text-blue-400 hover:underline"
              >
                {userProfile.twitter}
              </a>
            </p>
            <p>
              👛 Wallet:{" "}
              {userProfile.address ? (
                <span className="text-green-400">
                  {userProfile.address.slice(0, 6)}...
                  {userProfile.address.slice(-4)}
                </span>
              ) : (
                <span className="text-gray-500">Not connected</span>
              )}
            </p>

            <p>🕐 Joined: {userProfile.joined}</p>
          </div>
        </div>
      </div>

      <hr
        className={`my-6 h-[1px] border-0 ${
          theme === "dark" ? "bg-white" : "bg-gray-800"
        }`}
      />

      <DisplayCampaigns
        title="Your Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
      />
    </div>
  );
};

export default Profile;
