import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import authService from "./appwrite/auth/auth";
import { login, logOut } from "./features/authSlice";
import { Outlet } from "react-router-dom";
import { Footer, Header } from "./components";

function App() {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch the current user from Appwrite
    authService
      .authGetCurrentUser()
      .then((userData) => {
        if (userData) {
          console.log("Hey Prabhjot this is the userDate from authCurrentUser", userData);
          dispatch(login(userData.$id));
        } else {
          dispatch(logOut());
        }
      })
      .catch((err) => {
        console.error("hey Prabhjot Singh -> Error fetching current user:", err);
        throw err;
      })
      .finally(() => setLoading(false));
  }, []);

  return !loading ? (
    <div className="min-h-screen flex flex-wrap content-between bg-[#333]">
      <div className="w-full block">
        <Header />
        <main>
          <Outlet />
          {/* <span className="text-5xl text-white">TODO.</span> */}
        </main>
        <Footer />
      </div>
    </div>
  ) : (
    <div className="min-h-screen min-w-screen grid place-content-center bg-[#333] text-white font-extrabold text-7xl">
      Loading.....
    </div>
  );
}

export default App;
