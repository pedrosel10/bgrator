import styles from "./BrandGuide.module.css";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, Loader2 } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface BrandData {
  colors: { primary: string; secondary: string; accent: string; };
  typography: { headingFont: string; bodyFont: string; };
  logoUrl: string;
  branding: {
    estrategia: { publico: string; promessa: string; posicionamento: string };
    core: { sobre: string; proposito: string; valores: { titulo: string, descricao: string }[]; visao: string };
    personalidade: { arquetipo: string; voz: string; tom: string };
    narrativa: { bigIdea: string; bio: string; tagline: string; manifesto: string };
    expressao: { dosAndDonts: { dos: string[]; donts: string[] }; keywords: string[]; verbos: string[] };
  };
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

/* =========================================================================
   MOTOR WEB (BENTO BOX EDITORIAL DARK)
   ========================================================================= */
function BrandGuideWeb({ data, headingFont }: any) {
  return (
    <div className={styles.webLayout}>
      
      {/* Manifesto / Hero */}
      <div className={`${styles.bentoItem} ${styles.col12}`}>
        <div className={styles.bentoHeader}>Manifesto</div>
        <h1 className={styles.heroTitle} style={{ fontFamily: headingFont }}>{data.branding.narrativa.manifesto}</h1>
      </div>

      {/* Estratégia */}
      <div className={`${styles.bentoItem} ${styles.col8}`}>
        <div className={styles.bentoHeader}>Estratégia & Posicionamento</div>
        
        <div className={styles.metricBlock}>
          <span className={styles.metricLabel}>Big Idea</span>
          <div className={styles.metricValue} style={{ fontFamily: headingFont, fontSize: '2.5rem', color: 'var(--brand-primary)' }}>{data.branding.narrativa.bigIdea}</div>
        </div>

        <div className={styles.metricBlock}>
          <span className={styles.metricLabel}>A Promessa</span>
          <div className={styles.bodyText} style={{ fontSize: '1.25rem' }}>{data.branding.estrategia.promessa}</div>
        </div>

        <div className={styles.metricBlock} style={{ marginBottom: 0 }}>
          <span className={styles.metricLabel}>O Público</span>
          <div className={styles.bodyText}>{data.branding.estrategia.publico}</div>
        </div>
      </div>

      {/* Personalidade */}
      <div className={`${styles.bentoItem} ${styles.col4}`}>
        <div className={styles.bentoHeader}>Personalidade</div>
        
        <div className={styles.metricBlock}>
          <span className={styles.metricLabel}>Arquétipo</span>
          <div className={styles.metricValue}>{data.branding.personalidade.arquetipo}</div>
        </div>
        
        <div className={styles.metricBlock}>
          <span className={styles.metricLabel}>Voz</span>
          <div className={styles.metricValue}>{data.branding.personalidade.voz}</div>
        </div>

        <div className={styles.metricBlock} style={{ marginBottom: 0 }}>
          <span className={styles.metricLabel}>Tom</span>
          <div className={styles.metricValue}>{data.branding.personalidade.tom}</div>
        </div>
      </div>

      {/* Cores */}
      <div className={`${styles.bentoItem} ${styles.col6}`}>
        <div className={styles.bentoHeader}>Sistema Cromático</div>
        <div className={styles.colorGrid}>
          {Object.entries(data.colors).map(([name, hex]: any) => (
            <div key={name} style={{ cursor: "pointer" }} onClick={() => copyToClipboard(hex)}>
              <div className={styles.colorSwatch} style={{ backgroundColor: hex }}></div>
              <span className={styles.colorName}>{name}</span>
              <span className={styles.colorHex}>{hex}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tipografia */}
      <div className={`${styles.bentoItem} ${styles.col6}`}>
        <div className={styles.bentoHeader}>Sistema Tipográfico</div>
        
        <div className={styles.metricBlock}>
          <span className={styles.metricLabel}>Heading: {data.typography.headingFont}</span>
          <div style={{ fontFamily: headingFont, fontSize: '3rem', color: 'var(--brand-primary)' }}>Aa Bb Cc Dd Ee</div>
        </div>

        <div className={styles.metricBlock} style={{ marginBottom: 0 }}>
          <span className={styles.metricLabel}>Body: {data.typography.bodyFont}</span>
          <div className={styles.bodyText}>A elegância não é sobre ser notado, é sobre ser lembrado. O design minimalista fala mais alto.</div>
        </div>
      </div>

      {/* Guia de Aplicação (Dos e Don'ts) */}
      <div className={`${styles.bentoItem} ${styles.col6}`}>
        <div className={styles.bentoHeader}>Dos & Don'ts</div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ flex: 1 }}>
            <span className={styles.metricLabel} style={{ color: '#4ade80' }}>Dos</span>
            <ul className={styles.wireList}>
              {data.branding.expressao.dosAndDonts.dos.map((d: any, i: number) => <li key={i}>{d}</li>)}
            </ul>
          </div>
          <div style={{ flex: 1 }}>
            <span className={styles.metricLabel} style={{ color: '#f87171' }}>Don'ts</span>
            <ul className={styles.wireList}>
              {data.branding.expressao.dosAndDonts.donts.map((d: any, i: number) => <li key={i}>{d}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* Keywords e Logo (se houver) */}
      <div className={`${styles.bentoItem} ${styles.col6}`}>
        <div className={styles.bentoHeader}>Expressão</div>
        
        <div className={styles.metricBlock}>
          <span className={styles.metricLabel}>Keywords</span>
          <div className={styles.pillList}>
            {data.branding.expressao.keywords.map((k: any, i: number) => (
              <span key={i} className={styles.pill}>{k}</span>
            ))}
          </div>
        </div>

        <div className={styles.metricBlock}>
          <span className={styles.metricLabel}>Verbos de Ação</span>
          <div className={styles.pillList}>
            {data.branding.expressao.verbos.map((v: any, i: number) => (
              <span key={i} className={styles.pill} style={{ borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }}>{v}</span>
            ))}
          </div>
        </div>

        {data.logoUrl && (
          <div style={{ marginTop: '2rem' }}>
            <span className={styles.metricLabel}>Logo Export (Preview)</span>
            <div style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', display: 'flex', justifyContent: 'center' }}>
              <Image src={data.logoUrl} alt="Logo" width={200} height={200} unoptimized />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

/* =========================================================================
   O MOTOR PDF (1920x1080 - Apresentação Limpa)
   ========================================================================= */
function BrandGuidePDF({ data, headingFont, containerRef }: any) {
  return (
    <div ref={containerRef}>
      
      {/* 1. Capa */}
      <div className={styles.pdfPage}>
        <div className={styles.pdfInner}>
          <div className={styles.pdfHeader}>
            <span className={styles.pdfPageNum}>01</span>
            <span className={styles.pdfDocType}>BRAND BOOK</span>
          </div>
          <div style={{ margin: 'auto 0' }}>
            <h1 className={styles.pdfTitle} style={{ fontFamily: headingFont }}>{data.branding.narrativa.bigIdea}</h1>
            <p className={styles.pdfText}>{data.branding.narrativa.tagline}</p>
          </div>
        </div>
      </div>

      {/* 2. Core da Marca */}
      <div className={styles.pdfPage}>
        <div className={styles.pdfInner}>
          <div className={styles.pdfHeader}>
            <span className={styles.pdfPageNum}>02</span>
            <span className={styles.pdfDocType}>CORE DA MARCA</span>
          </div>
          <div className={styles.pdfGrid2}>
            <div>
              <div className={styles.pdfMetricBlock}>
                <div className={styles.pdfMetricLabel}>Sobre</div>
                <div className={styles.pdfText}>{data.branding.core.sobre}</div>
              </div>
              <div className={styles.pdfMetricBlock} style={{ marginTop: '80px' }}>
                <div className={styles.pdfMetricLabel}>Visão</div>
                <div className={styles.pdfText}>{data.branding.core.visao}</div>
              </div>
            </div>
            <div>
              <div className={styles.pdfMetricLabel}>Propósito</div>
              <div className={styles.pdfMetricValue} style={{ fontFamily: headingFont, fontSize: '64px', color: 'var(--brand-primary)', lineHeight: 1.2 }}>
                "{data.branding.core.proposito}"
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Estratégia e Personalidade */}
      <div className={styles.pdfPage}>
        <div className={styles.pdfInner}>
          <div className={styles.pdfHeader}>
            <span className={styles.pdfPageNum}>03</span>
            <span className={styles.pdfDocType}>ESTRATÉGIA E PERSONALIDADE</span>
          </div>
          <div className={styles.pdfGrid2}>
            <div>
              <div className={styles.pdfMetricBlock}>
                <div className={styles.pdfMetricLabel}>A Promessa</div>
                <div className={styles.pdfText}>{data.branding.estrategia.promessa}</div>
              </div>
              <div className={styles.pdfMetricBlock} style={{ marginTop: '80px' }}>
                <div className={styles.pdfMetricLabel}>O Público</div>
                <div className={styles.pdfText}>{data.branding.estrategia.publico}</div>
              </div>
            </div>
            <div className={styles.pdfGrid2} style={{ gap: '40px' }}>
              <div className={styles.pdfMetricBlock}>
                <div className={styles.pdfMetricLabel}>Arquétipo</div>
                <div className={styles.pdfMetricValue}>{data.branding.personalidade.arquetipo}</div>
              </div>
              <div className={styles.pdfMetricBlock}>
                <div className={styles.pdfMetricLabel}>Voz</div>
                <div className={styles.pdfMetricValue}>{data.branding.personalidade.voz}</div>
              </div>
              <div className={styles.pdfMetricBlock}>
                <div className={styles.pdfMetricLabel}>Tom</div>
                <div className={styles.pdfMetricValue}>{data.branding.personalidade.tom}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Manifesto */}
      <div className={styles.pdfPage}>
        <div className={styles.pdfInner}>
          <div className={styles.pdfHeader}>
            <span className={styles.pdfPageNum}>04</span>
            <span className={styles.pdfDocType}>MANIFESTO</span>
          </div>
          <div style={{ margin: 'auto 0', textAlign: 'center' }}>
            <h2 className={styles.pdfTitle} style={{ fontFamily: headingFont, maxWidth: '1600px', margin: '0 auto', fontSize: '80px', color: 'var(--brand-primary)' }}>
              "{data.branding.narrativa.manifesto}"
            </h2>
          </div>
        </div>
      </div>

      {/* 5. Design System */}
      <div className={styles.pdfPage}>
        <div className={styles.pdfInner}>
          <div className={styles.pdfHeader}>
            <span className={styles.pdfPageNum}>05</span>
            <span className={styles.pdfDocType}>DESIGN SYSTEM</span>
          </div>
          <div className={styles.pdfGrid2}>
            <div>
              <div className={styles.pdfMetricLabel}>Sistema Cromático</div>
              <div className={styles.pdfGrid3}>
                {Object.entries(data.colors).map(([name, hex]: any) => (
                  <div key={name}>
                    <div className={styles.pdfColorSwatch} style={{ backgroundColor: hex }}></div>
                    <span className={styles.pdfColorInfo} style={{ display: 'block', opacity: 0.5 }}>{name}</span>
                    <span className={styles.pdfColorInfo}>{hex}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className={styles.pdfMetricLabel}>Sistema Tipográfico</div>
              <div style={{ marginBottom: '60px' }}>
                <span className={styles.pdfMetricLabel} style={{ opacity: 0.5, marginBottom: '10px' }}>Heading: {data.typography.headingFont}</span>
                <div style={{ fontFamily: headingFont, fontSize: '100px', color: 'var(--brand-primary)' }}>Aa Bb Cc Dd</div>
              </div>
              <div>
                <span className={styles.pdfMetricLabel} style={{ opacity: 0.5, marginBottom: '10px' }}>Body: {data.typography.bodyFont}</span>
                <div className={styles.pdfText}>A elegância não é sobre ser notado, é sobre ser lembrado. O design silencioso fala mais alto.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Guia de Aplicação */}
      <div className={styles.pdfPage}>
        <div className={styles.pdfInner}>
          <div className={styles.pdfHeader}>
            <span className={styles.pdfPageNum}>06</span>
            <span className={styles.pdfDocType}>GUIA DE APLICAÇÃO</span>
          </div>
          <div className={styles.pdfGrid2}>
            <div>
              <div className={styles.pdfMetricLabel}>Keywords</div>
              <div style={{ marginBottom: '60px' }}>
                {data.branding.expressao.keywords.map((k: any, i: number) => (
                  <span key={i} className={styles.pdfPill}>{k}</span>
                ))}
              </div>
              <div className={styles.pdfMetricLabel}>Verbos de Ação</div>
              <div>
                {data.branding.expressao.verbos.map((v: any, i: number) => (
                  <span key={i} className={styles.pdfPill} style={{ borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }}>{v}</span>
                ))}
              </div>
            </div>
            <div className={styles.pdfGrid2}>
              <div>
                <div className={styles.pdfMetricLabel} style={{ color: '#4ade80' }}>Dos</div>
                <ul className={styles.wireList} style={{ fontSize: '24px' }}>
                  {data.branding.expressao.dosAndDonts.dos.map((d: any, i: number) => <li key={i}>{d}</li>)}
                </ul>
              </div>
              <div>
                <div className={styles.pdfMetricLabel} style={{ color: '#f87171' }}>Don'ts</div>
                <ul className={styles.wireList} style={{ fontSize: '24px' }}>
                  {data.branding.expressao.dosAndDonts.donts.map((d: any, i: number) => <li key={i}>{d}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

/* =========================================================================
   O MOTOR STORIES (1080x1920 - Social)
   ========================================================================= */
function BrandGuideStories({ data, headingFont, containerRef }: any) {
  return (
    <div ref={containerRef}>
      
      {/* Story 1: Manifesto */}
      <div className={styles.storyPage}>
        <div className={styles.storyContent}>
          <div className={styles.storyTitle}>Manifesto</div>
          <div className={styles.storyText} style={{ fontFamily: headingFont }}>"{data.branding.narrativa.manifesto}"</div>
        </div>
        <div className={styles.storyWatermark}>{data.branding.narrativa.bigIdea}</div>
      </div>

      {/* Story 2: Promessa */}
      <div className={styles.storyPage}>
        <div className={styles.storyContent}>
          <div className={styles.storyTitle}>A Promessa</div>
          <div className={styles.storyText} style={{ fontFamily: headingFont, color: 'var(--brand-primary)' }}>"{data.branding.estrategia.promessa}"</div>
        </div>
        <div className={styles.storyWatermark}>{data.branding.narrativa.bigIdea}</div>
      </div>

      {/* Story 3: Arquetipo / Tom */}
      <div className={styles.storyPage}>
        <div className={styles.storyContent}>
          <div className={styles.storyTitle}>Personalidade</div>
          <div className={styles.storyText} style={{ fontFamily: headingFont }}>
             Nós somos o <span style={{ color: "var(--brand-primary)" }}>{data.branding.personalidade.arquetipo}</span>.<br/><br/> Falamos de forma <span style={{ color: "var(--brand-primary)" }}>{data.branding.personalidade.tom}</span> e <span style={{ color: "var(--brand-primary)" }}>{data.branding.personalidade.voz}</span>.
          </div>
        </div>
        <div className={styles.storyWatermark}>{data.branding.narrativa.bigIdea}</div>
      </div>

    </div>
  );
}

/* =========================================================================
   O ORQUESTRADOR E EXPORTADOR
   ========================================================================= */
export default function BrandGuide({ data }: { data: BrandData }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const storiesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadFonts = () => {
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${data.typography.headingFont.replace(/ /g, "+")}:wght@400;600;700&family=${data.typography.bodyFont.replace(/ /g, "+")}:wght@300;400;500;600&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
      setFontsLoaded(true);
    };
    loadFonts();
  }, [data.typography]);

  const exportFiles = async () => {
    if (!pdfContainerRef.current || !storiesContainerRef.current) return;
    setIsExporting(true);
    
    try {
      const zip = new JSZip();

      // 1. Geração do PDF
      const pages = pdfContainerRef.current.querySelectorAll(`.${styles.pdfPage}`);
      const pdf = new jsPDF("l", "px", [1920, 1080]);
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        const canvas = await html2canvas(page, { scale: 1, useCORS: true, backgroundColor: "#0a0a0a" }); // scale 1 is enough for 1920x1080
        const imgData = canvas.toDataURL("image/jpeg", 0.9); // JPEG is smaller and faster
        
        if (i > 0) pdf.addPage([1920, 1080], "l");
        pdf.addImage(imgData, "JPEG", 0, 0, 1920, 1080);
      }
      
      const pdfBlob = pdf.output("blob");
      zip.file("apresentacao-marca.pdf", pdfBlob);

      // 2. Geração dos Stories
      const storyPages = storiesContainerRef.current.querySelectorAll(`.${styles.storyPage}`);
      const storiesFolder = zip.folder("stories");
      for (let i = 0; i < storyPages.length; i++) {
        const page = storyPages[i] as HTMLElement;
        const canvas = await html2canvas(page, { scale: 1, useCORS: true, backgroundColor: "#0a0a0a" });
        const imgData = canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");
        storiesFolder?.file(`story-${i + 1}.png`, imgData, { base64: true });
      }

      // 3. Captura da Logo em Alta Qualidade
      if (data.logoUrl) {
        try {
          const response = await fetch(data.logoUrl);
          const blob = await response.blob();
          zip.file("logo-alta-qualidade.png", blob);
        } catch (e) {
          console.warn("Não foi possível baixar a logo.", e);
        }
      }

      // 4. Download
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "sygna-brand-assets.zip");

    } catch (err) {
      console.error("Erro ao gerar arquivos", err);
      alert("Houve um erro ao gerar os arquivos. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  const dynamicStyles = {
    "--brand-primary": data.colors.primary,
    "--brand-secondary": data.colors.secondary,
    "--brand-accent": data.colors.accent,
    fontFamily: fontsLoaded ? `"${data.typography.bodyFont}", sans-serif` : "inherit"
  } as React.CSSProperties;

  const headingFont = fontsLoaded ? `"${data.typography.headingFont}", serif` : "inherit";

  return (
    <div className={styles.wrapper} style={dynamicStyles}>
      
      <div className={styles.actionHeader}>
        <h2>Estúdio Sygna</h2>
        <button onClick={exportFiles} className={styles.downloadPdfBtn} disabled={isExporting}>
          {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />} 
          {isExporting ? "Preparando Zip..." : "Baixar Assets"}
        </button>
      </div>

      <BrandGuideWeb 
        data={data} 
        headingFont={headingFont} 
      />

      <div className={styles.pdfEngineHidden}>
        <BrandGuidePDF 
          data={data} 
          headingFont={headingFont} 
          containerRef={pdfContainerRef} 
        />
      </div>

      <div className={styles.storyEngineHidden}>
        <BrandGuideStories 
          data={data} 
          headingFont={headingFont} 
          containerRef={storiesContainerRef} 
        />
      </div>

    </div>
  );
}
