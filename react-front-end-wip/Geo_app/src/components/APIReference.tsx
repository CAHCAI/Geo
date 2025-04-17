"use client";

import React, { useState, useEffect, useRef } from "react";

const sections = [
  {
    id: "geocode",
    label: "Geocode",
    subsections: [
      { id: "parameters", label: "Parameters" },
      { id: "response", label: "Response" },
    ],
  },
  {
    id: "gethpsdesignations",
    label: "GetHPSDesignations",
    subsections: [
      { id: "hps-parameters", label: "Parameters" },
      { id: "hps-response", label: "Response" },
    ],
  },
  {
    id: "testcache",
    label: "TestCache",
    subsections: [
      { id: "testcache-parameters", label: "Parameters" },
      { id: "testcache-response", label: "Response" },
    ],
  },
  {
    id: "listtables",
    label: "ListTables",
    subsections: [
      { id: "listtables-parameters", label: "Parameters" },
      { id: "listtables-response", label: "Response" },
    ],
  },
  {
    id: "alldistrictdata",
    label: "AllDistrictData",
    subsections: [
      { id: "alldistrictdata-parameters", label: "Parameters" },
      { id: "alldistrictdata-response", label: "Response" },
    ],
  },
  {
    id: "testapi",
    label: "Test",
    subsections: [
      { id: "testapi-parameters", label: "Parameters" },
      { id: "testapi-response", label: "Response" },
    ],
  },
  {
    id: "devcredentials",
    label: "DevCredentials",
    subsections: [
      { id: "devcredentials-parameters", label: "Parameters" },
      { id: "devcredentials-response", label: "Response" },
    ],
  },
  {
    id: "overridelocations",
    label: "OverrideLocations",
    subsections: [
      { id: "overridelocations-parameters", label: "Parameters" },
      { id: "overridelocations-response", label: "Response" },
    ],
  },
  {
    id: "manualoverrides",
    label: "ManualOverrides",
    subsections: [
      { id: "manualoverrides-parameters", label: "Parameters" },
      { id: "manualoverrides-response", label: "Response" },
    ],
  },
  {
    id: "manualoverridesid",
    label: "ManualOverrides/{override_id}",
    subsections: [
      { id: "manualoverridesid-parameters", label: "Parameters" },
      { id: "manualoverridesid-response", label: "Response" },
    ],
  },
  {
    id: "activesessions",
    label: "ActiveSessions",
    subsections: [
      { id: "activesessions-parameters", label: "Parameters" },
      { id: "activesessions-response", label: "Response" },
    ],
  },
  {
    id: "adminerrors",
    label: "AdminErrors",
    subsections: [
      { id: "adminerrors-parameters", label: "Parameters" },
      { id: "adminerrors-response", label: "Response" },
    ],
  },
  {
    id: "apikeys",
    label: "ApiKeys",
    subsections: [
      { id: "apikeys-parameters", label: "Parameters" },
      { id: "apikeys-response", label: "Response" },
    ],
  },
  {
    id: "servicestatus",
    label: "ServiceStatus",
    subsections: [
      { id: "servicestatus-parameters", label: "Parameters" },
      { id: "servicestatus-response", label: "Response" },
    ],
  }
];

const APIReference: React.FC = () => {
  const [activeSection, setActiveSection] = useState("geocode");
  const contentRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [activeMainSection, setActiveMainSection] = useState<string | null>(
    null
  );
  const [activeSubSection, setActiveSubSection] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true); // Toggle for collapsible sidebar
  const [apiSchema, setApiSchema] = useState<any>(null);
  const [exampleData, setExampleData] = useState<any>(null);
  const [testCacheData, setTestCacheData] = useState<any>(null);
  const [listTablesData, setListTablesData] = useState<any>(null);
  const [allDistrictData, setAllDistrictData] = useState<any>(null);
  const [testapiData, setTestapiData] = useState<any>(null);
  const [devcredentialsData, setDevcredentialsData] = useState<any>(null);
  const [overridelocationsData, setOverridelocationsData] = useState<any>(null);
  const [manualoverridesData, setManualoverridesData] = useState<any>(null);
  const [manualoverridesidData, setManualoverridesidData] = useState<any>(null);
  const [activesessionsData, setActivesessionsData] = useState<any>(null);
  const [adminerrorsData, setAdminerrorsData] = useState<any>(null);
  const [apikeysData, setApikeysData] = useState<any>(null);
  const [servicestatusData, setServicestatusData] = useState<any>(null);

