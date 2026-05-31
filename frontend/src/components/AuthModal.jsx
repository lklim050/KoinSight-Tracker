import { useState } from "react";
import { loginUser, signupUser } from "../services/authApi.js";
import { X } from "lucide-react";

function AuthModal({ showAuthModal, setShowAuthModal, onLogin }) {
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
      } else {
        data = await signupUser(formData);
        setMessage(data.message);
        setFormData({ username: "", email: "", password: "" });
      }

      if (data.success === false) {
        setMessage(data.message);
        return;
      }

      if (isLogin) {
        setShowAuthModal(false);
      }

      // Store token and user data in localStorage for session persistence
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(data.user);
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
          bg-white/10
          backdrop-blur-xl
          border
          border-white/20
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
          {isLogin ? "Login" : "Create Account"}
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

              ${isLogin ? "text-green-500 underline" : "text-gray-400"}
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

              ${!isLogin ? "text-green-500 underline" : "text-gray-400"}
            `}
          >
            Sign Up
          </button>
        </div>

        {/* FORM */}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              !isLogin ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
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
                bg-white/10
                border
                border-white/20
                text-white
                outline-none
                focus:bg-white/15
                focus:border-white/40
                placeholder-gray-500
              "
            />
          </div>

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
              bg-white/10
              border
              border-white/20
              text-white
              outline-none
              focus:bg-white/15
              focus:border-white/40
              placeholder-gray-500
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
              bg-white/10
              border
              border-white/20
              text-white
              outline-none
              focus:bg-white/15
              focus:border-white/40
              placeholder-gray-500
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
              bg-green-500
              hover:bg-green-600
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
