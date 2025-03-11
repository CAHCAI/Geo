import { ChevronRight } from "lucide-react";

const MobileNav = () => {
  return (
    <div className="lg:hidden max-w-screen-xl mx-auto flex flex-col items-center justify-center">
      {/* ========== top nav items start here ========= */}
      <div className="py-5 px-3">
        <ul className=" flex flex-wrap items-center gap-5 text-sm ">
          <li className=" group cursor-pointer hover:text-blue-500 text-blue-900 transition-all duration-200 ease-linear">
            <p className="py-2">Newsroom</p>
            <div className="w-0 group-hover:w-full transition-all duration-200 ease-linear h-[.1rem] bg-blue-500 opacity-0  group-hover:opacity-100"></div>
          </li>
          <li className=" group cursor-pointer hover:text-blue-500 text-blue-900 transition-all duration-200 ease-linear">
            <p className="py-2">Public Meetings</p>
            <div className="w-0 group-hover:w-full transition-all duration-200 ease-linear h-[.1rem] bg-blue-500 opacity-0  group-hover:opacity-100"></div>
          </li>
          <li className=" group cursor-pointer hover:text-blue-500 text-blue-900 transition-all duration-200 ease-linear">
            <p className="py-2">About HCAI</p>
            <div className="w-0 group-hover:w-full transition-all duration-200 ease-linear h-[.1rem] bg-blue-500 opacity-0  group-hover:opacity-100"></div>
          </li>
          <li className=" group cursor-pointer hover:text-blue-500 text-blue-900 transition-all duration-200 ease-linear">
            <p className="py-2">Newsroom</p>
            <div className="w-0 group-hover:w-full transition-all duration-200 ease-linear h-[.1rem] bg-blue-500 opacity-0  group-hover:opacity-100"></div>
          </li>

          <li className=" border rounded-3xl px-3 py-1 font-bold text-blue-700 border-blue-600 cursor-pointer hover:bg-blue-600 hover:text-white transition-all duration-200 ease-linear">
            LOG IN
          </li>
        </ul>
      </div>
      {/* ========== top nav items end here ========= */}
      {/* ========== top clopse section start here ========= */}
      <div className=" bg-blue-800 w-full py-5 px-3">
        <div className="flex flex-col text-white text-base w-full ">
          <a
            href="https://hcai.ca.gov/facilities/building-safety/"
            className=" flex justify-between items-center px-5  hover:bg-blue-900 transition duration-300 py-5"
          >
            Building Safety & Finance <ChevronRight />
          </a>
          <a
            href="https://hcai.ca.gov/workforce/financial-assistance/"
            className=" flex justify-between items-center px-5  hover:bg-blue-900 transition duration-300 py-5"
          >
            Loan Repayments, Scholarships & Grants <ChevronRight />
          </a>
          <a
            href="https://hcai.ca.gov/workforce/health-workforce/"
            className=" flex justify-between items-center px-5  hover:bg-blue-900 transition duration-300 py-5"
          >
            Workforce Capacity <ChevronRight />
          </a>
          <a
            href="https://hcai.ca.gov/data/"
            className=" flex justify-between items-center px-5  hover:bg-blue-900 transition duration-300 py-5"
          >
            Data & Reports <ChevronRight />
          </a>
          <a
            href="https://hcai.ca.gov/facility-finder/"
            className=" flex justify-between items-center px-5  hover:bg-blue-900 transition duration-300 py-5"
          >
            Facility Finder <ChevronRight />
          </a>
        </div>
        <div className=" border-t border-white">
          <h2 className=" text-[44px]  text-white !font-normal ml-8">Geo</h2>
        </div>
      </div>
      {/* ========== top colaps section  end here ========= */}
      <div></div>
    </div>
  );
};

export default MobileNav;
