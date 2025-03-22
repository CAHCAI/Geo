import React, { useEffect, useState } from "react";
import {
  listOverrides,
  createOverride,
  deleteOverride,
  updateOverride,
  uploadXlsx,
} from "@/lib/utils"; // Adjust import paths as needed
import { OverrideLocationIn, OverrideLocationOut } from "@/lib/utils";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";

const OverridesPage: React.FC = () => {
  //overrides list
  const [overrides, setOverrides] = useState<OverrideLocationOut[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Add/Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<OverrideLocationOut | null>(
    null
  );
  const [newOverride, setNewOverride] = useState<OverrideLocationIn>({
    address: "",
    latitude: 0,
    longitude: 0,
  });

  // Delete Confirmation
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  // File upload (Excel) states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Coordinate Override states
  const [coordinates, setCoordinates] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [showAddressInput, setShowAddressInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    fetchOverrides();
  }, []);

  // CRUD & File Upload
  async function fetchOverrides() {
    setIsLoading(true);
    try {
      const data = await listOverrides();
      // Sort so the highest ID = most recently changed
      data.sort((a, b) => b.id - a.id);
      setOverrides(data);
    } catch (error) {
      console.error("Error fetching overrides:", error);
    }
    setIsLoading(false);
  }

  // Create or Update a single override
  const handleCreateOrUpdate = async () => {
    setIsLoading(true);
    try {
      if (editingItem) {
        // Update
        await updateOverride(editingItem.id, newOverride);
      } else {
        // Create
        await createOverride(newOverride);
      }
      fetchOverrides();
      setShowModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error creating/updating override:", error);
    }
    setIsLoading(false);
  };

  // Delete a single override
  const handleDelete = async () => {
    if (deleteItemId !== null) {
      setIsLoading(true);
      try {
        await deleteOverride(deleteItemId);
        fetchOverrides();
      } catch (error) {
        console.error("Error deleting override:", error);
      }
      setDeleteItemId(null);
      setIsLoading(false);
    }
  };

  // Drag & Drop / Validate Excel
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };
  const validateAndSetFile = (file: File) => {
    if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.name.toLowerCase().endsWith(".xlsx")
    ) {
      setSelectedFile(file);
    } else {
      alert("Invalid file type. Please upload a .xlsx Excel file.");
    }
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("No file selected!");
      return;
    }
    setIsUploading(true);
    try {
      const resp = await uploadXlsx(selectedFile);
      alert(resp.message || "File uploaded successfully!");
      fetchOverrides();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Coordinate Override logic
  const handleCoordinatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCoordinates(value);

    // Simple regex to detect "lat, lon" format
    const coordinatesRegex = /^-?\d{1,3}\.\d+,\s*-?\d{1,3}\.\d+$/;
    setShowAddressInput(coordinatesRegex.test(value));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAddress(val);
    // If there's some text in address, show submit
    setShowSubmitButton(val.trim().length > 0);
  };

  const handleSubmit = () => {
    setShowConfirmation(true);
  };

  const handleCoordSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Parse the coordinate string, e.g. "35.1234, -120.9876"
      const [latStr, lonStr] = coordinates.split(",");
      const latNum = parseFloat(latStr?.trim() ?? "");
      const lonNum = parseFloat(lonStr?.trim() ?? "");

      // Build the payload directly
      const payload = {
        address,
        latitude: isNaN(latNum) ? 0 : latNum,
        longitude: isNaN(lonNum) ? 0 : lonNum,
      };

      // Decide if we are creating or updating
      if (editingItem) {
        // If editing an existing override
        await updateOverride(editingItem.id, payload);
        console.log("Updated existing override with new coords & address");
      } else {
        // Otherwise create a brand-new override
        await createOverride(payload);
        console.log("Created new override with coords & address");
      }

      // Refresh overrides
      fetchOverrides();

      // Reset local states
      setCoordinates("");
      setAddress("");
      setShowAddressInput(false);
      setShowSubmitButton(false);
      setShowConfirmation(false);
    } catch (err) {
      console.error("Error in coordinate submission:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-3xl font-semibold text-gray-800">Manual Overrides</h1>

      {/* Excel File Upload Section */}
      <section
        className="bg-gray-50 rounded-lg shadow-lg p-6 mt-6 w-full max-w-3xl mx-auto"
        aria-label="File Upload"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Excel File Upload
        </h2>
        <div className="bg-gray-50 flex flex-col items-center justify-center space-y-4">
          {/* Drag-and-drop area */}
          <div
            className={`border-2 border-dashed ${
              isDragging ? "border-blue-500" : "border-gray-300"
            } rounded-lg p-8 w-full text-center bg-gray-100 hover:bg-gray-200 transition`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            aria-label="Drag and drop your .xlsx file here"
          >
            <p className="text-gray-600 mb-4">
              Drag and drop your .xlsx file here
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".xlsx"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition cursor-pointer"
            >
              Select File
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

          <p className="text-sm text-gray-500">
            Excel files only: <code>.xlsx</code>
          </p>
        </div>
      </section>

      {/* Coordinate Override Section */}
      <section
        className="bg-gray-50 rounded-lg shadow-lg p-6 mb-6 mt-10 w-full max-w-3xl mx-auto"
        aria-label="Coordinate Override"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Coordinate Override
        </h2>

        <label htmlFor="coordinate-input" className="sr-only">
          Enter coordinates (lat, lon)
        </label>
        <input
          id="coordinate-input"
          type="text"
          placeholder="Enter coordinates (lat, lon)"
          value={coordinates}
          onChange={handleCoordinatesChange}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />

        {showAddressInput && (
          <>
            <label htmlFor="address-input" className="sr-only">
              Enter new address
            </label>
            <input
              id="address-input"
              type="text"
              placeholder="Enter new address"
              value={address}
              onChange={handleAddressChange}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
          </>
        )}
        {showSubmitButton && (
          <button
            onClick={handleCoordSubmit}
            className={`px-6 py-3 bg-orange-500 text-white font-bold rounded-lg shadow-md transition ${
              isSubmitting ? "" : "hover:bg-orange-600"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </section>

      {/* Overrides List */}
      <div className="bg-gray-50 rounded-lg shadow-lg p-6 mt-6 w-full max-w-3xl mx-auto max-h-[40vh] overflow-y-auto">
        {isLoading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          overrides.map((override) => (
            <motion.div
              key={override.id}
              className="bg-gray-50 shadow-md p-4 rounded-lg flex justify-between items-center"
              whileHover={{ scale: 1.02 }}
            >
              {/* Address & Coordinates */}
              <div className="flex-1 mr-4">
                <p className="font-semibold truncate pr-2 max-w-[300px]">
                  {override.address}
                </p>
                <p className="text-sm text-gray-500">
                  Lat: {override.latitude}, Lon: {override.longitude}
                </p>
              </div>
              {/* Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md"
                  onClick={() => {
                    setEditingItem(override);
                    setNewOverride({
                      address: override.address,
                      latitude: override.latitude,
                      longitude: override.longitude,
                    });
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-md"
                  onClick={() => setDeleteItemId(override.id)}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteItemId !== null}
        onClose={() => setDeleteItemId(null)}
      >
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Dialog.Title className="text-lg font-medium">
              Confirm Deletion
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-600 mt-2">
              Are you sure you want to delete this override entry? (You must
              click "Delete" below to confirm.)
            </Dialog.Description>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md"
                onClick={() => setDeleteItemId(null)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center justify-center"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <span className="animate-spin h-5 w-5 border-t-2 border-white rounded-full" />
                    <span>Deleting...</span>
                  </div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Add/Edit Override Modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              ❌
            </button>
            <Dialog.Title className="text-lg font-semibold">
              {editingItem ? "Edit Override" : "Add Override"}
            </Dialog.Title>
            <div className="mt-2">
              <input
                type="text"
                className="border rounded w-full p-2 mt-2"
                placeholder="Address"
                value={newOverride.address}
                onChange={(e) =>
                  setNewOverride({ ...newOverride, address: e.target.value })
                }
              />
              <input
                type="number"
                className="border rounded w-full p-2 mt-2"
                placeholder="Latitude"
                value={newOverride.latitude}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setNewOverride({
                    ...newOverride,
                    latitude: isNaN(val) ? 0 : val,
                  });
                }}
              />
              <input
                type="number"
                className="border rounded w-full p-2 mt-2"
                placeholder="Longitude"
                value={newOverride.longitude}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setNewOverride({
                    ...newOverride,
                    longitude: isNaN(val) ? 0 : val,
                  });
                }}
              />
            </div>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center"
              onClick={handleCreateOrUpdate}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <span className="animate-spin h-5 w-5 border-t-2 border-white rounded-full" />
                  <span>Saving...</span>
                </div>
              ) : editingItem ? (
                "Update"
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </Dialog>

      {/* Coordinate Override Confirmation Dialog */}
      {showConfirmation && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmation-heading"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 id="confirmation-heading" className="text-lg font-bold mb-4">
              Are you sure?
            </h3>
            <p className="mb-2">Coordinates: {coordinates}</p>
            <p className="mb-4">Address: {address}</p>
            <button
              onClick={handleCoordSubmit}
              className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition mr-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="animate-spin inline-block w-5 h-5 border-4 border-white border-t-transparent rounded-full"></span>
              ) : (
                "Confirm"
              )}
            </button>
            <button
              onClick={() => setShowConfirmation(false)}
              className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverridesPage;

/*
      Add Override Button 
      <button
        onClick={() => {
          setNewOverride({ address: "", latitude: 0, longitude: 0 });
          setEditingItem(null);
          setShowModal(true);
        }}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Add Override
      </button>
*/
