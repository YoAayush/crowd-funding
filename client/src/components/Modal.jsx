import React, { useState } from "react";
import { useStateContext } from "../context";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // for unique image name

const Modal = () => {
  const { closeModal, supabase, address } = useStateContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    location: "",
    twitter: "",
    profilePicture: null, // now holds a File object
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      setProfile((prev) => ({ ...prev, profilePicture: files[0] }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = "";

    if (profile.profilePicture) {
      const fileExt = profile.profilePicture.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(fileName, profile.profilePicture);

      if (uploadError) {
        console.error("Upload error:", uploadError.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("profile-images")
        .getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from("profiles").insert([
      {
        name: profile.name,
        bio: profile.bio,
        location: profile.location,
        twitter: profile.twitter,
        profile_image: imageUrl,
        wallet: address,
      },
    ]);

    if (error) {
      console.error("Insert error:", error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    alert("Profile updated successfully!");
    closeModal();
    navigate("/profile");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60">
      <div className="relative max-w-xl w-full mx-4 sm:mx-auto bg-[#141414] p-8 rounded-2xl shadow-2xl">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Your Profile
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={profile.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#1f1f1f] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
          />
          <textarea
            name="bio"
            placeholder="Bio"
            rows="3"
            value={profile.bio}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#1f1f1f] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 resize-none"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={profile.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#1f1f1f] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
          />
          <input
            type="text"
            name="twitter"
            placeholder="Twitter Handle"
            value={profile.twitter}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#1f1f1f] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
          />
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-white"
          />

          <button
            type="submit"
            className={`w-full flex justify-center items-center gap-2 ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } text-white font-semibold py-3 rounded-lg transition duration-200`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
