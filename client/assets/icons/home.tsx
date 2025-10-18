import React from "react";

const Home = ({ fill }: { fill: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
    >
      <path
        fill={fill}
        d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
      />
    </svg>
  );
};

export default Home;
