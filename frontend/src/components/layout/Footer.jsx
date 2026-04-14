import React from "react";

const Footer = ({ totalResponses = 0 }) => {
  return (
    <div className="text-center mt-8 pb-6">
      <p className="text-sm text-muted-foreground">
        {totalResponses > 0 ? (
          <>📚 The library currently has <strong>{totalResponses}</strong> response codes ready to use.</>
        ) : (
          <>The library is empty. Let's add your first response!</>
        )}
      </p>
    </div>
  );
};

export default Footer;