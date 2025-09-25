import { createContext, useContext, useEffect, useState } from "react";
import { axiosClient, attempt_refresh } from "../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

/*
  na gamit dya para mag handle sang authentication kag authorization
*/

const TARGET_AUTH = import.meta.env.VITE_TARGET_AUTH; // Authentication API URL
const TARGET_SYSTEM = import.meta.env.VITE_TARGET_SYSTEM; // System API URL

// authentication context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const nav = useNavigate()

  // used to track the authentication state
  const [authLoading, setAuthLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false);

  // user data fetched from database
  const [credentials, setCredentials] = useState({})
  const [account, setAccount] = useState({});
  const [settings, setSettings] = useState({});


  // login function
  async function login(username, password) {
    try {
      const response = await axiosClient.post(TARGET_AUTH + "/auth/login", { username, password });
      const token = response.data.tkn_acc;

      if (token) {
        localStorage.setItem("accessToken", token)
        setAuthenticated(true);
        fetchAccountData()
        nav("/dashboard")
      }

    } catch (error) {
      console.error(error)
      let msg = error.response?.data?.msg ? error.response.data.msg : "unknown error when logging in";
      throw msg;
    }
  }


  // logout function
  async function logout() {
    try {
      await axiosClient.post(TARGET_AUTH + "/auth/logout");
      localStorage.clear();
      setAuthenticated(false)
      nav("/")
      notifyConfirm("Logged out sucessfully")
    } catch (error) {
      let msg = error.response?.data?.msg ? error.response.data.msg : "unknown error when logging out";
      throw msg;
    }
  }


  // fetches all account data (account and settings)
  async function fetchAccountData() {
    try {
      await fetchAccount();
      await fetchAccountSettings();
    } catch (error) {
      let msg = error.response?.data?.msg ? error.response.data.msg : "unknown error when fetch all account data";
      throw msg;
    } finally {
    }
  }


  // fetches account data only
  async function fetchAccount() {
    try {
      const result = await axiosClient.get(TARGET_SYSTEM + "/accounts/me");
      setAccount(result.data.data[0]);
    } catch (error) {
      let msg = error.response?.data?.msg ? error.response.data.msg : "unknown error when fetching account data";
      throw msg;
    }
  }


  // fetches account settings data only
  async function fetchAccountSettings() {
    try {
      const result = await axiosClient.get(TARGET_SYSTEM + "/account_settings/");
      setSettings(result.data.data);
    } catch (error) {
      let msg = error.response?.data?.msg ? error.response.data.msg : "unknown error when fetching account settings";
      throw msg;
    }
  }


  // handle account update
  async function editAccount(data) {
    try {
      await axiosClient.put(TARGET_AUTH + "/accounts/", { data });
      return true
    } catch (error) {
      console.log('[AUTH] ERROR: fetch account data. ' + error)
    }
  }


  // handle account settings update
  async function editAccountSettings(data) {
    try {
      await axiosClient.put(TARGET_SYSTEM + "/account_settings", { ...data });
      fetchAccountSettings()
      return true
    } catch (error) {
      console.log('[AUTH] ERROR: fetch account data. ' + error)
    }
  }


  // fetch account data only if authenticated
  useEffect(() => {
    if (authenticated) {
      fetchAccountData()
    }
  }, [authenticated])


  // authentication check on component load
  useEffect(() => {
    const init = async () => {
      setAuthLoading(true);
      try {
        // attempt to refresh token
        const refreshed = await attempt_refresh();

        // if token refresh attemt failed
        if (!refreshed) {
          localStorage.clear();
          localStorage.setItem("session_ended", "yas");
          setAuthenticated(false);
          setCredentials(null);
          nav("/");
        }

        const token = localStorage.getItem("accessToken");

        if (token && token.split(".").length === 3) {
          try {
            const decoded = jwtDecode(token);
            setCredentials(decoded);
            localStorage.removeItem("session_ended");
            setAuthenticated(true);
          } catch (decodeErr) {
            console.error("[JWT DECODE FAILED]", decodeErr);
            console.warn("[INVALID TOKEN FORMAT]");
            localStorage.clear();
            setAuthenticated(false);
            setCredentials(null);
            nav("/");
          }
        } else {
          console.warn("[INVALID TOKEN FORMAT]");
          localStorage.clear();
          setAuthenticated(false);
          setCredentials(null);
          nav("/");
        }
      } catch (error) {
        console.error("[AUTH INIT ERROR]", error);
        localStorage.clear();
        setAuthenticated(false);
        setCredentials(null);
        nav("/");
      } finally {
        setAuthLoading(false);
      }
    };

    init();
  }, [nav]);


  const values = {
    // check state of authentication
    authLoading,
    authenticated,

    // stores the user's account and settings fetched from the database
    account,
    settings,

    // core authentication functions
    login,
    logout,

    // fetches account and settings data
    fetchAccountData,

    // manual fetch for account and settings
    fetchAccount,
    fetchAccountSettings,

    // edit functions for account and settings
    editAccount,
    editAccountSettings,
  }

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
