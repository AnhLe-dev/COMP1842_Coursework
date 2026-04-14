import React from "react";

const Header = () => {
  return (
    <div className="space-y-2 text-center">
      {/* Main Title */}
      <h1 className="text-4xl font-bold text-transparent bg-primary bg-clip-text">
        Helpdesk Library
      </h1>

      {/* Description line below */}
      <p className="text-muted-foreground">
        Customer support response management and lookup system 🚀
      </p>
    </div>
  );
};

export default Header; // Using export default to match HomePage.jsx