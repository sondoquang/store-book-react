import { fetchAccount } from "@services/accountService";
import { refreshToken } from "@services/authService";
import { createContext, useContext, useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [carts, setCarts] = useState(null);

  useEffect(() => {
    const getAccount = async () => {
      try {
        const response = await fetchAccount();
        if (response.data) {
          setUser(response.data);
          setIsAuthenticated(true);
        } else {
          const res = await refreshToken();
          if (res && res.data) {
            setUser(res.data.userLogin);
            setIsAuthenticated(true);
            localStorage.setItem("accessToken", res.data.accessToken);
          } else {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("accessToken");
          }
        }
      } catch (e) {
        console.log("Fetch account error: ", e);
      } finally {
        setIsLoading(false);
      }
    };
    getAccount();
  }, []);

  /* Add to card */
  useEffect(() => {
    const localCarts = localStorage.getItem("carts");
    if (localCarts) {
      const newCarts = JSON.parse(localCarts);
      setCarts(newCarts);
    }
  }, []);

  return (
    <>
      {isLoading === false ? (
        <AppContext.Provider
          value={{
            isAuthenticated,
            setIsAuthenticated,
            user,
            setUser,
            isLoading,
            setIsLoading,
            carts,
            setCarts,
          }}
        >
          {children}
        </AppContext.Provider>
      ) : (
        <PropagateLoader
          size="16px"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
          color="#3366CC"
        />
      )}
    </>
  );
};

export const useAppContext = () => {
  const currentAppContext = useContext(AppContext);

  if (!currentAppContext) {
    throw new Error("Lỗi AppConext");
  }
  return currentAppContext;
};