useEffect(() => {
  fetch("/api/openapi.json")
    .then((response) => response.json())
    .then((data) => {
      setApiSchema(data);
    })
    .catch((error) => {
      console.error("Error fetching OpenAPI JSON:", error);
    });
}, []);

// Fetch real example data
useEffect(() => {
  const lat = 34;
  const lng = -118;
  const API_KEY = import.meta.env.VITE_API_KEY;

  fetch(`/api/search?lat=${lat}&lng=${lng}`, {
    headers: {
      "X-API-KEY": API_KEY, 
     },
  })  
    .then((response) => response.json())
    .then((data) => {
      setExampleData(data);
    })
    .catch((error) => {
      console.error("Error fetching example data:", error);
    });
}, []);

useEffect(() => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  fetch("/api/test-cache", {
    headers: {
      "X-API-KEY": API_KEY,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      setTestCacheData(data);
    })
    .catch((error) => {
      console.error("Error fetching test-cache data:", error);
    });
}, []);

useEffect(() => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  fetch("/api/list-tables", {
    headers: {
      "X-API-KEY": API_KEY,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      setListTablesData(data);
    })
    .catch((error) => {
      console.error("Error fetching list-tables data:", error);
    });
}, []);

useEffect(() => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  fetch("/api/all-district-data", {
    headers: {
      "X-API-KEY": API_KEY,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      setAllDistrictData(data);
    })
    .catch((error) => {
      console.error("Error fetching all-district-data:", error);
    });
}, []);

useEffect(() => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  fetch("/api/test", {
    headers: {
      "X-API-KEY": API_KEY,
    },
  })
    .then((res) => res.json())
    .then((data) => setTestapiData(data))
    .catch((err) => console.error("Error fetching /api/test:", err));
}, []);

useEffect(() => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  fetch("/api/dev-credentials", {
    headers: {
      "X-API-KEY": API_KEY,
    },
  })
    .then((res) => res.json())
    .then((data) => setDevcredentialsData(data))
    .catch((err) => console.error("Error fetching /api/dev-credentials:", err));
}, []);

useEffect(() => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  fetch("/api/override-locations", {
    headers: {
      "X-API-KEY": API_KEY,
    },
  })
    .then((res) => res.json())
    .then((data) => setOverridelocationsData(data))
    .catch((err) => console.error("Error fetching /api/override-locations:", err));
}, []);

useEffect(() => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  fetch("/api/manual-overrides", {
    headers: {
      "X-API-KEY": API_KEY,
    },
  })
    .then((res) => res.json())
    .then((data) => setManualoverridesData(data))
    .catch((err) => console.error("Error fetching /api/manual-overrides:", err));
}, []);

useEffect(() => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  fetch("/api/manual-overrides/1", {
    // Example for {override_id} set to 123
    headers: {
      "X-API-KEY": API_KEY,
    },
  })
    .then((res) => res.json())
    .then((data) => setManualoverridesidData(data))
    .catch((err) => console.error("Error fetching /api/manual-overrides/123:", err));
}, []);

useEffect(() => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  fetch("/api/active-sessions", {
    headers: {
      "X-API-KEY": API_KEY,
    },
  })
    .then((res) => res.json())
    .then((data) => setActivesessionsData(data))
    .catch((err) => console.error("Error fetching /api/active-sessions:", err));
}, []);

useEffect(() => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  fetch("/api/admin_errors", {
    headers: {
      "X-API-KEY": API_KEY,
    },
  })
    .then((res) => res.json())
    .then((data) => setAdminerrorsData(data))
    .catch((err) => console.error("Error fetching /api/admin_errors:", err));
}, []);

