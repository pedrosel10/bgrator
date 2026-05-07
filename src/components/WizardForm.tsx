import { useState } from "react";
import styles from "./WizardForm.module.css";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export interface WizardFormData {
  // Base
  companyName: string;
  website: string;
  cityState: string;
  timeInMarket: string;
  sector: string;
  employees: string;
  businessModel: string;

  // Bloco 1
  whatWeDo: string;
  problemsSolved: string[];
  differentiator: string;

  // Bloco 2
  notThisBrand: string[];
  transformation: string;
  silentPromise: string;
  neverGivesUp: string;
  persona: string[];

  // Bloco 3
  visualTerritory: string[];
  admiredBrands: string;
  specificSymbol: string;
  forbiddenVisuals: string[];
  
  // Checkout
  email: string;
}

interface WizardFormProps {
  onSubmit: (data: WizardFormData) => void;
  isLoading: boolean;
}

const PROBLEM_OPTIONS = [
  "Economiza tempo", "Economiza dinheiro", "Reduz risco ou evita erro",
  "Simplifica algo complexo", "Aumenta resultado / performance", 
  "Melhora saúde ou bem-estar", "Eleva imagem / status", 
  "Organiza / dá clareza", "Dá prazer / experiência"
];

const NOT_BRAND_OPTIONS = [
  "Baratona / popular", "Luxury inacessível", "Séria / corporativa / fria",
  "Jovem demais / informal", "Agressiva / apelativa", "Genérica / 'mais do mesmo'",
  "Técnica demais", "Espiritualizada demais"
];

const TRANSFORMATION_OPTIONS = [
  "De perdido → orientado", "De inseguro → confiante", "De estagnado → em movimento",
  "De sobrecarregado → leve", "De comum → diferenciado", "De confuso → simples e direto"
];

const PROMISE_OPTIONS = [
  "Você está em boas mãos.", "Vai ser mais simples do que parece.", 
  "Aqui tem verdade, não teatro.", "Você vai se sentir visto(a).", 
  "Seu padrão vai subir.", "Você vai conseguir."
];

const NEVER_GIVES_UP_OPTIONS = [
  "Excelência técnica", "Transparência", "Acolhimento humano",
  "Inovação", "Simplicidade", "Estética / experiência"
];

const PERSONA_OPTIONS = [
  "Direta e objetiva", "Calorosa e próxima", "Sofisticada e precisa",
  "Irreverente e criativa", "Firme e confiável", "Intelectual e profunda", "Leve e acessível"
];

const VISUAL_OPTIONS = [
  "Limpo / minimalista", "Robusto / estruturado", "Orgânico / natural",
  "Moderno / tech", "Clássico / atemporal", "Expressivo / criativo", "Aconchegante / humano"
];

const FORBIDDEN_VISUALS_OPTIONS = [
  "Cores muito vibrantes / chamativas", "Visual 'de agência' / genérico",
  "Ícones genéricos de banco de imagens", "Fontes decorativas demais",
  "Parece startup de tecnologia", "Parece clínica / saúde",
  "Parece loja de varejo", "Muito sério / sem personalidade"
];

