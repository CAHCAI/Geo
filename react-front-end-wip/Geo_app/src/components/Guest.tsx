import React, { useState } from "react";

interface Alert {
  id: number;
  type: "error" | "success" | "info";
  message: string;
}

const GuestDashBoard: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      validateAndSetFile(file);
    }
  };

  // Handle drag-and-drop events
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  // Validate and set the selected file
  const validateAndSetFile = (file: File) => {
    if (file.type === "application/zip" || file.name.endsWith(".zip")) {
      setSelectedFile(file);
      addAlert("info", `Selected file: ${file.name}`);
    } else {
      addAlert("error", "Invalid file type. Please upload a .zip file.");
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      addAlert("error", "Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsUploading(true);

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
      addAlert("success", result.message || "Upload successful!");
    } catch (error) {
      console.error("Error uploading file:", error);
      addAlert("error", "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Add a new alert
  const addAlert = (type: Alert["type"], message: string) => {
    const newAlert: Alert = {
      id: Date.now(),
      type,
      message,
    };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);

    // Automatically remove the alert after 10 seconds
    setTimeout(() => {
      removeAlert(newAlert.id);
    }, 10000);
  };

  // Remove an alert by id
  const removeAlert = (id: number) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Guest Dashboard
      </h1>

      {/* Alerts Section */}
      <div className="bg-gray-50 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">File Upload Status</h2>
        {alerts.length === 0 ? (
          <p className="text-gray-600">None uploaded</p>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg ${
                  alert.type === "error"
                    ? "bg-red-100 text-red-700"
                    : alert.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                <p>{alert.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* File Upload Section */}
      <div className="bg-gray-50 rounded-lg shadow-lg p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          File Upload
        </h2>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div
            className={`border-2 border-dashed ${
              isDragging ? "border-blue-500" : "border-gray-300"
            } rounded-lg p-8 w-full text-center bg-gray-100 hover:bg-gray-200 transition`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
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
            disabled={isUploading || !selectedFile}
            className={`px-6 py-3 ${
              isUploading || !selectedFile
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } text-white font-bold rounded-lg shadow-md transition`}
          >
            {isUploading ? "Uploading..." : "Upload File"}
          </button>
          <p className="text-sm text-gray-500">Shapefiles only.</p>
        </div>
      </div>


    </div>
  );
};

export default GuestDashBoard;


