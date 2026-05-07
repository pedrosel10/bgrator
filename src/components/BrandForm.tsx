import styles from "./BrandForm.module.css";

export interface BrandFormData {
  name: string;
  niche: string;
  vibe: string;
  email: string;
}

interface BrandFormProps {
  onSubmit: (data: BrandFormData) => void;
  isLoading: boolean;
}

export default function BrandForm({ onSubmit, isLoading }: BrandFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      name: formData.get("name") as string,
      niche: formData.get("niche") as string,
      vibe: formData.get("vibe") as string,
      email: formData.get("email") as string,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label htmlFor="name">Nome da Marca</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          placeholder="Ex: Gênesis Tech" 
          required 
          disabled={isLoading}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="niche">Nicho / Setor</label>
        <input 
          type="text" 
          id="niche" 
          name="niche" 
          placeholder="Ex: Tecnologia e IA" 
          required 
          disabled={isLoading}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="vibe">Personalidade (Vibe)</label>
        <input 
          type="text" 
          id="vibe" 
          name="vibe" 
          placeholder="Ex: Moderno, Minimalista, Escuro" 
          required 
          disabled={isLoading}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="email">Seu E-mail (Para receber a nota fiscal e resultado)</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          placeholder="seu@email.com" 
          required 
          disabled={isLoading}
        />
      </div>

      <button type="submit" className={styles.submitBtn} disabled={isLoading}>
        {isLoading ? "Processando..." : "Gerar Identidade (R$ 1,00)"}
      </button>
    </form>
  );
}
