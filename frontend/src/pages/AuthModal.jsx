import { useState } from "react";
import { loginUser, signupUser } from "../services/authApi.js";
import { X } from "lucide-react";

function AuthModal({ showAuthModal, setShowAuthModal }) {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      let data;

      if (isLogin) {
        data = await loginUser({
          email: formData.email,
          password: formData.password,
        });

        console.log("Login successful:", data);
      } else {
        data = await signupUser(formData);
        setMessage(data.message);
        setFormData({
          username: "",
          email: "",
          password: "",
        });
      }

      if (data.success === false) {
        setMessage(data.message);
        return;
      }

      if (isLogin) {
        setShowAuthModal(false);
      }

      if (data.token) {
        localStorage.setItem(
          "token",

          data.token,
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!showAuthModal) return null;

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/60
        flex
        justify-center
        items-center
        z-50
      "
    >
      <div
        className="
          bg-[#111827]
          w-full
          max-w-md
          rounded-2xl
          p-8
          relative
          shadow-2xl
        "
      >
        <button
          onClick={() => setShowAuthModal(false)}
          className="
            absolute
            top-4
            right-4
            text-gray-400
            hover:text-white
            cursor-pointer
          "
        >
          <X size={24} />
        </button>

        <h1
          className="
            text-white
            text-3xl
            font-bold
            mb-6
            text-center
          "
        >
          {isLogin ? "Registered User" : "Create Account"}
        </h1>

        <div
          className="
            flex
            justify-center
            gap-8
            mb-8
          "
        >
          <button
            onClick={() => {
              setIsLogin(true);
              setMessage("");
            }}
            className={`
              text-lg
              font-semibold
              cursor-pointer
              transition

              ${isLogin ? "text-purple-400" : "text-gray-400"}
            `}
          >
            Log In
          </button>

          <button
            onClick={() => {
              setIsLogin(false);
              setMessage("");
            }}
            className={`
              text-lg
              font-semibold
              cursor-pointer
              transition

              ${!isLogin ? "text-purple-400" : "text-gray-400"}
            `}
          >
            Sign Up
          </button>
        </div>

        {/* FORM */}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="
                w-full
                p-3
                rounded-lg
                bg-gray-800
                text-white
                outline-none
              "
            />
          )}

          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="
              w-full
              p-3
              rounded-lg
              bg-gray-800
              text-white
              outline-none
            "
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="
              w-full
              p-3
              rounded-lg
              bg-gray-800
              text-white
              outline-none
            "
          />
          {message && (
            <p
              className="
        text-red-400
        text-sm
        mb-4
        text-center
      "
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="
              w-full
              bg-purple-600
              hover:bg-purple-700
              text-white
              p-3
              rounded-lg
              transition
              cursor-pointer
            "
          >
            {isLogin ? "Log In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
