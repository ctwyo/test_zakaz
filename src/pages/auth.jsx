"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // для редиректа
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import Script from "next/script";

const AuthPage = () => {
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const router = useRouter();
  // const { setUser } = useContext(UserContext);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        // ✅ 1. Проверяем локальное хранилище
        if (accessToken) {
          const res = await fetch("/api/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const userData = await res.json();

          if (res.ok) {
            // setUser(userData);
            router.push("/");
            return;
          }
        }

        // ✅ 2. Пробуем обновить accessToken через refreshToken
        const refreshRes = await fetch("/api/refresh", {
          method: "POST",
          credentials: "include",
        });
        const refreshData = await refreshRes.json();

        if (refreshData.accessToken) {
          localStorage.setItem("accessToken", refreshData.accessToken);
          router.push("/");
          return;
        }

        // ✅ 3. Если токенов нет — запрашиваем данные из Telegram
        if (!window.Telegram || !window.Telegram.WebApp) {
          setAccessDenied(true);
          return;
        }

        const initData = window.Telegram.WebApp.initData;
        if (!initData) {
          setAccessDenied(true);
          return;
        }

        // ✅ 4. Последний вариант — запрос к MongoDB
        const verifyRes = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData }),
        });

        const result = await verifyRes.json();
        if (result.success) {
          localStorage.setItem("accessToken", result.accessToken);
          router.push("/");
        } else {
          setAccessDenied(true);
        }
      } catch {
        setAccessDenied(true);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js?56"
        strategy="beforeInteractive"
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Paper
          sx={{
            padding: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : accessDenied ? (
            <Typography variant="h6" color="error">
              ❌ Доступ запрещён
            </Typography>
          ) : (
            <Typography variant="h6">🔄 Перенаправление...</Typography>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default AuthPage;
