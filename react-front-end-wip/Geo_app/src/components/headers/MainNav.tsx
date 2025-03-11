const MainNav = () => {
  return (
    <div className="bg-blue-800 w-full">
      <div className=" flex items-center w-full max-w-screen-xl mx-auto">
        <div className="flex justify-between text-white text-base font-bold w-full items-center ">
          <a
            href="https://hcai.ca.gov/facilities/building-safety/"
            className=" grow text-center hover:bg-blue-900 transition duration-300 py-5"
          >
            Building Safety & Finance
          </a>
          <a
            href="https://hcai.ca.gov/workforce/financial-assistance/"
            className="grow text-center hover:bg-blue-900 transition duration-300 py-5"
          >
            Loan Repayments, Scholarships & Grants
          </a>
          <a
            href="https://hcai.ca.gov/workforce/health-workforce/"
            className="grow text-center hover:bg-blue-900 transition duration-300 py-5"
          >
            Workforce Capacity
          </a>
          <a
            href="https://hcai.ca.gov/data/"
            className=" grow text-center hover:bg-blue-900 transition duration-300 py-5"
          >
            Data & Reports
          </a>
          <a
            href="https://hcai.ca.gov/facility-finder/"
            className="grow text-center hover:bg-blue-900 transition duration-300 py-5"
          >
            Facility Finder
          </a>
        </div>
      </div>
    </div>
  );
};

export default MainNav;
