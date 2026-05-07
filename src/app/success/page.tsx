"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "../page.module.css";
import LoadingState from "@/components/LoadingState";
import BrandGuide from "@/components/BrandGuide";

// --- IndexedDB Utilities ---
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) return reject("IndexedDB not supported");
    const request = window.indexedDB.open("BrandGeneratorDB", 1);
    request.onupgradeneeded = (e: any) => {
      e.target.result.createObjectStore("brands");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveBrandData = async (id: string, data: any) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("brands", "readwrite");
      const store = tx.objectStore("brands");
      store.put(data, id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn("Failed to save to DB:", e);
  }
};

const getBrandData = async (id: string): Promise<any> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("brands", "readonly");
      const store = tx.objectStore("brands");
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn("Failed to read from DB:", e);
    return null;
  }
};
// ---------------------------

function SuccessContent() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");

  const [status, setStatus] = useState<"verifying" | "generating" | "success" | "error">("verifying");
  const [brandData, setBrandData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!session_id) {
      setStatus("error");
      setErrorMsg("Sessão de pagamento não encontrada.");
      return;
    }

    let isMounted = true;

    const processOrder = async () => {
      try {
        // 1. Check local cache (IndexedDB) first to survive page refreshes
        if (session_id !== "TEST_MODE") {
          const cachedData = await getBrandData(session_id);
          if (cachedData) {
            if (isMounted) {
              setBrandData(cachedData);
              setStatus("success");
            }
            return;
          }
        }

        setStatus("generating");
        const payload: any = { session_id };
        if (session_id === "TEST_MODE") {
          const testData = localStorage.getItem("test_briefing");
          if (testData) {
            payload.test_data = JSON.parse(testData);
          }
        }

        const res = await fetch("/api/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.error === "ALREADY_GENERATED") {
            throw new Error("Esta identidade já foi gerada neste pagamento e não pode ser refeita. Por segurança, garantimos apenas uma geração por pagamento.");
          } else if (data.error === "PROCESSING") {
            throw new Error("Sua identidade já está sendo processada em outra aba ou tentativa. Por favor, aguarde alguns minutos e tente novamente.");
          }
          throw new Error(data.error || "Erro ao processar o pedido.");
        }

        if (isMounted) {
          setBrandData(data.data);
          setStatus("success");
          if (session_id !== "TEST_MODE") {
            await saveBrandData(session_id, data.data);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setStatus("error");
          setErrorMsg(err.message);
        }
      }
    };

    processOrder();

    return () => {
      isMounted = false;
    };
  }, [session_id]);

  if (status === "error") {
    return (
      <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
        <h3 style={{ color: "#ef4444", marginBottom: "1rem" }}>Erro no Processamento</h3>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>{errorMsg}</p>
        <button 
          onClick={() => window.location.href = "/"}
          style={{ background: "var(--border-subtle)", padding: "0.75rem 1.5rem", borderRadius: "8px", color: "white" }}
        >
          Voltar ao Início
        </button>
      </div>
    );
  }

  if (status === "success" && brandData) {
    return (
      <div style={{ maxWidth: "1000px", margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ display: "inline-block", background: "rgba(34, 197, 94, 0.2)", color: "#4ade80", padding: "0.5rem 1rem", borderRadius: "99px", fontSize: "0.875rem", marginBottom: "1rem" }}>
            ✓ Pagamento Confirmado
          </span>
        </div>
        <BrandGuide data={brandData} />
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
      <LoadingState />
      <p style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>
        {status === "verifying" ? "Verificando seu pagamento..." : "Pagamento aprovado! Gerando sua identidade..."}
      </p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className={styles.main}>
      <Suspense fallback={<div>Carregando...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
