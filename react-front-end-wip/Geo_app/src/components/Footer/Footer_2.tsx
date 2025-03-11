import GeoLogo from "@/assets/logo-color.svg";
import { ChevronRight } from "lucide-react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const Footer_2 = () => {
  return (
    <div className="max-w-screen-xl mx-auto pb-20">
      {/* ========== top section start here==========  */}
      <div className="py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-sm text-gray-800">
          {/* Services */}
          <div>
            <h3 className="font-bold text-blue-900 mb-3">Services</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://hcai.ca.gov/data/submit-data/"
                  className="hover:underline text-blue-900"
                >
                  Submit Data
                </a>
              </li>
              <li>
                <a
                  href="https://hcai.ca.gov/workforce/financial-assistance/loan-repayment/"
                  className="hover:underline text-blue-900"
                >
                  Loan Repayment Programs
                </a>
              </li>
              <li>
                <a
                  href="https://hcai.ca.gov/workforce/financial-assistance/scholarships/"
                  className="hover:underline text-blue-900"
                >
                  Scholarships
                </a>
              </li>
              <li>
                <a
                  href="https://hcai.ca.gov/workforce/financial-assistance/grants/"
                  className="hover:underline text-blue-900"
                >
                  Grants for Organizations
                </a>
              </li>
              <li>
                <a
                  href="https://hcai.ca.gov/hearing-office/"
                  className="hover:underline text-blue-900"
                >
                  Penalty Appeals
                </a>
              </li>
            </ul>
          </div>

          {/* Data Submissions */}
          <div>
            <h3 className="font-bold text-blue-900 mb-3">Data Submissions</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://hcai.ca.gov/data/submit-data/patient-data/"
                  className="hover:underline text-blue-900"
                >
                  Patient-Level Administrative Data
                </a>
              </li>
              <li>
                <a
                  href="https://hcai.ca.gov/data/submit-data/facility-utilization-data/"
                  className="hover:underline text-blue-900"
                >
                  Health Facility Utilizations
                </a>
              </li>
              <li>
                <a
                  href="https://hcai.ca.gov/data/submit-data/financial-reporting/"
                  className="hover:underline text-blue-900"
                >
                  Hospital & LTC Financials
                </a>
              </li>
              <li>
                <a
                  href="https://hcai.ca.gov/data/submit-data/coronary-artery-bypass-grafts/"
                  className="hover:underline text-blue-900"
                >
                  Coronary Artery Bypass Graft Surgeries
                </a>
              </li>
              <li>
                <a
                  href="https://hcai.ca.gov/data/cost-transparency/hospital-fair-pricing-policies"
                  className="hover:underline text-blue-900"
                >
                  Healthcare Financial Assistance Policies
                </a>
              </li>
              <li>
                <a
                  href="https://hcai.ca.gov/data/cost-transparency/hospital-chargemasters/"
                  className="hover:underline text-blue-900"
                >
                  Hospital Chargemasters
                </a>
              </li>
            </ul>
          </div>

          {/* CA Healthcare Infrastructure */}
          <div>
            <h3 className="font-bold text-blue-900 mb-3">
              CA Healthcare Infrastructure
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://hcai.ca.gov/facility-finder/"
                  className="hover:underline text-blue-900"
                >
                  All Facilities
                </a>
              </li>
              <li>
                <a
                  href="https://hcai.ca.gov/facilities/building-safety/facility-detail/"
                  className="hover:underline text-blue-900"
                >
                  Healthcare Facility Detail
                </a>
              </li>
              <li>
                <a
                  href="https://hcai.ca.gov/facilities/building-safety/seismic-compliance-and-safety/"
                  className="hover:underline text-blue-900"
                >
                  Seismic Compliance and Safety
                </a>
              </li>
              <li>
                <a
                  href="https://hcai.ca.gov/data/cost-transparency/hospital-community-benefit-plans/"
                  className="hover:underline text-blue-900"
                >
                  Hospital Community Benefit Plans
                </a>
              </li>
              <li>
                <a
                  href="https://hcai.ca.gov/workforce/health-workforce/california-primary-care-office/"
                  className="hover:underline text-blue-900"
                >
                  California Primary Care Office
                </a>
              </li>
            </ul>
          </div>

          {/* Public Transparency */}
          <div>
            <h3 className="font-bold text-blue-900 mb-3">
              Public Transparency
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://hcai.ca.gov/public-meetings/"
                  className="hover:underline text-blue-900"
                >
                  Public Meetings
                </a>
              </li>
              <li>
                <a
                  href="https://hcai.ca.gov/home/public-transparency/public-records/"
                  className="hover:underline text-blue-900"
                >
                  Public Records
                </a>
              </li>
              <li>
                <a
                  href="https://hcai.ca.gov/home/public-transparency/form-801/"
                  className="hover:underline text-blue-900"
                >
                  Payment to Agency Reports
                </a>
              </li>
            </ul>
          </div>

          {/* About HCAI */}
          <div>
            <h3 className="font-bold text-blue-900 mb-3">About HCAI</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://hcai.ca.gov/media-center/"
                  className="hover:underline text-blue-900"
                >
                  Newsroom
                </a>
              </li>
              <li>
                <a
                  href="https://hcai.ca.gov/about/programs/"
                  className="hover:underline text-blue-900"
                >
                  Divisions
                </a>
              </li>
              <li>
                <a
                  href="https://hcai.ca.gov/about/laws-regulations/"
                  className="hover:underline text-blue-900"
                >
                  Laws & Regulations
                </a>
              </li>
              <li>
                <a
                  href="https://hcai.ca.gov/public-meetings/"
                  className="hover:underline text-blue-900"
                >
                  Public Meetings
                </a>
              </li>
              <li>
                <a
                  href="https://hcai.ca.gov/about/careers/"
                  className="hover:underline text-blue-900"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="https://hcai.ca.gov/about/contact-us/"
                  className="hover:underline text-blue-900"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* ========== top section end here==========  */}
      {/* ========== bottom section start here==========  */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between justify-center gap-5">
          <a href="/" className="sm:w-full">
            <img
              src={GeoLogo}
              alt="Geo Logo"
              className="h-8 sm:h-10 object-contain"
            />
          </a>
          <p className="sm:hidden block text-base">
            © Copyright 2021 State of California
          </p>
          <div className="sm:block hidden h-[1px] bg-gray-400 w-full"></div>
          <div>
            <a
              href="https://geo.hcai.ca.gov/mailing-list/"
              className="bg-white flex items-center text-sm font-bold border px-6 py-4 hover:text-blue-900 hover:underline transition-all border-orange-600 cursor-pointer"
              style={{
                boxShadow: "-5px -5px 0px 5px rgba(225,243,253,1)",
              }}
            >
              SUBSCRIBE
              <ChevronRight size={18} className="text-orange-700" />
            </a>
          </div>
          <div className="sm:block hidden h-[1px] bg-gray-400 w-full"></div>
        </div>

        <div className="flex items-center gap-10 justify-between">
          <p className="sm:block hidden text-base">
            © Copyright 2021 State of California
          </p>
          <ul className="flex items-center flex-wrap gap-3 text-sm">
            <a
              href="https://www.covid19.ca.gov/"
              className="group flex flex-col text-blue-900 hover:text-blue-700"
            >
              <span>COVID-19 Updates</span>
              <span className="w-0 h-[1px] group-hover:w-full group-hover:bg-blue-900 transition-all duration-200 ease-linear"></span>
            </a>
            <a
              href="https://registertovote.ca.gov/"
              className="group flex flex-col text-blue-900 hover:text-blue-700"
            >
              <span>Register to Vote</span>
              <span className="w-0 h-[1px] group-hover:w-full group-hover:bg-blue-900 transition-all duration-200 ease-linear"></span>
            </a>
            <a
              href="https://hcai.ca.gov/home/privacy-policy/"
              className="group flex flex-col text-blue-900 hover:text-blue-700"
            >
              <span>Privacy</span>
              <span className="w-0 h-[1px] group-hover:w-full group-hover:bg-blue-900 transition-all duration-200 ease-linear"></span>
            </a>
            <a
              href="https://hcai.ca.gov/home/accessibility/"
              className="group flex flex-col text-blue-900 hover:text-blue-700"
            >
              <span>Accessibility</span>
              <span className="w-0 h-[1px] group-hover:w-full group-hover:bg-blue-900 transition-all duration-200 ease-linear"></span>
            </a>
            <a
              href="https://hcai.ca.gov/home/conditions-of-use/"
              className="group flex flex-col text-blue-900 hover:text-blue-700"
            >
              <span>Conditions of Use</span>
              <span className="w-0 h-[1px] group-hover:w-full group-hover:bg-blue-900 transition-all duration-200 ease-linear"></span>
            </a>
            <a
              href="https://hcai.ca.gov/about/contact-us/"
              className="group flex flex-col text-blue-900 hover:text-blue-700"
            >
              <span>Contact Us</span>
              <span className="w-0 h-[1px] group-hover:w-full group-hover:bg-blue-900 transition-all duration-200 ease-linear"></span>
            </a>
          </ul>
        </div>
        {/* social icons */}
        <div className="flex sm:justify-end justify-center">
          <ul className="flex items-center gap-4 text-blue-900">
            <a
              href="https://www.facebook.com/CaliforniaHCAI"
              className="border p-3 rounded-full border-blue-200 hover:border-blue-900 transition-all duration-200 ease-linear bg-white"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://x.com/CA_HCAI"
              className="border p-3 rounded-full border-blue-200 hover:border-blue-900 transition-all duration-200 ease-linear bg-white"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://www.linkedin.com/company/department-of-health-care-access-and-information/"
              className="border p-3 rounded-full border-blue-200 hover:border-blue-900 transition-all duration-200 ease-linear bg-white"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://www.youtube.com/channel/UCWZlucPkJlQa8bvmf39SRqw"
              className="border p-3 rounded-full border-blue-200 hover:border-blue-900 transition-all duration-200 ease-linear bg-white"
            >
              <FaYoutube />
            </a>
          </ul>
        </div>
      </div>
      {/* ========== bottom section end here==========  */}
    </div>
  );
};

export default Footer_2;
