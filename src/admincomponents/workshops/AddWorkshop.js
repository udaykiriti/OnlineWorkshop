import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Input, Button, DatePicker, TimePicker, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "react-toastify/dist/ReactToastify.css";
import "../layout/AdminDashboard.css";
import dayjs from "dayjs";
import AdminLayout from "../layout/AdminLayout";
import api from "../../api";

const AddWorkshop = () => {
  const [workshopData, setWorkshopData] = useState({
    name: "",
    date: null,
    time: null,
    meetingLink: "",
    description: "",
    instructor: "",
    material: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkshopData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (file) => {
    setWorkshopData((prevData) => ({
      ...prevData,
      material: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", workshopData.name);
    formData.append("date", workshopData.date);
    formData.append("time", workshopData.time);
    formData.append("meetingLink", workshopData.meetingLink);
    formData.append("description", workshopData.description);
    formData.append("instructor", workshopData.instructor);
    formData.append("material", workshopData.material);

    try {
      await api.post("/api/workshops", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Workshop added successfully!");
      setWorkshopData({
        name: "",
        date: null,
        time: null,
        meetingLink: "",
        description: "",
        instructor: "",
        material: null,
      });
    } catch (error) {
      console.error("Error adding workshop:", error);
      toast.error("Error adding workshop.");
    }
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="workshop-form-container">
        <h3>Add New Workshop</h3>
        <form onSubmit={handleSubmit} className="workshop-form">
          <div className="form-group full-width">
            <label>Workshop Name</label>
            <Input
              type="text"
              name="name"
              value={workshopData.name}
              onChange={handleChange}
              placeholder="Enter workshop name"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <DatePicker
                value={workshopData.date ? dayjs(workshopData.date) : null}
                onChange={(date) => setWorkshopData({ ...workshopData, date })}
                style={{ width: "100%" }}
                required
              />
            </div>

            <div className="form-group">
              <label>Time</label>
              <TimePicker
                value={workshopData.time ? dayjs(workshopData.time) : null}
                onChange={(time) => setWorkshopData({ ...workshopData, time })}
                format="HH:mm"
                style={{ width: "100%" }}
                required
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Meeting Link</label>
            <Input
              type="url"
              name="meetingLink"
              value={workshopData.meetingLink}
              onChange={handleChange}
              placeholder="Enter meeting link"
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <Input.TextArea
              name="description"
              value={workshopData.description}
              onChange={handleChange}
              placeholder="Enter workshop description"
              rows={4}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Instructor</label>
              <Input
                type="text"
                name="instructor"
                value={workshopData.instructor}
                onChange={handleChange}
                placeholder="Enter instructor name"
                required
              />
            </div>

            <div className="form-group">
              <label>Workshop Material</label>
              <Upload
                onChange={(info) => handleFileChange(info.file)}
                beforeUpload={() => false}
                accept=".pdf,.doc,.docx"
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />} className="upload-btn">Select Material</Button>
              </Upload>
              {workshopData.material && <span className="file-name">{workshopData.material.name}</span>}
            </div>
          </div>

          <Button type="primary" htmlType="submit" block className="submit-btn">
            Add Workshop
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddWorkshop;