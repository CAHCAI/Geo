import React, { useEffect, useState } from "react";
import {
  listOverrides,
  createOverride,
  deleteOverride,
  updateOverride,
  uploadXlsx,
} from "@/lib/utils";
import { OverrideLocationIn, OverrideLocationOut } from "@/lib/utils";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";

const OverridesPage: React.FC = () => {
  const [overrides, setOverrides] = useState<OverrideLocationOut[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Add/Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<OverrideLocationOut | null>(null);
  const [newOverride, setNewOverride] = useState<OverrideLocationIn>({
    address: "",
    latitude: 0,
    longitude: 0,
  });

  // Delete Confirmation
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  useEffect(() => {
    fetchOverrides();
  }, []);

  const fetchOverrides = async () => {
    setIsLoading(true);
    try {
      const data = await listOverrides();
      // Sort so the highest ID (most recently changed/created) is first
      data.sort((a, b) => b.id - a.id);
      setOverrides(data);
    } catch (error) {
      console.error("Error fetching overrides:", error);
    }
    setIsLoading(false);
  };

  const handleCreateOrUpdate = async () => {
    setIsLoading(true);
    try {
      if (editingItem) {
        await updateOverride(editingItem.id, newOverride);
      } else {
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setIsLoading(true);
      try {
        const response = await uploadXlsx(file);
        alert(response.message);
        fetchOverrides();
      } catch (error) {
        console.error("Error uploading XLSX:", error);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-semibold text-gray-800">Manual Overrides</h1>

      {/* File Upload */}
      <div className="mt-4">
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileUpload}
          className="file:border file:border-gray-300 file:rounded-lg file:px-4 file:py-2 file:bg-gray-200 file:text-gray-700 file:cursor-pointer"
        />
      </div>

      {/* Add Override Button */}
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

      {/* Overrides List */}
      <div className="mt-6 w-full max-w-3xl space-y-2">
        {isLoading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          overrides.map((override) => (
            <motion.div
              key={override.id}
              className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center"
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
      <Dialog open={deleteItemId !== null} onClose={() => setDeleteItemId(null)}>
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Dialog.Title className="text-lg font-medium">Confirm Deletion</Dialog.Title>
            <Dialog.Description className="text-sm text-gray-600 mt-2">
              Are you sure you want to delete this override entry? (You must click "Delete"
              below to confirm.)
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
                    <span className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></span>
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

      {/* Add/Edit Modal */}
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
                onChange={(e) => setNewOverride({ ...newOverride, address: e.target.value })}
              />
              <input
                type="number"
                className="border rounded w-full p-2 mt-2"
                placeholder="Latitude"
                value={newOverride.latitude}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setNewOverride({ ...newOverride, latitude: isNaN(val) ? 0 : val });
                }}
              />
              <input
                type="number"
                className="border rounded w-full p-2 mt-2"
                placeholder="Longitude"
                value={newOverride.longitude}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setNewOverride({ ...newOverride, longitude: isNaN(val) ? 0 : val });
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
                  <span className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></span>
                  <span>Saving...</span>
                </div>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default OverridesPage;


/*
      <section
        className="bg-gray-50 rounded-lg shadow-lg p-6 mb-6 mt-10"
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
            onClick={handleSubmit}
            className={`px-6 py-3 bg-orange-500 text-white font-bold rounded-lg shadow-md transition ${
              isSubmitting ? "" : "hover:bg-orange-600"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </section>

      {showConfirmation && (
        // Modal confirmation dialog
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
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
              onClick={confirmSubmit}
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

*/