export default function WizardForm({ onSubmit, isLoading }: WizardFormProps) {
  const TOTAL_STEPS = 12;
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<WizardFormData>({
    companyName: "São Miguel Engenharia",
    website: "saomiguel.com.br",
    cityState: "São Paulo / SP",
    timeInMarket: "5 anos",
    sector: "Engenharia Civil de Alto Padrão",
    employees: "6–20",
    businessModel: "B2C — vende para pessoas",
    whatWeDo: "Construímos residências de alto padrão do zero para famílias exigentes.",
    problemsSolved: ["Reduz risco ou evita erro", "Eleva imagem / status"],
    differentiator: "Transparência absoluta no cronograma e uso de tecnologias limpas.",
    notThisBrand: ["Baratona / popular", "Jovem demais / informal"],
    transformation: "De inseguro → confiante",
    silentPromise: "Você está em boas mãos.",
    neverGivesUp: "Excelência técnica",
    persona: ["Sofisticada e precisa", "Firme e confiável"],
    visualTerritory: ["Limpo / minimalista", "Robusto / estruturado"],
    admiredBrands: "Porsche, Rolex, construtoras minimalistas suíças.",
    specificSymbol: "Algo que remeta a estrutura sólida, possivelmente geométrico.",
    forbiddenVisuals: ["Cores muito vibrantes / chamativas", "Ícones genéricos de banco de imagens"],
    email: "teste@saomiguel.com.br"
  });

  const updateForm = (field: keyof WizardFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof WizardFormData, value: string, max: number) => {
    const currentArray = formData[field] as string[];
    if (currentArray.includes(value)) {
      updateForm(field, currentArray.filter(i => i !== value));
    } else {
      if (currentArray.length < max) {
        updateForm(field, [...currentArray, value]);
      }
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === TOTAL_STEPS) {
      onSubmit(formData);
    } else {
      nextStep();
    }
  };

  const renderRadioGroup = (label: string, field: keyof WizardFormData, options: string[]) => (
    <div className={styles.inputGroup}>
      <label>{label}</label>
      <div className={styles.radioGrid}>
        {options.map(opt => (
          <label key={opt} className={`${styles.optionCard} ${formData[field] === opt ? styles.selected : ""}`}>
            <input 
              type="radio" 
              name={field} 
              value={opt} 
              checked={formData[field] === opt}
              onChange={() => updateForm(field, opt)}
              className={styles.hiddenInput}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );

  const renderCheckboxGroup = (label: string, field: keyof WizardFormData, options: string[], max: number) => (
    <div className={styles.inputGroup}>
      <label>{label} <span className={styles.labelHint}>(máx {max})</span></label>
      <div className={styles.radioGrid}>
        {options.map(opt => {
          const isSelected = (formData[field] as string[]).includes(opt);
          const isDisabled = !isSelected && (formData[field] as string[]).length >= max;
          return (
            <label key={opt} className={`${styles.optionCard} ${isSelected ? styles.selected : ""} ${isDisabled ? styles.disabled : ""}`}>
              <input 
                type="checkbox" 
                checked={isSelected}
                onChange={() => toggleArrayItem(field, opt, max)}
                disabled={isDisabled}
                className={styles.hiddenInput}
              />
              {opt}
            </label>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={styles.wizardContainer}>
      
      {/* Progress Dots Header */}
      <div className={styles.progressHeader}>
        <div className={styles.progressDots}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className={`${styles.dot} ${step >= i + 1 ? styles.dotActive : ""}`} />
          ))}
        </div>
        <div className={styles.progressText}>Passo {step} de {TOTAL_STEPS}</div>
      </div>

      <form onSubmit={handleSubmit} className={styles.formBody}>
        
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className={styles.stepTitle}>Quem é você?</h2>
            <div className={styles.inputGroup}>
              <label>Nome da empresa / marca</label>
              <input type="text" value={formData.companyName} onChange={e => updateForm("companyName", e.target.value)} required autoFocus />
            </div>
            <div className={styles.inputGroup}>
              <label>Setor / segmento</label>
              <input type="text" value={formData.sector} onChange={e => updateForm("sector", e.target.value)} required />
            </div>
            <div className={styles.inputGroup}>
              <label>Tempo de mercado</label>
              <input type="text" value={formData.timeInMarket} onChange={e => updateForm("timeInMarket", e.target.value)} required />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className={styles.stepTitle}>Sua Estrutura</h2>
            <div className={styles.inputGroup}>
              <label>Cidade / Estado</label>
              <input type="text" value={formData.cityState} onChange={e => updateForm("cityState", e.target.value)} required autoFocus />
            </div>
            <div className={styles.inputGroup}>
              <label>Site ou redes sociais (opcional)</label>
              <input type="text" value={formData.website} onChange={e => updateForm("website", e.target.value)} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className={styles.stepTitle}>Volume & Negócio</h2>
            {renderRadioGroup("Número de funcionários", "employees", ["Só eu", "2–5", "6–20", "21–50", "50+"])}
            {renderRadioGroup("Modelo de negócio", "businessModel", ["B2C — vende para pessoas", "B2B — vende para empresas", "Os dois"])}
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <h2 className={styles.stepTitle}>O que você entrega?</h2>
            <div className={styles.inputGroup}>
              <label>O que essa empresa faz e para quem? (Em 1 ou 2 linhas. Sem jargão)</label>
              <textarea value={formData.whatWeDo} onChange={e => updateForm("whatWeDo", e.target.value)} required rows={4} autoFocus />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-fade-in">
            <h2 className={styles.stepTitle}>O Problema Real</h2>
            <p className={styles.stepSubtitle}>Pelo que seus clientes pagam de verdade?</p>
            {renderCheckboxGroup("Que problema real ela resolve?", "problemsSolved", PROBLEM_OPTIONS, 2)}
          </div>
        )}

        {step === 6 && (
          <div className="animate-fade-in">
            <h2 className={styles.stepTitle}>O seu Diferencial</h2>
            <div className={styles.inputGroup}>
              <label>O que você faz que o concorrente não faz, ou não faz tão bem?</label>
              <textarea value={formData.differentiator} onChange={e => updateForm("differentiator", e.target.value)} required rows={4} autoFocus />
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="animate-fade-in">
            <h2 className={styles.stepTitle}>Inimigos da Marca</h2>
            <p className={styles.stepSubtitle}>Aquilo que você definitivamente recusa ser.</p>
            {renderCheckboxGroup("Essa marca NÃO é:", "notThisBrand", NOT_BRAND_OPTIONS, 3)}
          </div>
        )}

        {step === 8 && (
          <div className="animate-fade-in">
            <h2 className={styles.stepTitle}>O Impacto Invisível</h2>
            {renderRadioGroup("Que transformação ela gera no cliente?", "transformation", TRANSFORMATION_OPTIONS)}
            <br/>
            {renderRadioGroup("Qual promessa silenciosa essa marca faz?", "silentPromise", PROMISE_OPTIONS)}
          </div>
        )}

        {step === 9 && (
          <div className="animate-fade-in">
            <h2 className={styles.stepTitle}>A Personalidade</h2>
            {renderRadioGroup("O que ela nunca abre mão?", "neverGivesUp", NEVER_GIVES_UP_OPTIONS)}
            <br/>
            {renderCheckboxGroup("Se essa marca fosse uma pessoa, como ela seria?", "persona", PERSONA_OPTIONS, 2)}
          </div>
        )}

        {step === 10 && (
          <div className="animate-fade-in">
            <h2 className={styles.stepTitle}>Território Estético</h2>
            <p className={styles.stepSubtitle}>Onde vamos pisar visualmente?</p>
            {renderCheckboxGroup("Que território visual representa essa marca?", "visualTerritory", VISUAL_OPTIONS, 2)}
          </div>
        )}

        {step === 11 && (
          <div className="animate-fade-in">
            <h2 className={styles.stepTitle}>Direcionamento Criativo</h2>
            <div className={styles.inputGroup}>
              <label>Marcas ou estilos visuais que você admira</label>
              <textarea value={formData.admiredBrands} onChange={e => updateForm("admiredBrands", e.target.value)} required rows={3} autoFocus />
            </div>
            <div className={styles.inputGroup}>
              <label>A logo deve conter algum objeto, símbolo ou elemento específico?</label>
              <textarea value={formData.specificSymbol} onChange={e => updateForm("specificSymbol", e.target.value)} required rows={3} />
            </div>
          </div>
        )}

        {step === 12 && (
          <div className="animate-fade-in">
            <h2 className={styles.stepTitle}>Limites & Finalização</h2>
            {renderCheckboxGroup("O que definitivamente NÃO pode aparecer visualmente?", "forbiddenVisuals", FORBIDDEN_VISUALS_OPTIONS, 8)}

            <div className={styles.inputGroup} style={{ marginTop: "3rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "2rem" }}>
              <label>Seu e-mail para acesso futuro</label>
              <input type="email" value={formData.email} onChange={e => updateForm("email", e.target.value)} required />
            </div>
          </div>
        )}

        <div className={styles.formFooter}>
          {step > 1 ? (
            <button type="button" onClick={prevStep} className={styles.backBtn} disabled={isLoading}>
              <ArrowLeft size={18} /> Voltar
            </button>
          ) : <div></div>}
          
          <button type="submit" className={styles.nextBtn} disabled={isLoading}>
            {step < TOTAL_STEPS ? (
              <>Próximo <ArrowRight size={18} /></>
            ) : isLoading ? (
              "Processando IA..."
            ) : (
              <>Gerar Identidade Mágica <CheckCircle2 size={18} /></>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
