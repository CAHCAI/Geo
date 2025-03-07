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
    <>
      {/* 1. Skip Link for Keyboard Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white p-2 rounded"
      >
        Skip to main content
      </a>

      <header className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          API Documentation
        </h1>
      </header>

      <main id="main-content" className="container mx-auto p-6" tabIndex={-1}>
        {/* 2. Loading Message with Screen Reader Announcement */}
        {loading ? (
          <p className="text-gray-600" aria-live="polite">
            Loading API documentation...
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Swagger UI */}
            {apiDocsUrl && (
              <section
                aria-labelledby="swagger-heading"
                className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-50"
              >
                <h2
                  id="swagger-heading"
                  className="text-lg font-semibold text-gray-900"
                >
                  Swagger UI
                </h2>
                <p className="text-gray-700">
                  Interactive API documentation for testing endpoints.
                </p>
                <a
                  href={apiDocsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline focus:underline focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 inline-block"
                >
                  Open Swagger UI API documentation
                </a>
              </section>
            )}

            {/* OpenAPI JSON */}
            {openApiJsonUrl && (
              <section
                aria-labelledby="openapi-heading"
                className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-50"
              >
                <h2
                  id="openapi-heading"
                  className="text-lg font-semibold text-gray-900"
                >
                  OpenAPI JSON
                </h2>
                <p className="text-gray-700">
                  If you need to generate client libraries or explore the raw
                  API specification, you can access the OpenAPI JSON.
                </p>
                <a
                  href={openApiJsonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline focus:underline focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 inline-block"
                >
                  Open OpenAPI JSON specification
                </a>
              </section>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default APIReference;
