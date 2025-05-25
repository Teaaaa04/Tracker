// GoogleLogin.js
import { supabase } from "../supabaseClient";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleLogin = () => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error("Error al iniciar sesión con Google:", error.message);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Guardar el userId (puedes usar el id o email del usuario de Supabase)
        navigate("/categories");
      }
    };

    checkSession();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>
      <button
        className="bg-red-500 text-white p-4 rounded-lg shadow-sm"
        onClick={signInWithGoogle}
      >
        Iniciar sesión con Google
      </button>
    </div>
  );
};

export default GoogleLogin;
