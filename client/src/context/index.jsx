import React, { useContext, createContext, useEffect, useState } from "react";
import {
  useAddress,
  useContract,
  useConnect,
  useContractWrite,
  metamaskWallet,
  useDisconnect,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  // useEffect(() => {
  //   console.log("modal state changed:", isModalOpen);
  // }, [isModalOpen]);

  // Initialize contract
  const { contract, isLoading } = useContract(
    import.meta.env.VITE_CONTRACT_ADDRESS
  );

  // if (isLoading) {
  //   console.log("Contract is still loading...");
  // }

  // Get function hooks
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );

  const { mutateAsync: deleteCampaign } = useContractWrite(
    contract,
    "deleteCampaign"
  );

  // console.log("Create campaign function:", createCampaign);

  // console.log("Contract address:", contract?.getAddress?.());
  // console.log("Is contract loading:", isLoading);

  const connect = useConnect();
  const address = useAddress();
  // console.log("Connected address:", address);

  const connectWallet = () => {
    connect(metamaskWallet());
  };

  useEffect(() => {
    if (!address) return;

    try {
      const fetchUserProfile = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("wallet", address)
          .single();

        if (error) {
          console.error("Error fetching profile:", error.message);
        } else {
          // console.log("User profile data:", data);
          return true; // Profile exists
        }
      };

      fetchUserProfile().then((profileExists) => {
        if (profileExists) {
          console.log("User profile already exists.");
          navigate("/profile");
        } else {
          openModal(); // Open modal to create a new profile
          console.log("User profile does not exist. Opening modal.");
        }
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }, [address]);

  const disconnect = useDisconnect();

  // Publish a new campaign
  const publishCampaign = async (form) => {
    if (!contract) return console.error("Contract is not initialized.");
    if (!address) return alert("Please connect your wallet.");
    console.log("Publishing campaign...");
    console.log("Form data:", form);
    // console.log("Address:", address);

    if (!createCampaign) {
      console.error("createCampaign is not initialized.");
      return;
    }
    try {
      // const targetInEther = form.target.toString(); // Ensure it's a string
      const data = await createCampaign({
        args: [
          address, // owner address
          form.ownerName, // onwer name
          form.title, // title
          form.description, // description
          // ethers.utils.parseEther(targetInEther), // target (formatted)
          form.target, // target (in ETHer)
          Math.floor(new Date(form.deadline).getTime() / 1000), // Convert to seconds
          form.image,
        ],
      });

      console.log("Contract call success:", data);
    } catch (error) {
      console.log("Contract call failure:", error);
    }
  };

  // Fetch all campaigns
  const getCampaigns = async () => {
    const campaigns = await contract.call("getCampaigns");

    const parsedCampaigns = campaigns.map((campaign, i) => ({
      ownerName: campaign.ownerName,
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      image: campaign.image,
      pId: i,
      isDeleted: campaign.isDeleted,
    }));

    return parsedCampaigns;
  };

  // Get campaigns owned by the current user
  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === address
    );

    return filteredCampaigns;
  };

  // Donate to a campaign
  const donate = async (pId, amount) => {
    try {
      const data = await contract.call("donateToCampaign", [pId], {
        value: ethers.utils.parseEther(amount),
      });

      return data;
    } catch (error) {
      console.error("Donation error:", error);
    }
  };

  // Get all donations for a campaign
  const getDonations = async (pId) => {
    const donations = await contract.call("getDonators", [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  const handleDelete = async (pId) => {
    try {
      await deleteCampaign({ args: [pId] });
      console.log("Campaign deleted successfully!");
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    // document.body.classList.remove("light", "dark");
    // document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  // const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabaseKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);
  // console.log("Supabase client:", supabase);

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
    }

    return data;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connectWallet,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        disconnect,
        handleDelete,
        setSearchQuery,
        searchQuery,
        theme,
        setTheme,
        isModalOpen,
        closeModal,
        openModal,
        supabase,
        fetchProfile,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
