import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createSession, logEvent as logEventApi } from "../api/api";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [sessionId, setSessionId] = useState(null);
  const [ready, setReady] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState([]);

  useEffect(() => {
    let cancelled = false;
    createSession()
      .then((data) => {
        if (!cancelled) {
          setSessionId(data.sessionId);
          setReady(true);
        }
      })
      .catch(() => {
        // If the backend isn't reachable, the app still renders — scenarios
        // will just no-op on logging rather than crash the demo.
        setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const logChoice = useCallback(
    async (scenario, action) => {
      if (!sessionId) return;
      try {
        await logEventApi(sessionId, scenario, action);
      } catch {
        // Swallow errors here — logging failures shouldn't block the demo flow.
      }
    },
    [sessionId]
  );

  const markComplete = useCallback((scenario) => {
    setCompletedScenarios((prev) => (prev.includes(scenario) ? prev : [...prev, scenario]));
  }, []);

  return (
    <SessionContext.Provider
      value={{ sessionId, ready, logChoice, completedScenarios, markComplete }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
