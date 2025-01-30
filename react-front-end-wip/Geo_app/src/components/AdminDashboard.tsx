import React, { useState } from "react";

const AdminDashboard: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        "http://localhost:8000/api/upload-shapefile/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed.");
      }

      const result = await response.json();
      setUploadStatus(result.message);
      alert("Upload successful!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Upload failed. Please try again.");
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Admin Dashboard
      </h1>

      {/* Alerts Section */}
      <div className="bg-gray-50 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Alerts</h2>
        <p className="text-gray-600">
          No new alerts at the moment. Placeholder for future alert messages or
          notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cards for Statistics */}
        <div className="bg-gray-50 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-700">
            Total Users On The Site
          </h3>
          <p className="text-5xl font-bold text-blue-500 mt-4">50</p>
        </div>
        <div className="bg-gray-50 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-700">Active Sessions</h3>
          <p className="text-5xl font-bold text-green-500 mt-4">10</p>
        </div>
        <div className="bg-gray-50 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-700">
            Address Update Request
          </h3>
          <p className="text-5xl font-bold text-yellow-500 mt-4">3</p>
        </div>
        <div className="bg-gray-50 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-700">Issues</h3>
          <p className="text-5xl font-bold text-red-500 mt-4">None</p>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="bg-gray-50 rounded-lg shadow-lg p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          File Upload
        </h2>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="border border-dashed border-gray-300 rounded-lg p-8 w-full text-center bg-gray-100 hover:bg-gray-200 transition">
            <p className="text-gray-600 mb-4">Drag and drop your files here</p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept=".zip"
            />
            <label
              htmlFor="file-upload"
              className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition cursor-pointer"
            >
              Select Files
            </label>
            {selectedFile && (
              <p className="mt-4 text-gray-600">
                Selected file: {selectedFile.name}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleUpload}
            className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition"
          >
            Upload File
          </button>
          {uploadStatus && (
            <p className="text-sm text-gray-500">{uploadStatus}</p>
          )}
          <p className="text-sm text-gray-500">Shapefiles only.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
