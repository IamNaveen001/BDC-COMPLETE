import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { database } from "../firebase";
import { ref, get } from "firebase/database";

function FindDonor() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");
  const [donors, setDonors] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  const displayMessage = (msg, type = "success") => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleSearch = async () => {
    try {
      const donorsRef = ref(database, "donors");
      const snapshot = await get(donorsRef);
      const data = snapshot.val();
      let donorList = data ? Object.values(data) : [];
      if (bloodGroup) {
        donorList = donorList.filter((donor) => donor.bloodType === bloodGroup);
      }
      if (city) {
        donorList = donorList.filter((donor) => donor.city && donor.city.toLowerCase() === city.toLowerCase());
      }
      setDonors(donorList);
      if (donorList.length === 0) {
        displayMessage("No donors found for the selected criteria.", "info");
      } else {
        displayMessage("Donors fetched successfully!", "success");
      }
    } catch (error) {
      console.error("Error fetching donors:", error);
      displayMessage("Failed to fetch donors. Please try again.", "error");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ✅ Navbar stays at the top */}
      <Navbar />
      <div className="bg-gray-50 min-h-screen p-8">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-8">
          Find Donors
        </h2>

        {message.text && (
          <div
            className={`p-3 rounded-lg mb-4 text-center ${message.type === "error" ? "bg-red-100 text-red-700" : message.type === "info" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}
          >
            {message.text}
          </div>
        )}

        {/* Search Form */}
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="p-3 border rounded-lg w-full"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>

            <input
              type="text"
              placeholder="Enter City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="p-3 border rounded-lg w-full"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleSearch}
              className="bg-red-600 text-white px-6 py-3 rounded-lg shadow"
            >
              Search
            </motion.button>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {donors.length === 0 ? (
            <p className="text-center col-span-2 text-gray-600">
              No donors found. Try searching.
            </p>
          ) : (
            donors.map((donor, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-2xl shadow-md"
              >
                <h3 className="text-xl font-bold text-red-600">{donor.name}</h3>
                <p>
                  <strong>Group:</strong> {donor.bloodType}
                </p>
                <p>
                  <strong>City:</strong> {donor.address}
                </p>
                <p>
                  <strong>Contact:</strong> {donor.contactNumber}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FindDonor;