useEffect(() => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  fetch("/api/api-keys", {
    headers: {
      "X-API-KEY": API_KEY,
    },
  })
    .then((res) => res.json())
    .then((data) => setApikeysData(data))
    .catch((err) => console.error("Error fetching /api/api-keys:", err));
}, []);

useEffect(() => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  fetch("/api/service_status", {
    headers: {
      "X-API-KEY": API_KEY,
    },
  })
    .then((res) => res.json())
    .then((data) => setServicestatusData(data))
    .catch((err) => console.error("Error fetching /api/service_status:", err));
}, []);

  // For quickly finding the main parent of each subsection
  const PARENT_SECTION: Record<string, string> = {
    parameters: "geocode",
    response: "geocode",
    "hps-parameters": "gethpsdesignations",
    "hps-response": "gethpsdesignations",
    "testcache-parameters": "testcache",
    "testcache-response": "testcache",
    "listtables-parameters": "listtables",
    "listtables-response": "listtables",
    "alldistrictdata-parameters": "alldistrictdata",
    "alldistrictdata-response": "alldistrictdata",
    "testapi-parameters": "testapi",
    "testapi-response": "testapi",
    "devcredentials-parameters": "devcredentials",
    "devcredentials-response": "devcredentials",
    "overridelocations-parameters": "overridelocations",
    "overridelocations-response": "overridelocations",
    "manualoverrides-parameters": "manualoverrides",
    "manualoverrides-response": "manualoverrides",
    "manualoverridesid-parameters": "manualoverridesid",
    "manualoverridesid-response": "manualoverridesid",
    "activesessions-parameters": "activesessions",
    "activesessions-response": "activesessions",
    "adminerrors-parameters": "adminerrors",
    "adminerrors-response": "adminerrors",
    "apikeys-parameters": "apikeys",
    "apikeys-response": "apikeys",
    "servicestatus-parameters": "servicestatus",
    "servicestatus-response": "servicestatus",
  };

  // IntersectionObserver highlights the active tab
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targetId = entry.target.id;
            const parentId = PARENT_SECTION[targetId] || targetId;

            if (parentId === targetId) {
              // highlights only the main section (geocode or gethpsdesignations)
              setActiveMainSection(parentId);
              setActiveSubSection(null);
            } else {
              // highlights subsection
              setActiveMainSection(parentId);
              setActiveSubSection(targetId);
            }
          }
        });
      },
      {
        threshold: 0.3,
        root: contentRef.current,
        rootMargin: "-80px 0px 0px 0px",
      }
    );

    Object.values(sectionRefs.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleScrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden p-4">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showSidebar ? "Hide Bar" : "Show Bar"}
        </button>
      </div>

      {/* Sidebar */}
      <nav
        className={`w-full md:w-1/4 bg-gray-100 dark:bg-gray-800 shadow-md p-6 md:sticky md:h-[calc(100vh-8rem)] overflow-y-auto ${
          !showSidebar ? "hidden" : "block"
        } md:block`}
      >
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          API Reference
        </h2>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                className={`block w-full text-left px-4 py-2 rounded-md transition-all ${
                  activeMainSection === section.id
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-700 dark:text-gray-200 dark:hover:text-black  hover:bg-gray-300"
                }`}
                onClick={() => handleScrollTo(section.id)}
              >
                {section.label}
              </button>

              {section.subsections && (
                <ul className="ml-4 mt-2 space-y-1">
                  {section.subsections.map((subsection) => (
                    <li key={subsection.id}>
                      <button
                        className={`block w-full text-left px-3 py-1 rounded-md transition-all ${
                          activeSubSection === subsection.id
                            ? "bg-blue-400 text-white font-semibold"
                            : "text-gray-600 dark:text-gray-200 dark:hover:text-black hover:bg-gray-200"
                        }`}
                        onClick={() => handleScrollTo(subsection.id)}
                      >
                        {subsection.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Content Area */}
      <div
        ref={contentRef}
        className="md:w-3/4 p-6 space-y-12 overflow-y-auto"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        {/* Geocode Section */}
        <section
          id="geocode"
          ref={(el) =>
            (sectionRefs.current["geocode"] = el as HTMLDivElement | null)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
            Geocode & Shortage Designations
          </h2>

          <p className="text-gray-700 dark:text-gray-300">
            Geocode Web service is designed get an address's geographic
            coordinates. This method can also be used to validate and
            standardize an address even if you don't need geographic
            coordinates. This web service is also able to return health
            profession shortage designations of an address that is in
            California.
          </p>

          <p className="text-gray-700 mt-2 dark:text-gray-300">
            Geocode web service takes a full or partial address string and
            returns a matching address sorted by best match in JSON format.
          </p>

          <h3 className="text-xl font-semibold mt-4 dark:text-gray-100">
            BELOW IS AN EXAMPLE WEB SERVICE URL WITH SOME PARAMETERS.
          </h3>
          <code className="block bg-gray-200 p-3 rounded-lg text-sm break-words overflow-x-auto w-full">
            https://geo.hcai.ca.gov/service/geocode?key=YOUR_KEY_HERE&findshortagedesignations=true&address=4081+E+Olympic+Blvd,+Los+Angeles,+CA+90023&calreachdoctype=
          </code>
        </section>

        <section
          id="parameters"
          ref={(el) =>
            (sectionRefs.current["parameters"] = el as HTMLDivElement | null)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Parameters</h2>

          <ul className="space-y-3">
            <li className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm">
              <div className="text-blue-800 font-semibold">key (required)</div>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                An API key must be provided to use this service. The API is for
                HCAI applications only and not open to the public.
              </p>
            </li>

            <li className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm">
              <div className="text-blue-800 font-semibold">
                address (required)
              </div>
              <p className="text-gray-700 mt-1 dark:text-gray-300">
                Input address.
              </p>
            </li>

            <li className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm">
              <div className="text-blue-800 font-semibold">maxlocations</div>
              <p className="text-gray-700 mt-1 dark:text-gray-300">
                Returns the requested number of locations matching the search
                criteria (capped at 10, default is 5).
              </p>
            </li>

            <li className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm">
              <div className="text-blue-800 font-semibold">
                findshortagedesignations
              </div>
              <p className="text-gray-700 mt-1 dark:text-gray-300">
                When set to true, the response will include shortage
                designations for each address returned.
              </p>
            </li>

            <li className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm">
              <div className="text-blue-800 font-semibold">calreachdoctype</div>
              <p className="text-gray-700 mt-1 dark:text-gray-300">
                Given this parameter, the{" "}
                <code className="bg-gray-200 dark:bg-gray-900 px-1 py-0.5 rounded text-sm">
                  in_umn
                </code>
                flag may be determined differently. Currently, the SongBrown
                program may require this flag to be computed differently for
                various programs. For example, an address’s{" "}
                <code className="bg-gray-200 dark:bg-gray-900 px-1 py-0.5 rounded text-sm">
                  in_umn
                </code>
                flag for a Registered Nurse Special Program’s application only
                considers{" "}
                <code className="bg-gray-200 dark:bg-gray-900 px-1 py-0.5 rounded text-sm">
                  rnsa
                </code>
                (Registered Nurse Shortage Area).
              </p>
            </li>
          </ul>
        </section>

        {/* Response Section (Subsection of Geocode) */}
        <section
          id="response"
          ref={(el) =>
            (sectionRefs.current["response"] = el as HTMLDivElement | null)
          }
          className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg"
        >
          <h2 className="text-xl font-bold text-blue-500 mb-2">
            JSON RESPONSE EXAMPLE
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Geocode service may return multiple addresses if a partial address
            was given. Below is an example of that:
          </p>
          <code className="block bg-gray-200 p-3 rounded-lg text-sm break-words overflow-x-auto w-full">
            http://localhost:8000/api/search?lat=${"{lat}"}&lng=${"{lng}"}
          </code>
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto text-sm mt-2">
          {exampleData ? JSON.stringify(exampleData, null, 2) : "Loading example..."}
          </pre>
        </section>
        {/* GetHPSDesignations Section */}
        <section
          id="gethpsdesignations"
          ref={(el) =>
            (sectionRefs.current["gethpsdesignations"] =
              el as HTMLDivElement | null)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
            GetHPSDesignations
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            The GetHPSDesignations service retrieves health professional
            shortage area (HPSA) designations for a given location.
          </p>
          <h3 className="text-xl font-semibold mt-4 dark:text-white">
            Example API Request
          </h3>
          <code className="block bg-gray-200 p-3 rounded-lg text-sm break-words overflow-x-auto w-full">
            http://localhost:8000/api/search?lat=${"{lat}"}&lng=${"{lng}"}
          </code>
        </section>

        {/* Parameters Section (Subsection of GetHPSDesignations) */}
        <section
          id="hps-parameters"
          ref={(el) =>
            (sectionRefs.current["hps-parameters"] =
              el as HTMLDivElement | null)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Parameters</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>key (required):</strong> An API key must be provided to
              use this service. The API is for HCAI applications only and not
              open to the public.
            </li>
            <li>
              <strong>latitude (required):</strong> Latitude of the address that
              you want to find the shortage designations for.
            </li>
            <li>
              <strong>longitude (required):</strong> Longitude of the address
              that you want to find the shortage designations for
            </li>
            <li>
              <strong>calreachdoctype:</strong> Given this parameter, the Area
              of Unmet Need (in_umn) flag may be determined differently.
              Currently SongBrown program may require this flag to be computed
              differently for various programs. For example, an address’s Area
              of Unmet Need flag(in_umn) Registered Nurse Special Program's
              application doesn't care about any other flags other than
              Registered Nurse Shortage Area (rnsa).
              <br />
              <br />
              <strong>Example:</strong> An address's Area of Unmet Need flag (
              <code>in_umn</code>) for the Registered Nurse Special Program's
              application does not consider any other flags except the
              Registered Nurse Shortage Area (<code>rnsa</code>).
            </li>
          </ul>
        </section>

        {/* Response Section (Subsection of GetHPSDesignations) */}
        <section
          id="hps-response"
          ref={(el) =>
            (sectionRefs.current["hps-response"] = el as HTMLDivElement | null)
          }
          className="p-6 bg-white shadow-md rounded-lg dark:bg-gray-800"
        >
          <h2 className="text-xl font-bold text-blue-500 mb-2">
            Response Example
          </h2>
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto text-sm mt-2">
          {exampleData ? JSON.stringify(exampleData, null, 2) : "Loading example..."}
          </pre>
        </section>

        <section
          id="testcache"
          ref={(el) =>
            (sectionRefs.current["testcache"] = el as HTMLDivElement | null)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">TestCache</h2>
          <p className="text-gray-700 dark:text-gray-300">
            This endpoint demonstrates testing a caching mechanism.
          </p>
          <h3 className="text-xl font-semibold mt-4 dark:text-white">
            Example API Request
          </h3>
          <code className="block bg-gray-200 p-3 rounded-lg text-sm break-words overflow-x-auto w-full">
            http://localhost:8000/api/test-cache
          </code>
        </section>

        <section
          id="testcache-parameters"
          ref={(el) =>
            (sectionRefs.current["testcache-parameters"] =
              el as HTMLDivElement | null)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Parameters</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>key (required):</strong> An API key must be provided to
              use this service.
            </li>
          </ul>
        </section>

        <section
          id="testcache-response"
          ref={(el) =>
            (sectionRefs.current["testcache-response"] =
              el as HTMLDivElement | null)
          }
          className="p-6 bg-white shadow-md rounded-lg dark:bg-gray-800"
        >
          <h2 className="text-xl font-bold text-blue-500 mb-2">Response</h2>
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto text-sm mt-2">
{testCacheData ? JSON.stringify(testCacheData, null, 2) : "Loading TestCache data..."}
          </pre>
        </section>

        <section
          id="listtables"
          ref={(el) =>
            (sectionRefs.current["listtables"] = el as HTMLDivElement | null)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">ListTables</h2>
          <p className="text-gray-700 dark:text-gray-300">
            This endpoint provides a list of tables from the data source.
          </p>
          <h3 className="text-xl font-semibold mt-4 dark:text-white">
            Example API Request
          </h3>
          <code className="block bg-gray-200 p-3 rounded-lg text-sm break-words overflow-x-auto w-full">
            http://localhost:8000/api/list-tables
          </code>
        </section>

        <section
          id="listtables-parameters"
          ref={(el) =>
            (sectionRefs.current["listtables-parameters"] =
              el as HTMLDivElement | null)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Parameters</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>key (required):</strong> An API key must be provided to
              use this service.
            </li>
          </ul>
        </section>

        <section
          id="listtables-response"
          ref={(el) =>
            (sectionRefs.current["listtables-response"] =
              el as HTMLDivElement | null)
          }
          className="p-6 bg-white shadow-md rounded-lg dark:bg-gray-800"
        >
          <h2 className="text-xl font-bold text-blue-500 mb-2">Response</h2>
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto text-sm mt-2">
          {listTablesData ? JSON.stringify(listTablesData, null, 2) : "Loading ListTables data..."}
          </pre>
        </section>

        <section
          id="alldistrictdata"
          ref={(el) =>
            (sectionRefs.current["alldistrictdata"] =
              el as HTMLDivElement | null)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
            AllDistrictData
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            This endpoint returns all district-level data.
          </p>
          <h3 className="text-xl font-semibold mt-4 dark:text-white">
            Example API Request
          </h3>
          <code className="block bg-gray-200 p-3 rounded-lg text-sm break-words overflow-x-auto w-full">
            http://localhost:8000/api/all-district-data
          </code>
        </section>

        <section
          id="alldistrictdata-parameters"
          ref={(el) =>
            (sectionRefs.current["alldistrictdata-parameters"] =
              el as HTMLDivElement | null)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Parameters</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>key (required):</strong> An API key must be provided to
              use this service.
            </li>
          </ul>
        </section>

        <section
          id="alldistrictdata-response"
          ref={(el) =>
            (sectionRefs.current["alldistrictdata-response"] =
              el as HTMLDivElement | null)
          }
          className="p-6 bg-white shadow-md rounded-lg dark:bg-gray-800"
        >
          <h2 className="text-xl font-bold text-blue-500 mb-2">Response</h2>
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto text-sm mt-2">
          {allDistrictData ? JSON.stringify(allDistrictData, null, 2) : "Loading AllDistrictData..."}
          </pre>
        </section>

        <section
          id="testapi"
          ref={(el) => (sectionRefs.current["testapi"] = el)}
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Test</h2>
          <p className="text-gray-700 dark:text-gray-300">
            This endpoint illustrates a simple test call.
          </p>
          <h3 className="text-xl font-semibold mt-4 dark:text-white">
            Example API Request
          </h3>
          <code className="block bg-gray-200 p-3 rounded-lg text-sm break-words overflow-x-auto w-full">
            http://localhost:8000/api/test
          </code>
        </section>

        <section
          id="testapi-parameters"
          ref={(el) => (sectionRefs.current["testapi-parameters"] = el)}
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Parameters</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>key (required):</strong> API key for internal usage.
            </li>
          </ul>
        </section>

        <section
          id="testapi-response"
          ref={(el) => (sectionRefs.current["testapi-response"] = el)}
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-xl font-bold text-blue-500 mb-2">Response</h2>
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto text-sm mt-2">
{testapiData ? JSON.stringify(testapiData, null, 2) : "Loading Test API data..."}
          </pre>
        </section>

        <section
          id="devcredentials"
          ref={(el) => (sectionRefs.current["devcredentials"] = el)}
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
            DevCredentials
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            This endpoint retrieves developer credentials for internal usage.
          </p>
          <h3 className="text-xl font-semibold mt-4 dark:text-white">
            Example API Request
          </h3>
          <code className="block bg-gray-200 p-3 rounded-lg text-sm break-words overflow-x-auto w-full">
            http://localhost:8000/api/dev-credentials
          </code>
        </section>

        <section
          id="devcredentials-parameters"
          ref={(el) =>
            (sectionRefs.current["devcredentials-parameters"] = el)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Parameters</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>key (required):</strong> API key for internal usage.
            </li>
          </ul>
        </section>

        <section
          id="devcredentials-response"
          ref={(el) =>
            (sectionRefs.current["devcredentials-response"] = el)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-xl font-bold text-blue-500 mb-2">Response</h2>
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto text-sm mt-2">
{devcredentialsData ? JSON.stringify(devcredentialsData, null, 2) : "Loading DevCredentials data..."}
          </pre>
        </section>

        <section
          id="overridelocations"
          ref={(el) => (sectionRefs.current["overridelocations"] = el)}
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
            OverrideLocations
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            This endpoint retrieves override location data.
          </p>
          <h3 className="text-xl font-semibold mt-4 dark:text-white">
            Example API Request
          </h3>
          <code className="block bg-gray-200 p-3 rounded-lg text-sm break-words overflow-x-auto w-full">
            http://localhost:8000/api/override-locations
          </code>
        </section>

        <section
          id="overridelocations-parameters"
          ref={(el) =>
            (sectionRefs.current["overridelocations-parameters"] = el)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Parameters</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>key (required):</strong> API key for internal usage.
            </li>
          </ul>
        </section>

        <section
          id="overridelocations-response"
          ref={(el) =>
            (sectionRefs.current["overridelocations-response"] = el)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-xl font-bold text-blue-500 mb-2">Response</h2>
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto text-sm mt-2">
{overridelocationsData ? JSON.stringify(overridelocationsData, null, 2) : "Loading OverrideLocations data..."}
          </pre>
        </section>

        <section
          id="manualoverrides"
          ref={(el) => (sectionRefs.current["manualoverrides"] = el)}
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
            ManualOverrides
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            This endpoint retrieves all manual overrides.
          </p>
          <h3 className="text-xl font-semibold mt-4 dark:text-white">
            Example API Request
          </h3>
          <code className="block bg-gray-200 p-3 rounded-lg text-sm break-words overflow-x-auto w-full">
            http://localhost:8000/api/manual-overrides
          </code>
        </section>

        <section
          id="manualoverrides-parameters"
          ref={(el) =>
            (sectionRefs.current["manualoverrides-parameters"] = el)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Parameters</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>key (required):</strong> API key for internal usage.
            </li>
          </ul>
        </section>

        <section
          id="manualoverrides-response"
          ref={(el) =>
            (sectionRefs.current["manualoverrides-response"] = el)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-xl font-bold text-blue-500 mb-2">Response</h2>
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto text-sm mt-2">
{manualoverridesData ? JSON.stringify(manualoverridesData, null, 2) : "Loading ManualOverrides data..."}
          </pre>
        </section>

        <section
          id="manualoverridesid"
          ref={(el) => (sectionRefs.current["manualoverridesid"] = el)}
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
            ManualOverrides/{`{override_id}`}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            This endpoint retrieves a single manual override by ID.
          </p>
          <h3 className="text-xl font-semibold mt-4 dark:text-white">
            Example API Request
          </h3>
          <code className="block bg-gray-200 p-3 rounded-lg text-sm break-words overflow-x-auto w-full">
            http://localhost:8000/api/manual-overrides/123
          </code>
        </section>

        <section
          id="manualoverridesid-parameters"
          ref={(el) =>
            (sectionRefs.current["manualoverridesid-parameters"] = el)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Parameters</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>override_id (required):</strong> The ID to fetch.
            </li>
            <li>
              <strong>key (required):</strong> API key for internal usage.
            </li>
          </ul>
        </section>

        <section
          id="manualoverridesid-response"
          ref={(el) =>
            (sectionRefs.current["manualoverridesid-response"] = el)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-xl font-bold text-blue-500 mb-2">Response</h2>
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto text-sm mt-2">
{manualoverridesidData ? JSON.stringify(manualoverridesidData, null, 2) : "Loading ManualOverrides/{override_id} data..."}
          </pre>
        </section>

        <section
          id="activesessions"
          ref={(el) => (sectionRefs.current["activesessions"] = el)}
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
            ActiveSessions
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            This endpoint retrieves all active sessions.
          </p>
          <h3 className="text-xl font-semibold mt-4 dark:text-white">
            Example API Request
          </h3>
          <code className="block bg-gray-200 p-3 rounded-lg text-sm break-words overflow-x-auto w-full">
            http://localhost:8000/api/active-sessions
          </code>
        </section>

        <section
          id="activesessions-parameters"
          ref={(el) =>
            (sectionRefs.current["activesessions-parameters"] = el)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Parameters</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>key (required):</strong> API key for internal usage.
            </li>
          </ul>
        </section>

        <section
          id="activesessions-response"
          ref={(el) =>
            (sectionRefs.current["activesessions-response"] = el)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-xl font-bold text-blue-500 mb-2">Response</h2>
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto text-sm mt-2">
{activesessionsData ? JSON.stringify(activesessionsData, null, 2) : "Loading ActiveSessions data..."}
          </pre>
        </section>

        <section
          id="adminerrors"
          ref={(el) => (sectionRefs.current["adminerrors"] = el)}
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">AdminErrors</h2>
          <p className="text-gray-700 dark:text-gray-300">
            This endpoint retrieves error logs for administrators.
          </p>
          <h3 className="text-xl font-semibold mt-4 dark:text-white">
            Example API Request
          </h3>
          <code className="block bg-gray-200 p-3 rounded-lg text-sm break-words overflow-x-auto w-full">
            http://localhost:8000/api/admin_errors
          </code>
        </section>

        <section
          id="adminerrors-parameters"
          ref={(el) => (sectionRefs.current["adminerrors-parameters"] = el)}
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Parameters</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>key (required):</strong> API key for internal usage.
            </li>
          </ul>
        </section>

        <section
          id="adminerrors-response"
          ref={(el) => (sectionRefs.current["adminerrors-response"] = el)}
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-xl font-bold text-blue-500 mb-2">Response</h2>
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto text-sm mt-2">
{adminerrorsData ? JSON.stringify(adminerrorsData, null, 2) : "Loading AdminErrors data..."}
          </pre>
        </section>

        <section
          id="apikeys"
          ref={(el) => (sectionRefs.current["apikeys"] = el)}
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">ApiKeys</h2>
          <p className="text-gray-700 dark:text-gray-300">
            This endpoint retrieves a list of existing API keys.
          </p>
          <h3 className="text-xl font-semibold mt-4 dark:text-white">
            Example API Request
          </h3>
          <code className="block bg-gray-200 p-3 rounded-lg text-sm break-words overflow-x-auto w-full">
            http://localhost:8000/api/api-keys
          </code>
        </section>

        <section
          id="apikeys-parameters"
          ref={(el) => (sectionRefs.current["apikeys-parameters"] = el)}
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Parameters</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>key (required):</strong> API key for internal usage.
            </li>
          </ul>
        </section>

        <section
          id="apikeys-response"
          ref={(el) => (sectionRefs.current["apikeys-response"] = el)}
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-xl font-bold text-blue-500 mb-2">Response</h2>
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto text-sm mt-2">
          {`[
  {
    "key": "a8943nj9wuwhc98whin23989823nc399578hubc73478hf982hbx932bx87xb2x",
    "app_name": "Googleee",
    "usage_count": 5
  }
]`}
          </pre>
        </section>

        <section
          id="servicestatus"
          ref={(el) => (sectionRefs.current["servicestatus"] = el)}
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
            ServiceStatus
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            This endpoint returns the current status of the service.
          </p>
          <h3 className="text-xl font-semibold mt-4 dark:text-white">
            Example API Request
          </h3>
          <code className="block bg-gray-200 p-3 rounded-lg text-sm break-words overflow-x-auto w-full">
            http://localhost:8000/api/service_status
          </code>
        </section>

        <section
          id="servicestatus-parameters"
          ref={(el) =>
            (sectionRefs.current["servicestatus-parameters"] = el)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Parameters</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>key (required):</strong> API key for internal usage.
            </li>
          </ul>
        </section>

        <section
          id="servicestatus-response"
          ref={(el) =>
            (sectionRefs.current["servicestatus-response"] = el)
          }
          className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg"
        >
          <h2 className="text-xl font-bold text-blue-500 mb-2">Response</h2>
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto text-sm mt-2">
{servicestatusData ? JSON.stringify(servicestatusData, null, 2) : "Loading ServiceStatus data..."}
          </pre>
        </section>

      </div>
      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Back to Top
      </button>
    </div>
  );
};

export default APIReference;
