import styles from "./LoadingState.module.css";

export default function LoadingState() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
      </div>
      <h3 className={styles.title}>Criando sua Identidade...</h3>
      <p className={styles.subtitle}>Analisando sua marca com IA e desenhando a logo.</p>
    </div>
  );
}
