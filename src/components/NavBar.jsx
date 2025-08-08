import { NavLink } from "react-router-dom";
import { setDoc, uploadFile, listDocs, signOut } from "@junobuild/core";
import { useDarkMode } from "../providers/DarkModeProvider";
import { motion } from "framer-motion";

import { AuthContext } from "../Auth";
import { useContext, useEffect, useState } from "react";
import { Login } from "../Login";
import { Button } from "../Details/Button";
import UploadImage from "../Details/UploadImage";

import gemIcon from "../Media/gem.png";

const NavBar = () => {
  const { user } = useContext(AuthContext);
  const darkModeContext = useDarkMode();
  const { darkMode, toggleDarkMode } = darkModeContext || { darkMode: false, toggleDarkMode: () => {} };

  const [file, setFile] = useState(null);

  const [userInfo, setUserInfo] = useState({
    email: "",
    username: "",
    profile_pic: "",
    isValidator: false,
    job_count: 0,
    total_gems: 0,
    current_gems: 0,
  });

  useEffect(() => {
    checkUserRegistrationStatus();
    // document.getElementById("onboardingModal").showModal();
  }, [user]);

  const checkUserRegistrationStatus = async () => {
    if ([null, undefined].includes(user)) {
      return;
    }

    const userData = await listDocs({
      collection: "users",
    });

    const filteredData = userData.items.find((data) => data.key === user.key);

    // If user data found
    if (!filteredData) {
      console.log("New user found");
      document.getElementById("onboardingModal").showModal();
    } else {
      console.log("Existing user found");
      setUserInfo(filteredData);
    }
  };

  const addNewUser = async () => {
    console.log("Adding User");
    try {
      await setDoc({
        collection: "users",
        doc: {
          key: user.key,
          data: userInfo,
        },
      });
      console.log("User added");
      document.getElementById("onboardingModal").close();
    } catch (error) {
      console.error("Error adding users:", error);
    }
  };

  const uploadProfilePic = async () => {
    try {
      const filename = `${user.key}-${file.name}`;

      const url = await uploadFile({
        collection: "images",
        data: file,
        filename,
      });
      console.log("Uploaded Profile pic", url);
      setUserInfo({ ...userInfo, profile_pic: url.downloadUrl });
      setFile(null);
    } catch (error) {
      console.log("Error uploading profile image", error);
    }
  };

  const handleImageUpload = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    if (file) {
      uploadProfilePic();
    }
  }, [file]);

  const textChange = (e) => {
    const name = e.target.id;
    let value = e.target.value;
    setUserInfo((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  return (
    <nav className="fixed top-0 z-50 flex w-full flex-row items-center justify-between border-b border-[#404040] bg-[#1e1e1e] px-8 py-2">
      <section className="flex flex-row items-center gap-4">
        <NavLink
          to="/"
          className="relative px-1 text-3xl font-bold hover:translate-y-[-1px]"
        >
          <motion.span
            className="logo-text"
            style={{
              background: 'linear-gradient(90deg, #4169E1 0%, #4C85FB 50%, #F58853 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.6, -0.05, 0.01, 0.99],
            }}
          >
            LexiForge
          </motion.span>
        </NavLink>
        <p className="text-3xl font-thin text-[#d4d4d4]">|</p>
        <div className="flex gap-4">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) =>
              `relative px-6 py-2 overflow-hidden rounded-lg group ${
                isActive 
                  ? 'bg-gradient-to-r from-[#4169E1] to-[#4C85FB] text-white'
                  : 'bg-[#333333] text-[#d4d4d4] hover:text-white'
              }`
            }
          >
            <span className="relative z-10 flex items-center gap-2 font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Dashboard
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-r from-[#4169E1] via-[#4C85FB] to-[#F58853]" />
          </NavLink>

          <NavLink
            to="/marketplace"
            className={({ isActive }) =>
              `relative px-6 py-2 overflow-hidden rounded-lg group ${
                isActive 
                  ? 'bg-gradient-to-r from-[#F58853] to-[#4C85FB] text-white'
                  : 'bg-[#333333] text-[#d4d4d4] hover:text-white'
              }`
            }
          >
            <span className="relative z-10 flex items-center gap-2 font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Marketplace
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-r from-[#F58853] via-purple-400 to-[#4C85FB]" />
          </NavLink>
        </div>
        <button
          onClick={toggleDarkMode}
          className="btn btn-circle bg-[#333333] border-[#404040] hover:bg-[#3c3c3c] text-[#d4d4d4]"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </section>

      <div className="flex flex-row items-center gap-4">
        {user !== undefined && user !== null ? (
          <details className="dropdown dropdown-end">
            <summary className="btn m-1 px-2 font-medium bg-[#333333] border-[#404040] hover:bg-[#3c3c3c] text-[#d4d4d4]">
              <img
                src={userInfo.profile_pic ? userInfo.profile_pic : gemIcon}
                alt="profile photo"
                className="mr-1 h-8 w-8 rounded-full bg-[#252526]"
              />
              <p>Wallet: {user && user.key.slice(-8)}</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <ul className="menu dropdown-content z-[1] w-52 rounded-box bg-[#333333] border border-[#404040] p-2 shadow-lg">
              <li>
                <a className="text-[#d4d4d4] hover:bg-[#3c3c3c]">Settings</a>
              </li>
              <li>
                <button
                  onClick={signOut}
                  className="text-[#d4d4d4] hover:bg-[#3c3c3c]"
                >
                  Disconnect
                </button>
              </li>
            </ul>
          </details>
        ) : (
          <Login />
        )}
      </div>

      <dialog id="onboardingModal" className="modal">
        <div className="modal-box bg-[#2d2d2d] text-[#d4d4d4] border border-[#404040]">
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold">
              👋 Welcome,
              <span className="rounded-lg bg-[#333333] px-3 ml-2">
                {user && user.key.slice(-8)}
              </span>
            </h3>
            <p className="pb-2 text-sm text-[#a0a0a0]">
              Tell us more about yourself
            </p>
            <div
              className="tooltip tooltip-right tooltip-open"
              data-tip="Upload Picture"
            >
              <label htmlFor="profile_pic" style={{ cursor: "pointer" }}>
                <UploadImage
                  src={userInfo.profile_pic ? userInfo.profile_pic : gemIcon}
                  alt="Profile photo"
                />
              </label>
            </div>
            <form className="flex flex-col">
              <input
                type="file"
                id="profile_pic"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              <input
                id="username"
                placeholder="Username"
                type="text"
                value={userInfo.userName}
                onChange={textChange}
                className="input m-2 border-2 border-minerDark"
              />
              <input
                id="email"
                placeholder="Email address"
                type="email"
                autoComplete="email"
                value={userInfo.email}
                onChange={textChange}
                className="input m-2 border-2 border-inspectorDark"
              />
              <button
                onClick={addNewUser}
                className="btn border-0 bg-creatorLight hover:translate-y-[-1px] hover:bg-green-300"
              >
                Save details
              </button>
            </form>
          </div>
          <div className="modal-action flex flex-row items-center">
            <p className="text-xs text-[#a0a0a0]">
              You can update these details later on{" "}
              <span className="font-bold">Settings</span>
            </p>
            <form method="dialog">
              <button className="btn bg-[#333333] hover:translate-x-1 hover:animate-pulse hover:bg-[#3c3c3c]">
                Skip
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </nav>
  );
};

export default NavBar;
