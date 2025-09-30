function Footer() {
  return (
    <footer className="flex items-start justify-around px-40 py-[40px] bg-[#350800] text-white">
      {/* Left Section */}
      <div className="text-left max-w-2/3">
        <h3 className="font-bold text-lg mb-2">Wildcats MarketPlace</h3>
        <p className="text-md text-justify leading-relaxed">
            Wildcats Marketplace is a web-based application developed as a final project 
            for CSIT321: Software Development. The platform serves as a simulation of 
            what an online marketplace for students could look like—providing buying, 
            selling, and sharing features within a campus-focused community.
        </p>
        <p className="text-sm text-gray-300 mt-4">
            © 2025 Wildcats Marketplace. All rights reserved.
        </p>
      </div>


      {/* Right Section */}
      <div className="flex flex-col justify-center max-w-1/3">
        <h3 className="font-bold text-lg mb-2">Team Algorhythym</h3>
        <ul className="flex flex-col items-start justify-center pl-4 text-md list-disc">
            <li>John Lyster Tan Arbiol</li>
            <li>Rene John Sitoy</li>
            <li>Amiel Joshua Peñaflor</li>
            <li>John Clyde Perez</li>
            <li>Sol Angelo Singson</li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
