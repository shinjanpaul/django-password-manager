import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-slate-800 flex justify-between items-center px-4 md:px-8 h-10 text-white fixed top-0 left-0 w-full z-20">
      {}
      <div className="font-bold text-xl md:text-2xl">
        <span className="text-green-700">&lt;</span>
        Pass
        <span className="text-green-700">manager/&gt;</span>
      </div>

      {}
      <a href="#" className="flex items-center gap-2 text-white px-3 py-2 rounded hover:bg-slate-700 transition">
        <lord-icon
          src="https://cdn.lordicon.com/lllcnxva.json"
          trigger="hover"
          style={{ width: "24px", height: "24px" }}
        ></lord-icon>
        <h3 className="text-white">Github</h3>
      </a>
    </nav>
  );
};

export default Navbar;
