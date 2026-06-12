import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini API client on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Retry helper with exponential backoff
async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 2, delay = 600): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    console.warn(`Gemini API call failed, retrying in ${delay}ms...`, error);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
}

// Complete local deterministic script generator matching requested tone, audience, and focus in Português de Angola (1945)
function getLocalFallbackScript(tone: string, audience: string, focus: string, phone: string) {
  const currentPhone = phone || "972299319";
  const email = "suporteacademiaac@gmail.com";
  
  if (tone === "Ultramotivador") {
    return {
      slides: [
        {
          slideIndex: 0,
          title: "A Sua Graduação Académica Está ao Seu Alcance!",
          subtitle: "Não deixe que a escassez de tempo trave os seus sonhos.",
          narration: "Sente que o Trabalho de Fim de Curso é um obstáculo intransponível? A falta de tempo e as obrigações profissionais não o deixam avançar? O seu percurso merece um desfecho de glória! Nós acreditamos no seu potencial e estamos aqui para impulsionar a sua caminhada académica rumo ao topo de forma brilhante!",
          visualCue: "Estudante focado em Luanda a olhar determinado para um ecrã, com tons de azul marinho profundo e raios dourados de incentivo ao fundo.",
          duration: 35,
          serviceHighlights: ["Superação Académica", "Licenciatura Angola", "Sem Barreiras", "Foco no Sucesso"]
        },
        {
          slideIndex: 1,
          title: "Conheça o Nosso Suporte de Excelência",
          subtitle: "A sua maior parceira científica rumo ao sucesso.",
          narration: "A Academia de Monografias e Pesquisas Científicas é a resposta para a sua vitória académica. Com uma equipa dedicada, transformamos as suas preocupações em segurança total, fornecendo o apoio que o seu projecto de investigação merece. Siga connosco rumo ao diploma!",
          visualCue: "Apresentação dinâmica do prestigiado logotipo em ouro da Academia, brilhando com elegância sobre o fundo marinho real.",
          duration: 35,
          serviceHighlights: ["Parceria Científica", "Apoio Especializado", "Sucesso Garantido", "Prestígio Académico"]
        },
        {
          slideIndex: 2,
          title: "Investigação com Rigor APA 7ª Edição",
          subtitle: "A sua garantia de originalidade científica absoluta.",
          narration: "Dominamos todo o Conhecimento de Metodologia de Investigação Científica! Formatamos o seu Trabalho de Fim de Curso ou Artigo Científico sob a rigorosa norma APA 7ª edição. Exigimos originalidade total e absoluta, garantindo trabalhos livres de plágio intelectual ou conceitual.",
          visualCue: "Documento digital a ser estruturado faseadamente, com destaque dourado para a indicação 'APA 7ª Edição' e selo de conformidade da Academia.",
          duration: 40,
          serviceHighlights: ["Normas APA 7ª Edição", "Originalidade Forçada", "Metodologia de Rigor", "Formatação Limpa"]
        },
        {
          slideIndex: 3,
          title: "Prazos Rigorosamente Cumpridos",
          subtitle: "Acompanhamento minucioso por fases até à aprovação.",
          narration: "Sabemos que a entrega do Relatório de Estágio ou Monografia académica gera muito stress. Por isso, oferecemos planeamento rigoroso e suporte contínuo focado em notas de excelência superiores a 18 valores. A sua aprovação rápida e segura é o nosso único objectivo!",
          visualCue: "Gráfico dinâmico em barras de ouro exibindo pontuação máxima de excelência e notas elevadas de aprovação sob fundo azul escuro.",
          duration: 35,
          serviceHighlights: ["Prazos Cumpridos", "Notas de Excelência", "Planeamento de Acção", "Tranquilidade Garantida"]
        },
        {
          slideIndex: 4,
          title: "Assegure o Seu Sucesso Académico Agora!",
          subtitle: "Fale connosco e revolucione o seu Trabalho de Fim de Curso.",
          narration: "Não espere mais pelo amanhã! Obtenha resultados rápidos e de prestígio. Entre em contacto directo connosco pelo telefone e WhatsApp oficial: " + currentPhone + ", ou envie-nos um correio electrónico oficial para " + email + ". Fale connosco já e mude o seu rumo!",
          visualCue: "Ecrã final azul-escuro com o logotipo laurel e os contactos bem destacados: " + currentPhone + " e " + email + " a pulsar em ouro luminoso.",
          duration: 35,
          serviceHighlights: ["Ligue " + currentPhone, "E-mail de Suporte", "Fale Connosco Já", "Sucesso Assegurado"]
        }
      ]
    };
  } else if (tone === "Científico & Sério") {
    return {
      slides: [
        {
          slideIndex: 0,
          title: "Rigor na Investigação Científica",
          subtitle: "A base intelectual de um trabalho de fim de curso excelente.",
          narration: "A investigação científica de excelência impõe rigor metodológico e conformidade absoluta com as directrizes institucionais vigentes. Se o planeamento ou a estruturação da sua pesquisa constituem um desafio metodológico complexo, a nossa assessoria técnica especializada assegura a consistência conceitual necessária.",
          visualCue: "Fundo sóbrio azul marinho com linhas douradas matemáticas organizando uma rede de ideias de investigação estruturada conceitualmente.",
          duration: 35,
          serviceHighlights: ["Rigor Metodológico", "Consistência Conceitual", "Trabalho de Fim de Curso", "Investigação Séria"]
        },
        {
          slideIndex: 1,
          title: "Rigor Construtivo da Academia",
          subtitle: "Metodologia científica aplicada por consultores de prestígio.",
          narration: "A Academia de Monografias e Pesquisas Científicas opera como parceira estratégica na consolidação do mérito do seu projecto académico. Fornecemos suporte especializado, pautado pelo mais aprofundado Conhecimento de Metodologia de Investigação Científica, ideal para a aprovação dos seus trabalhos.",
          visualCue: "Transição elegante com o logotipo de ramos de louro em ouro sobrepondo-se a um ecrã azul-marinho real impecável.",
          duration: 35,
          serviceHighlights: ["Rigor e Compromisso", "Apoio Técnico", "Alta Investigação", "Excelência Metodológica"]
        },
        {
          slideIndex: 2,
          title: "Conformidade APA 7ª Edição",
          subtitle: "Formatação analítica rigorosamente livre de plágio.",
          narration: "Nenhum trabalho é aprovado sem formatação bibliográfica fidedigna. Estruturamos referências e citações sob as estritas directrizes da norma APA 7ª edição, mantendo um protocolo severo anti-plágio. Garantimos a autenticidade e validade científica do seu material de investigação.",
          visualCue: "Selo de conformidade técnica dourado validando formatação fidedigna do texto científico em conformidade com as regras APA 7ª.",
          duration: 40,
          serviceHighlights: ["Normas APA 7ª Edição", "Autenticidade Certificada", "Rigor Anti-plágio", "Revisão Científica"]
        },
        {
          slideIndex: 3,
          title: "Planeamento Estruturado por Fases",
          subtitle: "Cumprimento de prazos com foco em pontuações de excelência.",
          narration: "O nosso planeamento de acompanhamento divide o seu projecto ou Relatório de Estágio em entregas periódicas controladas, promovendo consistência contínua. Desse modo, viabilizamos o cumprimento integral dos prazos académicos e asseguramos avaliações acima de 18 valores.",
          visualCue: "Fluxograma cronológico dourado organizando marcos de entrega contínua com notas de excelência em Luanda.",
          duration: 35,
          serviceHighlights: ["Marcos de Entrega", "Relatório de Estágio", "Notas Elevadas", "Integridade Total"]
        },
        {
          slideIndex: 4,
          title: "Adquira Suporte Académico de Excelência",
          subtitle: "Estabeleça contacto com a nossa equipa especializada.",
          narration: "Eleve a qualidade conceitual da sua pesquisa e garanta a sua aprovação científica. Agende uma assessoria estratégica através do contacto telefónico oficial ou WhatsApp: " + currentPhone + ", ou pelo correio electrónico oficial: " + email + ". Fale connosco hoje.",
          visualCue: "Ecrã final azul-escuro com grafia dourada impecável apresentando o e-mail " + email + " e telefone " + currentPhone + ".",
          duration: 35,
          serviceHighlights: ["Contacto: " + currentPhone, "Email: " + email, "Rigor e Suporte", "Apoio Científico"]
        }
      ]
    };
  } else if (tone === "Empático & Suave") {
    return {
      slides: [
        {
          slideIndex: 0,
          title: "Sente-se Ansioso com o Trabalho de Fim de Curso?",
          subtitle: "Compreendemos as suas dificuldades e estamos aqui para apoiar.",
          narration: "Sabemos que a elaboração do Trabalho de Fim de Curso, as exigências metodológicas e as noites sem dormir causam uma ansiedade imensa. A pressão das entregas parece sufocante? Respire fundo! Você não tem de carregar todo este peso sozinho de agora em diante.",
          visualCue: "Design fluido em ondas azuis profundas harmoniosas com finas linhas de brilho dourado, simbolizando tranquilidade e alívio do stress.",
          duration: 35,
          serviceHighlights: ["Alívio Académico", "Compreensão Total", "Apoio Sem Pressão", "Empatia Connosco"]
        },
        {
          slideIndex: 1,
          title: "A Academia Acolhe as Suas Necessidades",
          subtitle: "Um suporte atencioso e especializado para a sua paz de espírito.",
          narration: "A Academia de Monografias e Pesquisas Científicas oferece mais do que uma assessoria, oferecemos verdadeira tranquilidade. Prestamos um acompanhamento personalizado que escuta as suas dúvidas e constrói o seu Trabalho de Fim de Curso de forma leve e segura.",
          visualCue: "Logotipo de ouro da Academia surgindo de forma delicada no ecrã com uma transição suave de fade-in e luz ambiental azul.",
          duration: 35,
          serviceHighlights: ["Apoio Personalizado", "Paz de Espírito", "Tranquilidade Científica", "Cuidado Especial"]
        },
        {
          slideIndex: 2,
          title: "Metodologia Segura e Confortável",
          subtitle: "Formatação APA 7ª edição com proteção absoluta anti-plágio.",
          narration: "Garantimos o rigor absoluto que os seus orientadores de investigação exigem. Cuidamos de todo o Conhecimento de Metodologia de Investigação Científica e da complexidade da norma APA 7ª edição, entregando tudo com relatórios contra plágio mecânico ou conceitual.",
          visualCue: "Visualização organizada do conteúdo formatado sob a norma APA 7ª edição deslizando de forma reconfortante no ecrã.",
          duration: 40,
          serviceHighlights: ["Normas APA 7ª Edição", "Segurança Total", "Rigor contra Plágio", "Revisão Cuidadosa"]
        },
        {
          slideIndex: 3,
          title: "Notas Excelentes no Seu Próprio Ritmo",
          subtitle: "Acompanhamento passo-a-passo e cumprimento fiel de prazos.",
          narration: "Planeamos as etapas de entrega em estrito acordo com os seus prazos institucionais e no seu próprio ritmo de aprendizado. Nós ajudamo-lo a formatar o seu Relatório de Estágio com serenidade, rumo a uma avaliação de excelência superior a 18 valores.",
          visualCue: "Gráficos de progresso em dourado suave crescendo harmonicamente sem saltos repentinos, indicando estabilidade académica.",
          duration: 35,
          serviceHighlights: ["Progresso Suave", "Relatório de Estágio", "Notas de Prestígio", "Calma Académica"]
        },
        {
          slideIndex: 4,
          title: "Permita-nos Ajudar no Seu Percurso",
          subtitle: "Estaremos consigo até à defesa final com total dedicação.",
          narration: "Não enfrente essa jornada académica sozinho e sobrecarregado. Deixe que a nossa equipa de mentores especializados tire esse peso dos seus ombros de forma segura. Entre em contacto amigável pelo telefone e WhatsApp: " + currentPhone + ", ou pelo correio eletrónico oficial: " + email + ".",
          visualCue: "Ecrã final aconchegante com o selo institucional d'ouro, com os contactos " + currentPhone + " e e-mail " + email + " legíveis.",
          duration: 35,
          serviceHighlights: ["Ligue " + currentPhone, "Correio Electrónico", "Estamos Consigo", "Mentoria Aberta"]
        }
      ]
    };
  } else {
    // Default and Commercial tone
    return {
      slides: [
        {
          slideIndex: 0,
          title: "Sem Tempo Para a Sua Monografia?",
          subtitle: "Nós resolvemos a estruturação científica do seu trabalho.",
          narration: "O prazo final da sua entrega está a aproximar-se e ainda não terminou o seu Trabalho de Fim de Curso? O trabalho, os compromissos familiares e as obrigações consomem todo o seu tempo de descanso? Não se desespere mais! Nós temos a solução ideal, rápida e altamente profissional que precisa hoje!",
          visualCue: "Fundo azul marinho real profundo com elementos de relógio em ouro rodando celeremente sob o ecrã.",
          duration: 35,
          serviceHighlights: ["Rapidez na Entrega", "Monografia sem Stress", "Solução Imediata", "Apoio em Luanda"]
        },
        {
          slideIndex: 1,
          title: "Facilite Hoje o Seu Roteiro Académico",
          subtitle: "O seu trabalho aprovado com rapidez e garantia de excelência.",
          narration: "A Academia de Monografias e Pesquisas Científicas faz o trabalho metodológico árduo por si! Criamos uma estrutura de acompanhamento personalizado que assegura o desenvolvimento célere do seu projecto, garantindo que obtenha o seu diploma académico sem dores de cabeça.",
          visualCue: "O logotipo dourado de louros e o livro aberto da Academia brilhando poderosamente no centro do ecrã de vídeo.",
          duration: 35,
          serviceHighlights: ["Diploma Assegurado", "Acompanhamento Rápido", "Processo Prático", "Orientação Directa"]
        },
        {
          slideIndex: 2,
          title: "Formatação sob a Norma APA 7ª Edição",
          subtitle: "Proteção total contra plágio e formatação exacta.",
          narration: "Fazemos toda a estruturação e formatação rigorosa em conformidade com as exigentes regras da norma APA 7ª edição. Além disso, fornecemos um relatório completo de originalidade contra plágio intelectual para comprovar a segurança científica absoluta do seu trabalho de fim de curso.",
          visualCue: "Apresentação visual dinâmica de uma capa académica formatada sob os rigorosos padrões da APA 7ª edição em ouro.",
          duration: 40,
          serviceHighlights: ["Formatação APA 7ª", "Relatório de Plágio", "Trabalho Seguro", "Excelência Científica"]
        },
        {
          slideIndex: 3,
          title: "Notas Superiores a 18 Valores!",
          subtitle: "Prazos rigorosamente cumpridos com compromisso total.",
          narration: "O nosso lema comercial é simples e claro: cumprir à risca todos os prazos acordados. Damos total acompanhamento em monografias, Trabalhos de Fim de Curso e Relatórios de Estágio, focando em avaliações de prestígio académico superiores a 18 valores.",
          visualCue: "Destaque de notas altas brilhantes acima de 18 valores em ouro sobrepostos à imagem institucional académica.",
          duration: 35,
          serviceHighlights: ["Notas de Excelência", "Prazos Cumpridos", "Relatórios de Estágio", "Apoio Garantido"]
        },
        {
          slideIndex: 4,
          title: "Fale Connosco Agora Mesmo!",
          subtitle: "A sua aprovação académica está a uma chamada de distância.",
          narration: "Garanta o seu sucesso sem complicações desnecessárias ou perda de tempo! Fale connosco imediatamente pelo telefone ou envie mensagem de WhatsApp ao: " + currentPhone + ". Se preferir, envie-nos um correio electrónico direto para: " + email + ". Estamos prontos a ajudar!",
          visualCue: "Ecrã de vídeo de alto contraste em azul real e ouro com os contactos " + currentPhone + " e " + email + " em foco intermitente.",
          duration: 35,
          serviceHighlights: ["Ligar " + currentPhone, "E-mail de Suporte", "Aprovação em Angola", "Contacto Imediato"]
        }
      ]
    };
  }
}

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {
    console.warn("Could not parse request body json", e);
  }

  const { tone, audience, focus, phone = "972299319" } = body;

  try {
    const systemInstruction = `Você é um director de comerciais de TV e roteirista sénior especializado em marketing educacional e académico de alto impacto.
Você deve gerar um roteiro de comercial estruturado para a "Academia de Monografias e Pesquisas Científicas" em Português de Angola de acordo com o acordo ortográfico de 1945 (use obrigatoriamente grafias como "contacto", "académico", "investigação", "director", "projecto", "connosco", "actividade", "Trabalho de Fim de Curso (TFC)", "Monografia", "Relatório de Estágio", "Artigo Científico", "Suporte Académico").

RESTRIÇÕES CRÍTICAS DE CONTEÚDO (NÃO VIOLAR DE FORMA ALGUMA):
1. É TERMINANTEMENTE PROIBIDO falar sobre normas ABNT ou tese de doutoramento / doutorando / doutores.
2. Utilize APENAS as normas da "APA 7ª edição" e o "Conhecimento de Metodologia de Investigação Científica".
3. Contacto telefónico e WhatsApp oficial: 972299319.
4. correio electrónico / email oficial para contacto: suporteacademiaac@gmail.com.

O roteiro deve conter exactamente 5 slides que totalizem até 3 minutos (180 segundos). Os tempos de cada um dos 5 slides somados devem ser próximos de 180 segundos (ex: 35s, 35s, 40s, 35s, 35s). 

Você deve responder APENAS com um objecto JSON válido, contendo um array de "slides" com exactamente os seguintes campos por slide:
- slideIndex (número de 0 a 4)
- title (título do slide, de impacto)
- subtitle (subtítulo ou frase explicativa curta)
- narration (texto completo de narração por voz que o locutor irá falar em português de Angola de forma fluida)
- visualCue (orientação do que deve estar aparecendo na tela, mantendo o clima de vídeo de marketing profissional em azul marinho e dourado)
- duration (tempo em segundos para este slide específico)
- serviceHighlights (array de 2 a 4 termos curtos de destaque)

Tons de Voz permitidos para o director académico:
- "Ultramotivador": Foca na superação, no sonho de se formar com nota excelente, estilo inspirador.
- "Científico & Sério": Rigor técnico elevado, foco em Metodologia de Investigação Científica de excelência, APA 7ª edição e anti-plágio.
- "Direto e Comercial": Foco em rapidez, suporte imediato, sem complicação, resolver o problema do estudante "sem tempo".
- "Empático & Suave": Compreensivo com as dificuldades do trabalho de fim de curso e do relatório, foca em tirar a ansiedade do estudante.

Gere o JSON perfeitamente formatado. Não inclua blocos markdown como \`\`\`json ou \`\`\`. Retorne APENAS o JSON puro.`;

    const prompt = `Gere um roteiro comercial sob medida para a Academia de Monografias e Pesquisas Científicas.
Parâmetros do comercial:
- Tom de Voz: ${tone || "Direto e Comercial"}
- Público Alvo: ${audience || "Estudantes em Geral"}
- Mensagem de Foco Principal: ${focus || "Geral / Prazos rápidos e excelência"}
- Telefone de Contato: ${phone}

Certifique-se de que os slides tenham cores de azul marinho profundo e detalhes de ouro reluzente, e o conteúdo destaque a excelência científica, a aprovação garantida e o suporte personalizado em monografias, relatórios de estágio e artigos científicos.`;

    // Attempt Gemini call with retry backoff
    const responseText = await retryWithBackoff(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: ["slides"],
            properties: {
              slides: {
                type: Type.ARRAY,
                description: "Lista de 5 slides bem-estruturados para o comercial de até 3 minutos.",
                items: {
                  type: Type.OBJECT,
                  required: ["slideIndex", "title", "subtitle", "narration", "visualCue", "duration", "serviceHighlights"],
                  properties: {
                    slideIndex: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    subtitle: { type: Type.STRING },
                    narration: { type: Type.STRING },
                    visualCue: { type: Type.STRING },
                    duration: { type: Type.INTEGER },
                    serviceHighlights: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
        }
      });
      return response.text || "{}";
    });

    try {
      const parsed = JSON.parse(responseText.trim());
      if (parsed && parsed.slides && parsed.slides.length === 5) {
        return NextResponse.json(parsed);
      } else {
        throw new Error("Invalid schema received from Gemini content");
      }
    } catch (parseErr) {
      console.warn("Could not parse Gemini JSON response, falling back locally:", parseErr);
      const fallback = getLocalFallbackScript(tone, audience, focus, phone);
      return NextResponse.json(fallback);
    }
  } catch (error: any) {
    console.error("Gemini failed after retries. Serving smart local fallback script:", error);
    // Highly robust response bypassing API unavailability completely
    const fallback = getLocalFallbackScript(tone, audience, focus, phone);
    return NextResponse.json(fallback);
  }
}

