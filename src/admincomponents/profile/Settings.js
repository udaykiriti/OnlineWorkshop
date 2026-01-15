import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../layout/AdminDashboard.css";
import { EditOutlined, CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Input, Card, Spin } from "antd";
import AdminLayout from "../layout/AdminLayout";
import api from "../../api";

const Settings = () => {
  const storedUsername = localStorage.getItem("username") || "admin"; 
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editField, setEditField] = useState(null);
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/users/${storedUsername}`);
        const { id, ...profileData } = response.data; 
        setUserProfile(profileData); 
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [storedUsername]);

  const handleEditField = (field, value) => {
    setEditField(field);
    setNewValue(value);
  };

  const handleUpdateField = async (field) => {
    try {
      const updatedProfile = {
        ...userProfile,
        [field]: newValue,
      };

      await api.put(`/api/users/${storedUsername}`, updatedProfile);
      
      setUserProfile(updatedProfile); 
      toast.success(
        `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`
      );
      setEditField(null);
      setNewValue("");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile: " + error.message);
    }
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <h3>Edit Profile</h3>

      {loading ? (
        <div className="loading-spinner">
          <Spin size="large" />
          <p>Loading...</p>
        </div>
      ) : (
        <div className="profile-container">
          {Object.entries(userProfile).map(([key, value]) => (
            key !== "password" && (
              <Card key={key} className="profile-card">
                <div className="profile-field">
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                  {editField === key ? (
                    <div className="edit-field">
                      <Input
                        type="text"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        className="input-field"
                      />
                      <Button
                        icon={<SaveOutlined />}
                        onClick={() => handleUpdateField(key)}
                        type="primary"
                      />
                      <Button
                        icon={<CloseOutlined />}
                        onClick={() => setEditField(null)}
                        type="default"
                        />
                    </div>
                  ) : (
                    <div className="view-field">
                      <span>{value}</span>
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEditField(key, value)}
                        type="link"
                      />
                    </div>
                  )}
                </div>
              </Card>
            )
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default Settings;