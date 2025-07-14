import { logOut } from "../../features/authSlice";
import authService from "../../appwrite/auth/auth";
import { useDispatch } from "react-redux";

function LogOutButton() {
  const dispatch = useDispatch();

  const handleLogOut = () => {
    authService.authLogOut().then(() => dispatch(logOut()));
  };

  return (
    <div>
      <button
        onClick={handleLogOut}
        className="p-3 m-2 bg-cyan-500 cursor-pointer text-black font-bold"
      >
        LogOut
      </button>
    </div>
  );
}

export default LogOutButton;
