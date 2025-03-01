"use client";

import React, { useEffect, useState } from "react";

const APIReference: React.FC = () => {
  const [apiDocsUrl, setApiDocsUrl] = useState<string | null>(null);
  const [openApiJsonUrl, setOpenApiJsonUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamically determine API documentation URLs based on frontend's current origin
    const baseUrl = window.location.origin.replace(":5173", ":8000"); // Adjust port to match backend
    setApiDocsUrl(`${baseUrl}/api/docs`);
    setOpenApiJsonUrl(`${baseUrl}/api/openapi.json`);
    setLoading(false);
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">API Documentation</h1>

      {loading ? (
        <p className="text-gray-600">Loading API documentation...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Swagger UI */}
          {apiDocsUrl && (
            <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-50">
              <h3 className="text-lg font-semibold">Swagger UI</h3>
              <p className="text-gray-600">Interactive API documentation for testing endpoints.</p>
              <a 
                href={apiDocsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                View Swagger UI →
              </a>
            </div>
          )}

          {/* OpenAPI JSON */}
          {openApiJsonUrl && (
            <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-50">
              <h3 className="text-lg font-semibold">OpenAPI JSON</h3>
              <p className="text-gray-600">
                If you need to generate client libraries or explore the raw API specification, you can access the OpenAPI JSON.
              </p>
              <a 
                href={openApiJsonUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                View OpenAPI JSON →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default APIReference;
