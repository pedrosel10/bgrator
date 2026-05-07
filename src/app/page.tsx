"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import WizardForm, { WizardFormData } from "@/components/WizardForm";

export default function Home() {
  const [isHome, setIsHome] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleCheckout = async (data: WizardFormData) => {
    setStatus("loading");
    setErrorMsg("");

    try {
      // TEST MODE BYPASS
      localStorage.setItem("test_briefing", JSON.stringify(data));
      router.push("/success?session_id=TEST_MODE");

    } catch (err: any) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  return (
    <main className={styles.main}>
      {isHome ? (
        <div className={styles.homeCover}>
          <div className={styles.homeHeader}>
            <span className={styles.navItem}>≡ MENU</span>
            <span className={styles.navCenter}>ESTÚDIO</span>
            <span className={styles.navItem}>SEARCH ⌕</span>
          </div>
          
          <div className={styles.homeHero}>
            <h1 className="animate-fade-in" style={{ fontFamily: "var(--font-cooper)", fontSize: "6rem", lineHeight: "1" }}>
              Sygna<br/>Brands
            </h1>
            <p className="animate-fade-in" style={{ animationDelay: "0.1s", fontSize: "1.25rem", maxWidth: "400px", marginTop: "1.5rem" }}>
              A inteligência artificial que desenha identidades visuais de alto padrão em segundos.
            </p>
            
            <button 
              className={`animate-fade-in ${styles.startBtn}`} 
              style={{ animationDelay: "0.2s" }}
              onClick={() => setIsHome(false)}
            >
              Iniciar Criação →
            </button>
          </div>
          
          <div className={styles.homeFooterGrid}>
            <div className={styles.footerCell}>
              <span className={styles.label}>EST. 2026</span>
              <p>Design automatizado e poético.</p>
            </div>
            <div className={styles.footerCell}>
              <span className={styles.label}>ESTRUTURA</span>
              <p>Manifesto, Cores, Tipografia.</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <header className={styles.headerForm}>
            <h1 className="animate-fade-in" style={{ fontFamily: "var(--font-cooper)", fontSize: "2.5rem" }}>Sygna Brands</h1>
          </header>

          <section className={styles.formContainer}>
            {status === "idle" && (
              <div className="glass-panel" style={{ padding: "3rem" }}>
                <WizardForm onSubmit={handleCheckout} isLoading={false} />
              </div>
            )}

            {status === "loading" && (
              <div className="glass-panel" style={{ padding: "3rem 2rem", textAlign: "center" }}>
                <h3 className="animate-fade-in" style={{ fontFamily: "var(--font-cooper)", fontSize: "2rem" }}>Gerando Estratégia...</h3>
                <p style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>Aguarde um momento enquanto conectamos à inteligência artificial.</p>
              </div>
            )}

            {status === "error" && (
              <div className="glass-panel" style={{ padding: "2rem", textAlign: "center" }}>
                <h3 style={{ color: "var(--accent-primary)", marginBottom: "1rem" }}>Ops! Ocorreu um erro.</h3>
                <p style={{ marginBottom: "2rem", color: "var(--text-secondary)" }}>{errorMsg}</p>
                <button
                  onClick={() => setStatus("idle")}
                  style={{
                    background: "var(--text-primary)",
                    color: "var(--bg-primary)",
                    padding: "0.75rem 1.5rem",
                    border: "none",
                    fontWeight: "600",
                    textTransform: "uppercase"
                  }}
                >
                  Tentar Novamente
                </button>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
