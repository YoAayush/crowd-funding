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

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  // Initialize contract
  const { contract, isLoading } = useContract(
    "0xac6c682cb189166de5bdd0aa7496335eeff97702"
    // "0x29d3bc4c993b5f9dcfca4b84f68eed8a4ca4c1d7"
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
  const connectWallet = () => {
    connect(metamaskWallet());
  };
  // console.log("Connect function:", connect);

  const address = useAddress();

  const disconnect = useDisconnect();

  // Publish a new campaign
  const publishCampaign = async (form) => {
    if (!contract) return console.error("Contract is not initialized.");
    if (!address) return alert("Please connect your wallet.");
    console.log("Publishing campaign...");
    // console.log("Form data:", form);
    // console.log("Address:", address);

    if (!createCampaign) {
      console.error("createCampaign is not initialized.");
      return;
    }
    try {
      const targetInEther = form.target.toString(); // Ensure it's a string
      const data = await createCampaign({
        args: [
          address, // owner
          form.title, // title
          form.description, // description
          ethers.utils.parseEther(targetInEther), // target (formatted)
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
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
