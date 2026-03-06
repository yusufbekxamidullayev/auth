import React from "react";
import AppRouter from "./router/AppRouter";
import useTokenRefresh from "./hooks/useTokenRefresh";

// Token auto-refresh wrapper
const AppContent = () => {
  useTokenRefresh(); // Har 15 minutda token yangilaydi
  return <AppRouter />;
};

const App = () => {
  return <AppContent />;
};

export default App;
