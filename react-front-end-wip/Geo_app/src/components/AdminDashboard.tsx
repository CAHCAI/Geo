import { TrashIcon, ClipboardCopy, Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getActiveSessions, ActiveSessionsResponse } from "@/lib/utils";

const fixedApiKey = import.meta.env.VITE_API_KEY;

interface Alert {
  id: number;
  type: "error" | "success" | "info";
  message: string;
}

interface ContainerStatus {
  redis: boolean;
  postgis: boolean;
  django: boolean;
  react: boolean;
}

const AdminDashboard: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [coordinates, setCoordinates] = useState("");
  const [address, setAddress] = useState("");
  const [showAddressInput, setShowAddressInput] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("senate");
  const [adminCount, setAdminCount] = useState<number | null>(null);
  const [normalCount, setNormalCount] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [containerStatus, setContainerStatus] = useState<ContainerStatus | null>(null);

  interface AdminError {
    id: number;
    error_code: number;
    error_description: string;
    files_name: string;
    line_number: string;
    created_at: string;
  }

  const [issues, setIssues] = useState<AdminError[]>([]);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newAppName, setNewAppName] = useState("");

  useEffect(() => {
    const fetchContainerStatus = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/service_status/", {
          headers: { "X-API-KEY": fixedApiKey }
        });
        if (response.ok) {
          const data = await response.json();
          setContainerStatus(data);
        } else {
          console.error("Failed to fetch container status");
        }
      } catch (error) {
        console.error("Error fetching container status:", error);
      }
    };
  
    fetchContainerStatus();
    const interval = setInterval(fetchContainerStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchInterval = setInterval(() => {
      setRefreshCounter((prev) => prev + 1);
    }, 10000); // Poll every 10 seconds

    const fetchIssues = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/admin_errors/",
          {
            headers: { "X-API-KEY": fixedApiKey },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch issues");
        const data = await response.json();
        setIssues(data);
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };

    fetchIssues(); // Initial fetch
    return () => clearInterval(fetchInterval);
  }, [refreshCounter]);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const { admin_count, normal_count } = await getActiveSessions();
        setAdminCount(admin_count);
        if (normal_count !== null) {
          setNormalCount(Math.round(normal_count / 10));
        } else {
          setNormalCount(null);
        }
      } catch (err) {
        console.error("Failed to fetch active sessions:", err);
      }
    }

    fetchSessions();
    const intervalId = setInterval(fetchSessions, 30000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/api-keys/", {
          headers: {
            "X-API-KEY": fixedApiKey,
          },
        });
        const data = await response.json();
        setApiKeys(data);
      } catch (err) {
        console.error("Failed to fetch API keys:", err);
        addAlert("error", "Failed to load API keys.");
      }
    };

    fetchApiKeys(); // Initial fetch
  }, [refreshCounter]);

  useEffect(() => {
    const fetchUsageCounts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/api-keys/", {
          headers: {
            "X-API-KEY": fixedApiKey,
          },
        });
        const data = await response.json();
        setApiKeys(data);
      } catch (err) {
        console.error("Error fetching updated usage:", err);
      }
    };

    fetchUsageCounts(); // initial fetch
    const interval = setInterval(fetchUsageCounts, 10000); // every 10s
    return () => clearInterval(interval);
  }, []);

  const handleGenerateApiKey = async () => {
    if (!newAppName.trim()) {
      addAlert("error", "Please enter an app name.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/generate-api-key/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ app_name: newAppName }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate API key");
      const newKey = await response.json();
      addAlert("success", `API key generated for ${newAppName}`);
      setApiKeys((prev) => [
        ...prev,
        {
          key: newKey.api_key,
          app_name: newKey.app_name,
          usage_count: newKey.usage_count || 0,
        },
      ]);
      setNewAppName("");
    } catch (err) {
      console.error("Generate failed:", err);
      addAlert("error", "Failed to generate API key.");
    }
  };

  const handleRevokeApiKey = async (key: string) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/revoke-api-key/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key: key }),
        }
      );

      if (!response.ok) throw new Error("Failed to revoke API key");

      // Trigger animation
      setDeletingKey(key);

      // Wait for animation to finish
      setTimeout(() => {
        setApiKeys((prevKeys) => prevKeys.filter((k) => k.key !== key));
        setDeletingKey(null);
      }, 300);

      addAlert("success", "API key revoked.");
    } catch (err) {
      console.error("Revoke failed:", err);
      addAlert("error", "Failed to revoke API key.");
    }
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000); // reset after 2 sec
    });
  };

  //deleting records from the database
  const handleResolveError = async (errorId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin_errors/${errorId}/`,
        { method: "DELETE", headers: { "X-API-KEY": fixedApiKey } }
      );
      if (!response.ok) throw new Error("Failed to delete error");
      setIssues((prev) => prev.filter((error) => error.id !== errorId));
      addAlert("success", "Error resolved successfully");
    } catch (error) {
      console.error("Error deleting:", error);
      addAlert("error", "Failed to resolve error");
    }
  };

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
    if (
      file.type === "application/zip" ||
      file.name.endsWith(".zip") ||
      file.type === "application/csv" ||
      file.name.endsWith(".csv")
    ) {
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
    formData.append("file_type", selectedOption);

    setIsUploading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/upload-shapefile/",
        {
          method: "POST",
          body: formData,
          headers: {
            "X-API-KEY": fixedApiKey,
          },
        }
      );

      console.log(response);

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

  const handleCoordinatesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const coordinatesRegex = /^-?\d{1,3}\.\d+,\s*-?\d{1,3}\.\d+$/;
    setCoordinates(value);
    setShowAddressInput(coordinatesRegex.test(value));
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
    setShowSubmitButton(event.target.value.length > 0);
  };

  const handleSubmit = () => {
    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const lat = parseFloat(coordinates.split(",")[0].trim());
      const lon = parseFloat(coordinates.split(",")[1].trim());

      if (isNaN(lat) || isNaN(lon)) {
        throw new Error(
          "Invalid coordinate format. Ensure it is in 'lat, lon' format."
        );
      }

      const response = await fetch(
        "http://localhost:8000/api/override-location/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": fixedApiKey,
          },
          body: JSON.stringify({
            lat: lat,
            lon: lon,
            address: address.trim(),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server response error:", errorData);
        throw new Error(errorData.message || "Failed to update location.");
      }

      alert(
        `Coordinates: ${coordinates}\nAddress: ${address}\nSuccessfully Updated!`
      );
    } catch (error) {
      console.error("Error updating location:", error);
      alert("Failed to update location. Please try again.");
    }

    setIsSubmitting(false);
    setCoordinates("");
    setAddress("");
    setShowAddressInput(false);
    setShowSubmitButton(false);
    setShowConfirmation(false);
  };

  return (
    // Wrap in a <main> with an aria-label to identify this primary region
    <main
      className="container mx-auto p-4"
      aria-label="Admin Dashboard"
      id="admin-dashboard"
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Admin Dashboard
      </h1>

      {/* Alerts Section */}
      <section
        className="bg-gray-50 rounded-lg shadow-lg p-6 mb-6 max-h-[30vh]"
        role="region"
        aria-labelledby="alerts-heading"
      >
        <h2
          id="alerts-heading"
          className="text-xl font-semibold text-gray-700 mb-4"
        >
          Alerts
        </h2>
        {alerts.length === 0 ? (
          <p className="text-gray-600">No new alerts at the moment.</p>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                // Optionally add role="alert" if you'd like these to be read out immediately by screen readers.
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
      </section>

      {/* Active Admin Sessions Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Admin Sessions Card */}
        <div className="bg-gray-50  rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-1">
            Active Admin Sessions
          </h2>
          <p className="text-3xl font-semibold text-blue-600">
            {adminCount !== null ? adminCount : "Loading..."}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Currently logged-in admin users
          </p>
        </div>

        {/* Normal User Sessions Card */}
        <div className="bg-gray-50 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-1">
            Active Normal Users
          </h2>
          <p className="text-3xl font-semibold text-green-600">
            {normalCount !== null ? normalCount : "Loading..."}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Non-admin authenticated sessions
          </p>
        </div>
      </div>

      {/* Statistics Section */}
      <section
        className="bg-gray-50 rounded-lg shadow-lg p-6 mb-6"
        aria-label="Statistics"
      >
        <div className="flex items-center mb-2">
          <h2 className="text-xl font-bold text-gray-700">Issues</h2>
        </div>
        <div className="max-h-[30vh] overflow-y-auto">
          <table className="divide-y divide-gray-200 ">
            <thead className="bg-gray-50">
              <tr>
                {" "}
                {/*I will remove this after demo*/}
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-32">
                  Error ID
                </th>
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-32">
                  Error Code
                </th>
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider min-w-[500px]">
                  Description
                </th>
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-48">
                  Error File
                </th>
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-48">
                  Error Line
                </th>
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-48">
                  Date Occurred
                </th>
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {issues.map((error) => (
                <tr key={error.id}>
                  <td className="px-8 py-4 whitespace-nowrap text-base font-mono text-red-600">
                    {error.id}
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-base font-mono text-red-600">
                    {error.error_code}
                  </td>
                  <td className="px-8 py-4 whitespace-normal text-base text-gray-900 max-w-2xl">
                    {error.error_description}
                  </td>
                  <td className="px-8 py-4 whitespace-normal text-base text-gray-900 max-w-2xl">
                    {error.files_name}
                  </td>
                  <td className="px-8 py-4 whitespace-normal text-base text-gray-900 max-w-2xl">
                    {error.line_number}
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-base text-gray-500">
                    {new Date(error.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleResolveError(error.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                      aria-label={`Mark error ${error.id} as resolved`}
                    >
                      <TrashIcon className="w-5 h-5" />
                      <span>Clear</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Container Status */}
      <ul className="space-y-2">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Service Status</h2>
        {containerStatus && Object.entries(containerStatus).map(([name, isRunning]) => (
          <li key={name} className="flex items-center gap-2">
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                isRunning ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="font-semibold capitalize">{name}:</span>
            <span className={isRunning ? "text-green-600" : "text-red-600"}>
              {isRunning ? "Running" : "Stopped"}
            </span>
          </li>
        ))}
      </ul>

      {/* Dropdown Menu (above file upload) */}
      <section
        className="w-full pt-6"
        aria-label="Geographical Selection Dropdown"
      >
        <label
          className="block text-gray-700 font-medium mb-2"
          htmlFor="select-option"
        >
          Select Option
        </label>
        <select
          id="select-option"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        >
          <option value="senate">Senate District</option>
          <option value="assembly">Assembly District</option>
          <option value="congressional">Congressional District</option>
          <option value="laspa">LA Service Planning Area</option>
          <option value="hsa">Health Service Area</option>
          <option value="rnsa">Registered Nurse Shortage Area</option>
          <option value="mssa">Medical Service Study Area</option>
          <option value="pcsa">Primary Care Shortage Area</option>
          <option value="hpsa">
            Health Professional Shortage Area (.csv only)
          </option>
        </select>
        <p className="text-sm text-gray-500 mt-2">
          You have selected:{" "}
          {selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)}
        </p>
      </section>

      {/* File Upload Section */}
      <section
        className="bg-gray-50 rounded-lg shadow-lg p-6 mt-6"
        aria-label="File Upload"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          File Upload
        </h2>
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Drag-and-drop area */}
          <div
            className={`border-2 border-dashed ${
              isDragging ? "border-blue-500" : "border-gray-300"
            } rounded-lg p-8 w-full text-center bg-gray-100 hover:bg-gray-200 transition`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            aria-label="Drag and drop your files here"
          >
            <p className="text-gray-600 mb-4">Drag and drop your files here</p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept=".zip,.csv"
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

          {/* Upload button */}
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
          <p className="text-sm text-gray-500">Shapefiles & .csv only.</p>
        </div>
      </section>

      {/* API Key Management Section */}
      <section className="bg-gray-50 rounded-lg shadow-lg p-6 mt-10 mb-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          API Key Management
        </h2>

        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Enter App Name"
            className="p-2 border border-gray-300 rounded-l-md w-full"
            value={newAppName}
            onChange={(e) => setNewAppName(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
            onClick={handleGenerateApiKey}
          >
            Generate
          </button>
        </div>

        <table className="w-full table-auto text-left border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">API Key</th>
              <th className="px-4 py-2">App Name</th>
              <th className="px-4 py-2">Usage Count</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((key) => (
              <tr
                key={key.key}
                className={`transition-opacity duration-300 ease-in-out ${
                  deletingKey === key.key ? "opacity-0" : "opacity-100"
                }`}
              >
                <td className="px-4 py-2 font-mono truncate max-w-[250px]">
                  <div className="flex items-center gap-2">
                    <span className="truncate">{key.key}</span>
                    <button
                      onClick={() => handleCopy(key.key)}
                      className="text-blue-500 hover:text-blue-700 transition"
                      title={
                        copiedKey === key.key ? "Copied!" : "Copy to clipboard"
                      }
                    >
                      {copiedKey === key.key ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <ClipboardCopy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-2">{key.app_name || "—"}</td>
                <td className="px-4 py-2">{key.usage_count}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleRevokeApiKey(key.key)}
                    className="text-red-600 hover:underline"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default AdminDashboard;

/*
  const confirmSubmit = () => {
    alert(`Coordinates: ${coordinates}\nAddress: ${address}\nSuccessfully Updated!`);
    setCoordinates("");
    setAddress("");
    setShowAddressInput(false);
    setShowSubmitButton(false);
    setShowConfirmation(false);
  };
 */
