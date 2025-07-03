import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState("");

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (!acceptedTerms) {
      setTermsError("Please accept terms and conditions.");
      return;
    } else {
      setTermsError("");
    }

    if (currState === "sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    login(currState === "sign up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen gap-8 bg-center bg-cover sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* left */}
      <img src={assets.logo_big} className="w-[min(30vw,250px)]" alt="" />
      {/* right */}
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-6 p-6 text-white border-2 border-gray-500 rounded-lg shadow-lg bg-white/10 felx-col">
        <h2 className="flex items-center justify-between text-2xl font-medium">
          {currState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt="arrow icon"
              className="w-5 cursor-pointer"
            />
          )}
        </h2>
        {currState === "sign up" && !isDataSubmitted && (
          <input
            type="text"
            className="p-2 bg-transparent border border-gray-500 rounded-md focus:outline-none"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        )}
        {!isDataSubmitted && (
          <>
            <input
              type="email"
              className="p-2 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Email Address"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              type="password"
              className="p-2 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        )}
        {currState === "sign up" && isDataSubmitted && (
          <textarea
            rows={4}
            className="p-2 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Provide a short bio"
            onChange={(e) => setBio(e.target.value)}
            required
            value={bio}></textarea>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input
            type="checkbox"
            name=""
            id=""
            checked={acceptedTerms}
            onChange={() => setAcceptedTerms((prev) => !prev)}
          />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        {termsError && (
          <p className="mb-2 -mt-4 text-xs text-red-500">{termsError}</p>
        )}

        <button
          type="submit"
          className="py-3 text-white rounded-md cursor-pointer bg-gradient-to-r from-purple-400 to-violet-600">
          {currState === "sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex flex-col gap-2">
          {currState === "sign up" ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span
                className="cursor-pointer text-violet-500"
                onClick={() => {
                  setCurrState("login");
                  setIsDataSubmitted(false);
                }}>
                Login Here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create an account?{" "}
              <span
                className="cursor-pointer text-violet-500"
                onClick={() => {
                  setCurrState("sign up");
                }}>
                Sign Up
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
