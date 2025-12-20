import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-red-300 min-h-screen">{children}</div>;
};

export default AuthLayout;
