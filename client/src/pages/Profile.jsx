import React, { useEffect, useState } from "react";
import { DisplayCampaigns } from "../components";
import { useStateContext } from "../context";

const Profile = () => {
  const { address, contract, getUserCampaigns, theme, supabase } =
    useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [profile, setProfile] = useState(null);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  const fetchProfile = async () => {
    if (!address) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("wallet", address)
      .single();

    // console.log("Profile data:", data);

    if (error) {
      console.error("Error fetching profile:", error.message);
    } else {
      setProfile(data);
    }
  };

  useEffect(() => {
    async function fetchData() {
      await fetchCampaigns();
      await fetchProfile();
    }
    fetchData();
  }, [address, contract]);

  const avatarUrl =
    profile?.profile_image ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`;

  // sample user profile data
  // const profile = {
  //   name: "Aman Raj",
  //   bio: "Web3 enthusiast. Building decentralized futures.",
  //   location: "Mumbai, India",
  //   twitter: "@amanrajdev",
  //   address: address,
  //   joined: "January 2025",
  //   avatar: https://api.dicebear.com/7.x/identicon/svg?seed=${address},
  // };

  return (
    <div className="mt-10">
      {profile && (
        <div className="bg-[#1f1f1f] max-w-4xl mx-auto rounded-2xl p-6 shadow-lg flex items-center gap-6 mb-10">
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-24 h-24 rounded-full border-2 border-green-500"
          />
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {profile.name}
            </h2>
            <p className="text-gray-400 mt-1">{profile.bio}</p>
            <div className="mt-3 space-y-1 text-sm text-gray-300">
              <p>📍 {profile.location || "Unknown Location"}</p>
              <p>
                🐦{" "}
                <a
                  href={`https://twitter.com/${profile.twitter?.replace(
                    "@",
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {profile.twitter}
                </a>
              </p>
              <p>
                👛 MetaMask Wallet:{" "}
                <br />
                {/* {profile.address ? (
                  <span className="text-green-400">
                    {profile.address.slice(0, 6)}...
                    {profile.address.slice(-4)}
                  </span>
                ) : (
                  <span className="text-gray-500">Not connected</span>
                )} */}
                {profile?.wallet && (
                  <span className="text-sm text-gray-400">
                    Linked Wallet: {profile.wallet}
                  </span>
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
