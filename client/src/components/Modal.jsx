import React, { useState } from "react";
import { useStateContext } from "../context";
import { useNavigate } from "react-router-dom";

const Modal = () => {
  const { closeModal } = useStateContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Profile updated successfully!");
      closeModal();
      navigate("/profile");
    }, 5000); // 5 seconds = 5000ms
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
            placeholder="Your Name"
            className="w-full px-4 py-3 bg-[#1f1f1f] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            required
          />
          <textarea
            placeholder="Bio"
            rows="3"
            className="w-full px-4 py-3 bg-[#1f1f1f] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 resize-none"
            required
          />
          <input
            type="text"
            placeholder="Location"
            className="w-full px-4 py-3 bg-[#1f1f1f] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            required
          />
          <input
            type="text"
            placeholder="Twitter Handle"
            className="w-full px-4 py-3 bg-[#1f1f1f] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
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
