import React, { useState } from "react";
import Login from "./login";
import Register from "./register";
import BgWhiteBorder from "../../components/custom/bgWhiteBoder";

const AuthPage: React.FC = () => {
    const [mode, setMode] = useState<"login" | "register">("login");

    return (
        <div className="login-auth-page">
            <BgWhiteBorder >
                {mode === "login" ? (
                    <Login
                        router = "admin"
                        onClose={() => console.log("Login success")}
                        onRegister={() => setMode("register")}
                    />
                ) : (
                    <Register
                        onRegisterSuccess={() => setMode("login")}
                        onBackToLogin={() => setMode("login")}
                    />
                )}
            </BgWhiteBorder>
        </div>
    );
};

export default AuthPage;