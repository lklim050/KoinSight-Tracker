import { useState } from "react";

import { X } from "lucide-react";

function AuthModal({ showAuthModal, setShowAuthModal }) {
  const [isLogin, setIsLogin] = useState(true);

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
            onClick={() => setIsLogin(true)}
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
            onClick={() => setIsLogin(false)}
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

        <form className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
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
            className="
              w-full
              p-3
              rounded-lg
              bg-gray-800
              text-white
              outline-none
            "
          />

          <button
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
