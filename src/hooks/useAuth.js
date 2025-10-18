// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Obtener usuario inicial si ya está logueado
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });

    // Escucha cambios en la sesión
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        if (router.pathname !== "/login") router.push("/login");
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  return user;
}
