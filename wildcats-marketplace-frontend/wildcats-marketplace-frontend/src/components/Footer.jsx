function Footer() {
  return (
    <footer className="mt-auto bg-[#350800] text-white py-8">
      <div className="container px-6 mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          {/* Left Section */}
          <div className="flex-1 max-w-2xl">
            <h3 className="mb-3 text-lg font-bold">Wildcats MarketPlace</h3>
            <p className="text-sm leading-relaxed text-justify text-gray-300">
              Wildcats Marketplace is a web-based application developed as a final project 
              for CSIT321: Software Development. The platform serves as a simulation of 
              what an online marketplace for students could look like—providing buying, 
              selling, and sharing features within a campus-focused community.
            </p>
            <p className="mt-4 text-xs text-gray-400">
              © 2025 Wildcats Marketplace. All rights reserved.
            </p>
          </div>

          {/* Right Section */}
          <div className="shrink-0">
            <h3 className="mb-3 text-lg font-bold">Team Algorhythym</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>John Lyster Tan Arbiol</li>
              <li>Rene John Sitoy</li>
              <li>Amiel Joshua Peñaflor</li>
              <li>John Clyde Perez</li>
              <li>Sol Angelo Singson</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;