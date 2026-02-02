import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
// import { api } from "../api";
import { database } from "../firebase";
import { ref, push } from "firebase/database";

function DonorRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bloodType: "",
    address: "",
    city: "",
    pincode: "",
    contactNumber: "",
    dob: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const displayMessage = (msg, type = "success") => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Register donor in your backend (optional, keep if needed)
      // await api.post("/donors", formData);

      // Register donor in Firebase Realtime Database
      const donorsRef = ref(database, "donors");
      await push(donorsRef, formData);

      displayMessage("Donor registered successfully!", "success");
      setFormData({
        name: "",
        email: "",
        bloodType: "",
        address: "",
        city: "",
        pincode: "",
        contactNumber: "",
        dob: "",
      });
    } catch (error) {
      console.error("Error registering donor:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || error.message || "Error registering donor.";
      displayMessage(errorMessage, "error");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ✅ Navbar stays at the top */}
      <Navbar />

      {/* ✅ Form centered below navbar */}
      <div className="flex justify-center items-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-8 rounded-2xl shadow-md w-full max-w-lg"
        >
          <h2 className="text-3xl font-bold text-red-600 text-center mb-6">
            Donor Registration
          </h2>
          {message.text && (
            <div
              className={`p-3 rounded-lg mb-4 text-center ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
            >
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
              required
            />

            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
              required
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
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
              required
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
              required
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
            />

            <input
              type="text"
              name="contactNumber"
              placeholder="Contact Number"
              value={formData.contactNumber}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
              required
            />

            <input
              type="date"
              name="dob"
              placeholder="Date of Birth"
              value={formData.dob}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
              required
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold shadow"
            >
              Register
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default DonorRegister;