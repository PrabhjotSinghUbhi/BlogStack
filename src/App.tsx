import React from "react";
import config from "./config/config";

function App() {
  console.log(typeof config.appwriteBucketId);

  return (
    <div className="min-h-screen text-7xl grid place-content-center font-extrabold min-w-screen bg-[#333] text-white">
      Let's make BlogStack.
    </div>
  );
}

export default App;
