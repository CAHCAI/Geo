"use client";

import React, { useState, useEffect, useRef } from "react";

const sections = [
  { id: "geocode", label: "Geocode", subsections: [
      { id: "parameters", label: "Parameters" },
      { id: "response", label: "Response" }
    ]
  },
  { id: "gethpsdesignations", label: "GetHPSDesignations", subsections: [
      { id: "hps-parameters", label: "Parameters" },
      { id: "hps-response", label: "Response" }
    ]
  },
];

const APIReference: React.FC = () => {
  const [activeSection, setActiveSection] = useState("geocode");
  const contentRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [activeMainSection, setActiveMainSection] = useState<string | null>(null);
  const [activeSubSection, setActiveSubSection] = useState<string | null>(null);


  useEffect(() => {
    fetch("/api/openapi.json")
      .then((response) => response.json())
      .then((data) => {
        console.log("OpenAPI JSON:", data);
      })
      .catch((error) => {
        console.error("Error fetching OpenAPI JSON:", error);
      });
  }, []);

 // For quickly finding the main parent of each subsection
  const PARENT_SECTION: Record<string, string> = {
    "parameters": "geocode",
    "response": "geocode",
    "hps-parameters": "gethpsdesignations",
    "hps-response": "gethpsdesignations",
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
            //highlights only the main section(geocode or hpsearch)
            setActiveMainSection(parentId);
            setActiveSubSection(null); 
          } else {
            //highlights subsection
            setActiveMainSection(parentId);
            setActiveSubSection(targetId);
          }
        }
      });
    },
      {
        threshold: 0.3,
        root: contentRef.current,
        rootMargin: "-80px 0px 0px 0px"
      }
    );

    Object.values(sectionRefs.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  
  const handleScrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <nav className="fixed left-0 z-50 top-25 sm:top-60 w-45 h-[calc(100vh-7rem)] sm:h-[calc(100vh-8rem)] overflow-y-auto p-6 bg-gray-100 shadow-md">
        <h2 className="text-xl font-bold mb-4">API Reference</h2>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  className={`block w-full text-left px-4 py-2 rounded-md transition-all ${
                  activeMainSection === section.id
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => handleScrollTo(section.id)}
                  >
                  {section.label}
                  </button>

        {section.subsections && (
          <ul className="ml-4 mt-2 space-y-1">
            {section.subsections.map((subsection) => (
              <li key={subsection.id}>
                {/* Highlight subsection if activeSubSection === this subsection's ID */}
                <button
                  className={`block w-full text-left px-3 py-1 rounded-md transition-all ${
                    activeSubSection === subsection.id
                      ? "bg-blue-400 text-white font-semibold"
                      : "text-gray-600 hover:bg-gray-200"
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
        className="ml-64 mt-28 sm:mt-32 w-[calc(100%-12rem)] p-6 space-y-12 overflow-y-auto h-[calc(100vh-7rem)] sm:h-[calc(100vh-10rem)]"
      >
        {/* Geocode Section */}
        <section
  id="geocode"
  ref={(el) => (sectionRefs.current["geocode"] = el as HTMLDivElement | null)}
  className="p-6 bg-white shadow-md rounded-lg"
>
  <h2 className="text-2xl font-bold text-blue-600 mb-2">Geocode & Shortage Designations</h2>

  <p className="text-gray-700">
    Geocode Web service is designed get an address's geographic coordinates.
    This method can also be used to validate and standardize an address even if
    you don't need geographic coordinates. This web service is also able to
    return health profession shortage designations of an address that is in
    California.
  </p>

  <p className="text-gray-700 mt-2">
    Geocode web service takes a full or partial address string and returns 
    a matching address sorted by best match in JSON format.
  </p>

  <h3 className="text-xl font-semibold mt-4">BELOW IS AN EXAMPLE WEB SERVICE URL WITH SOME PARAMETERS.</h3>
  <code className="block bg-gray-200 p-3 rounded-lg text-sm break-words overflow-x-auto w-full">
  https://geo.hcai.ca.gov/service/geocode?key=YOUR_KEY_HERE&findshortagedesignations=true&address=4081+E+Olympic+Blvd,+Los+Angeles,+CA+90023&calreachdoctype=
  </code>
</section>

        {/* Parameters Section (Subsection of Geocode) */}
        <section
  id="parameters"
  ref={(el) => (sectionRefs.current["parameters"] = el as HTMLDivElement | null)}
  className="p-6 bg-white shadow-md rounded-lg"
>
  <h2 className="text-2xl font-bold text-blue-600 mb-4">Parameters</h2>

  <ul className="space-y-3">
    {/* KEY */}
    <li className="p-3 bg-gray-50 rounded-md shadow-sm">
      <div className="text-blue-800 font-semibold">key (required)</div>
      <p className="text-gray-700 mt-1">
        An API key must be provided to use this service. The API is for HCAI
        applications only and not open to the public.
      </p>
    </li>

    {/* ADDRESS */}
    <li className="p-3 bg-gray-50 rounded-md shadow-sm">
      <div className="text-blue-800 font-semibold">address (required)</div>
      <p className="text-gray-700 mt-1">
        Input address.
      </p>
    </li>

    {/* MAXLOCATIONS */}
    <li className="p-3 bg-gray-50 rounded-md shadow-sm">
      <div className="text-blue-800 font-semibold">maxlocations</div>
      <p className="text-gray-700 mt-1">
        Returns the requested number of locations matching the search criteria
        (capped at 10, default is 5).
      </p>
    </li>

    {/* FINDSHORTAGEDESIGNATIONS */}
    <li className="p-3 bg-gray-50 rounded-md shadow-sm">
      <div className="text-blue-800 font-semibold">findshortagedesignations</div>
      <p className="text-gray-700 mt-1">
        When set to true, the response will include shortage designations
        for each address returned.
      </p>
    </li>

    {/* CALREACHDOCTYPE */}
    <li className="p-3 bg-gray-50 rounded-md shadow-sm">
      <div className="text-blue-800 font-semibold">calreachdoctype</div>
      <p className="text-gray-700 mt-1">
        Given this parameter, the <code className="bg-gray-200 px-1 py-0.5 rounded text-sm">in_umn</code> 
        flag may be determined differently. Currently, the SongBrown program may 
        require this flag to be computed differently for various programs. For example, 
        an address’s <code className="bg-gray-200 px-1 py-0.5 rounded text-sm">in_umn</code> 
        flag for a Registered Nurse Special Program’s application only considers 
        <code className="bg-gray-200 px-1 py-0.5 rounded text-sm">rnsa</code> 
        (Registered Nurse Shortage Area).
      </p>
    </li>
  </ul>
</section>



        {/* Response Section (Subsection of Geocode) */}
        <section
  id="response"
  ref={(el) => (sectionRefs.current["response"] = el as HTMLDivElement | null)} 
  className="p-6 bg-white shadow-md rounded-lg"
>
  <h2 className="text-xl font-bold text-blue-500 mb-2">JSON RESPONSE EXAMPLE</h2>
  <p className="text-gray-700">
    Geocode service may return multiple addresses if a partial address was given. Below is an example of that:
  </p>
  <code className="block bg-gray-200 p-3 rounded-lg text-sm break-words overflow-x-auto w-full">
    http://localhost:8000/api/search?lat=${"{lat}"}&lng=${"{lng}"}
  </code>
  <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto text-sm mt-2">
{`{
  "senate": [
    {
      "district_number": 30,
      "district_label": "30|0.32%",
      "population": 991239
    }
  ],
  "assembly": [
    {
      "district_number": 56,
      "district_label": "56|-0.18%",
      "population": 493173
    }
  ],
  "congressional": [
    {
      "district_number": 38,
      "district_label": "38|-0%",
      "population": 760065
    }
  ]
}`}
  </pre>

  {/* Additional Failure Example */}
  <div className="mt-6">
    <p className="text-gray-700">
      Geocode service may not be able to find an address matching the input. Below is an example of how that is handled and reported:
    </p>
    <code className="block bg-gray-200 p-3 rounded-lg text-sm break-words overflow-x-auto w-full">
      https://geo.hcai.ca.gov/service/geocode?key=YOUR_KEY_HERE&address=400+wrong+Street+sacramento+ca
    </code>
    <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto text-sm mt-2">
{`{
  "response": "failed",
  "reason": "Address not found"
}`}
    </pre>
  </div>
</section>


        {/* GetHPSDesignations Section */}
        <section
          id="gethpsdesignations"
          ref={(el) => (sectionRefs.current["gethpsdesignations"] = el as HTMLDivElement | null)}
          className="p-6 bg-white shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">GetHPSDesignations</h2>
          <p className="text-gray-700">
            The GetHPSDesignations service retrieves health professional shortage area (HPSA) designations for a given location.
          </p>
          <h3 className="text-xl font-semibold mt-4">Example API Request</h3>
          <code className="block bg-gray-200 p-3 rounded-lg text-sm break-words overflow-x-auto w-full">
            http://localhost:8000/api/search?lat=${"{lat}"}&lng=${"{lng}"}
          </code>
        </section>

        {/* Parameters Section (Subsection of GetHPSDesignations) */}
<section
  id="hps-parameters"
  ref={(el) => (sectionRefs.current["hps-parameters"] = el as HTMLDivElement | null)}
  className="p-6 bg-white shadow-md rounded-lg"
>
  <h2 className="text-2xl font-bold text-blue-600 mb-2">Parameters</h2>
  <ul className="list-disc ml-6 space-y-2 text-gray-700">
    <li>
      <strong>key (required):</strong> 
      An API key must be provided to use this service. The API is for HCAI applications only and not open to the public.
    </li>
    <li>
      <strong>latitude (required):</strong> 
      Latitude of the address that you want to find the shortage designations for.
    </li>
    <li>
      <strong>longitude (required):</strong> 
      Longitude of the address that you want to find the shortage designations for </li>
    <li>
      <strong>calreachdoctype:</strong> 
      Given this parameter, the Area of Unmet Need (in_umn) flag may be determined differently. Currently SongBrown program may require this flag to be computed differently for various programs. For Example, An address's Area of Unmet Need flag(in_umn) Registered Nurse Special Program's application doesn't care about any other flags other than Registered Nurse Shortage Area (rnsa).
 <br />
      <br />
      <strong>Example:</strong>  
      An address's Area of Unmet Need flag (<code>in_umn</code>) for the Registered Nurse Special Program's application 
      does not consider any other flags except the Registered Nurse Shortage Area (<code>rnsa</code>).
    </li>
  </ul>
</section>


        {/* Response Section (Subsection of GetHPSDesignations) */}
        <section
          id="hps-response"
          ref={(el) => (sectionRefs.current["hps-response"] = el as HTMLDivElement | null)}
          className="p-6 bg-white shadow-md rounded-lg"
        >
          <h2 className="text-xl font-bold text-blue-500 mb-2">Response Example</h2>
          <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto text-sm">
        {`{
      "senate": [
        {
          "district_number": 30,
          "district_label": "30|0.32%",
          "population": 991239
        }
      ],
      "assembly": [
      {
          "district_number": 56,
          "district_label": "56|-0.18%",
          "population": 493173
      }
      ],
      "congressional": [
    {
          "district_number": 38,
          "district_label": "38|-0%",
          "population": 760065
    }
  ]
}`}
  </pre>
        </section>  
      </div>
    </div>
  );
};

export default APIReference;
