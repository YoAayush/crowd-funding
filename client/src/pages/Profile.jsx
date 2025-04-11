import React, { useEffect, useState } from "react";
import { DisplayCampaigns } from "../components";
import { useStateContext } from "../context";

const Profile = () => {
  const {
    address,
    contract,
    getUserCampaigns,
    theme,
    fetchProfile,
    setOrgEmail,
    setOtpVerified
  } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [profile, setProfile] = useState(null);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await fetchCampaigns();
        const data = await fetchProfile();
        setProfile(data);
        setOrgEmail(data.email);
        setOtpVerified(true);
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (address && contract) {
      fetchData();
    }
  }, [address, contract]);

  const avatarUrl =
    profile?.profile_image ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`;

  return (
    <div className="mt-10">
      {profile && (
        <div
          className={`${
            theme === "dark"
              ? "bg-[#1f1f1f] text-white"
              : "bg-[#C8BCFF] text-black"
          } max-w-4xl mx-auto rounded-2xl p-6 shadow-lg flex items-center gap-6 mb-10 transition-colors duration-300`}
        >
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-24 h-24 rounded-full border-2 border-green-500"
          />
          <div>
            <h2 className="text-2xl font-semibold">
              {profile.name || "Unnamed User"}
            </h2>
            <p className="text-sm text-gray-500">
              {/* {profile.email || "No email provided"} */}
              {profile.email ? (
                <>
                  <span className="text-sm text-gray-500">{profile.email}</span>
                  <span className="text-sm text-green-500 ml-4">
                    ✅ Email Verified
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-500">No email provided</span>
              )}
            </p>
            <p
              className={`mt-1 ${
                theme === "dark" ? "text-gray-400" : "text-gray-700"
              }`}
            >
              {profile.bio}
            </p>
            <div className="mt-3 space-y-1 text-sm">
              <p>📍 {profile.location || "Unknown Location"}</p>
              {profile.twitter ? (
                <p>
                  🐦{" "}
                  <a
                    href={`https://twitter.com/${profile.twitter?.replace(
                      "@",
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${
                      theme === "dark"
                        ? "text-blue-400 hover:underline"
                        : "text-blue-600 hover:underline"
                    }`}
                  >
                    {profile.twitter}
                  </a>
                </p>
              ) : (
                <p className="text-gray-400">🐦 No Twitter handle provided</p>
              )}
              <p>
                👛 MetaMask Wallet:
                <br />
                {profile?.wallet ? (
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-green-400" : "text-green-700"
                    }`}
                  >
                    Linked Wallet: {profile.wallet}
                  </span>
                ) : (
                  <span className="text-gray-400">Not connected</span>
                )}
              </p>
              <p>
                🕐 Joined:{" "}
                {new Date(profile.created_at).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      <hr
        className={`my-6 h-[1px] border-0 ${
          theme === "dark" ? "bg-white" : "bg-gray-600"
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
