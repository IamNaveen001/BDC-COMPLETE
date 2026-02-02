import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import { AuthContext } from '../context/AuthContext';
import { database } from '../firebase';
import { ref, get, update } from 'firebase/database';

function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bloodType: "",
    contactNumber: "",
    city: "",
    pincode: "",
    dob: "",
    hasDonatedRecently: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [donorId, setDonorId] = useState(null);

  const displayMessage = (msg, type = "success") => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  useEffect(() => {
    const fetchDonorProfile = async () => {
      if (user && user.email) {
        try {
          const donorsRef = ref(database, "donors");
          const snapshot = await get(donorsRef);
          const data = snapshot.val();
          if (data) {
            const donorEntry = Object.entries(data).find(([, value]) => value.email === user.email);
            if (donorEntry) {
              const [key, value] = donorEntry;
              setFormData({
                ...value,
                dob: value.dob ? new Date(value.dob).toISOString().split('T')[0] : "",
                hasDonatedRecently: value.hasDonatedRecently ? "Yes" : "No",
              });
              setDonorId(key);
            }
          }
        } catch (error) {
          console.error("Error fetching donor profile:", error);
          displayMessage("Failed to load profile.", "error");
        }
      }
    };
    fetchDonorProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!donorId) {
      displayMessage("Cannot update profile: Donor ID not found.", "error");
      return;
    }
    try {
      const donorRef = ref(database, `donors/${donorId}`);
      await update(donorRef, formData);
      setUser({ ...user, ...formData }); // Update user context with new data
      displayMessage('Profile updated successfully!', "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      displayMessage(error.message || "Error updating profile.", "error");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="flex justify-center items-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-8 rounded-2xl shadow-md w-full max-w-lg"
        >
          <h2 className="text-3xl font-bold text-red-600 text-center mb-6">
            Your Profile
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
              name="phone"
              placeholder="Phone"
              value={formData.phone}
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
            <select
              name="hasDonatedRecently"
              value={formData.hasDonatedRecently}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full"
              required
            >
              <option value="">Recently Donated?</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold shadow"
            >
              Update Profile
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;
