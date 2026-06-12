import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

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

// Complete local deterministic caption generator matching requested tone in Português de Angola (1945)
function getLocalFallbackCaption(tone: string) {
  const phone = "972299319";
  const email = "suporteacademiaac@gmail.com";
  
  if (tone === "Ultramotivador") {
    return {
      caption: `🚀 REVOLUCIONE A SUA TRAJECTÓRIA ACADÉMICA! 🎓✨\n\nSente que o seu Trabalho de Fim de Curso ou o seu Relatório de Estágio são barreiras intransponíveis? A escassez de tempo não o deixa alcançar os seus sonhos? Respire fundo e acredite na vitória! 🌟\n\nA Academia de Monografias e Pesquisas Científicas nasceu para o impulsionar ao sucesso! Oferecemos o acompanhamento técnico de excelência que o seu percurso merece.\n\nPor que escolher connosco?\n✅ Suporte e orientação passo-a-passo com tutores experientes.\n✅ Rigor absoluto sob as exigentes directrizes da norma APA 7ª edição.\n✅ Verificação minuciosa contra qualquer plágio intelectual.\n✅ Cumprimento rigoroso de todos os prazos acordados.\n\nEscreva hoje mesmo o final glorioso da sua licenciatura com notas de destaque! 🏆\n\n📞 Entre em contacto telefónico ou WhatsApp connosco: ${phone}\n✉️ Correio electrónico oficial: ${email}\n\n#TFC #Monografia #InvestigacaoCientifica #RelatorioDeEstagio #AngolaAcademica #ResultadosGarantidos #SucessoAcademico #NormasAPA7`
    };
  } else if (tone === "Científico & Sério") {
    return {
      caption: `🏛️ RIGOR METODOLÓGICO INDISPENSÁVEL NA INVESTIGAÇÃO CIENTÍFICA 🎓\n\nA excelência académica é construída através do absoluto rigor metodológico e da integridade intelectual do seu Trabalho de Fim de Curso ou Relatório de Estágio. Se as questões metodológicas ou normativas representam um obstáculo complexo, a nossa assessoria técnica especializada assegura a solidez necessária.\n\nA Academia de Monografias e Pesquisas Científicas é pautada pelo mais profundo Conhecimento de Metodologia de Investigação Científica.\n\nOs nossos serviços distinguem-se por:\n🔹 Estruturação e formatação fidedigna sob os parâmetros da APA 7ª edição.\n🔹 Protocolo analítico completo livre de plágio mecânico ou conceitual.\n🔹 Acompanhamento faseado para consistência académica superior.\n🔹 Consistência técnica voltada para pontuações de destaque acima de 18 valores.\n\nSubmeta o seu projecto com inteira convicção científica. 📊\n\n📞 Contacto oficial de apoio via WhatsApp: ${phone}\n✉️ Correio electrónico oficial: ${email}\n\n#TFC #Monografia #InvestigacaoCientifica #NormasAPA7 #RigorAntiPlagio #RelatorioDeEstagio #AngolaAcademica #ExcelenciaMetodologica`
    };
  } else if (tone === "Empático & Suave") {
    return {
      caption: `🌸 TIRE O PESO DA ANSIEDADE DOS SEUS OMBROS 🎓✨\n\nNós compreendemos perfeitamente a tremenda ansiedade que a elaboração do Trabalho de Fim de Curso ou do Relatório de Estágio traz à sua vida. As noites sem dormir e a pressão dos prazos estão a consumir a sua tranquilidade? Lembre-se de que não precisa de percorrer este caminho sozinho.\n\nA Academia de Monografias e Pesquisas Científicas acolhe as suas dificuldades com dedicação e total sensibilidade.\n\nProporcionamos um percurso sereno:\n✅ Apoio atencioso e personalizado no seu próprio ritmo de aprendizado.\n✅ Formatação minuciosa sob a norma APA 7ª edição sem complicações.\n✅ Rigorosa garantia de originalidade com relatórios anti-plágio para a sua inteira segurança.\n✅ Prazos plenamente assegurados para o seu total conforto mental.\n\nPermita-nos apoiar o seu percurso até à defesa final com total dedicação. Respire fundo! 🧘‍♀️\n\n📞 Entre em contacto amigável pelo telefone ou WhatsApp: ${phone}\n✉️ Nosso correio electrónico de suporte: ${email}\n\n#TFC #Monografia #InvestigacaoCientifica #TranquilidadeAcademica #RelatorioDeEstagio #ApoioPersonalizado #NormasAPA7 #AngolaAcademica`
    };
  } else {
    // Direto e Comercial
    return {
      caption: `🏆 SEM TEMPO PARA O SEU TRABALHO DE FIM DE CURSO? NÓS RESOLVEMOS! 🎓⚡\n\nO prazo de entrega da sua Monografia ou Relatório de Estágio está a esgotar-se e ainda não começou? A sua actividade profissional e a família não lhe deixam tempo livre? Não perca o juízo nem a sua graduação! \n\nA Academia de Monografias e Pesquisas Científicas entrega suporte ágil, seguro e profissional para o seu sucesso!\n\nTudo o que oferecemos para a sua aprovação:\n✅ Elaboração rápida sob as rígidas normas APA 7ª edição.\n✅ Blindagem total anti-plágio com relatório de originalidade correspondente.\n✅ Entrega pontual garantida de acordo com os prazos contratados.\n✅ Foco exclusivo em notas de destaque superiores a 18 valores.\n\nGaranta o seu diploma universitário sem dores de cabeça ou stress desnecessário! 🥇\n\n📞 Ligue ou envie mensagem de WhatsApp agora mesmo: ${phone}\n✉️ Correio electrónico oficial: ${email}\n\n#TFC #Monografia #InvestigacaoCientifica #RelatorioDeEstagio #AngolaAcademica #ResultadosGarantidos #EntregaRapida #NormasAPA7`
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

  const { scriptSummary, tone } = body;

  try {
    const systemInstruction = `Você é um copywriter de redes sociais de alto nível.
Crie uma legenda cativante, persuasiva e profissional em Português de Angola, de acordo com o acordo ortográfico de 1945 (use grafias como "contacto", "académico", "investigação", "projectos") para acompanhar o vídeo comercial da Academia de Monografias e Pesquisas Científicas.

RESTRIÇÕES DE CONTEÚDO IMPORTANTES:
1. É EXPRESSAMENTE PROIBIDO mencionar normas ABNT ou teses de doutoramento.
2. Utilize APENAS referências a "APA 7ª edição" e "Conhecimento de Metodologia de Investigação Científica".
3. Contacto telefónico e WhatsApp oficial: 972299319.
4. Correio electrónico oficial: suporteacademiaac@gmail.com.

A legenda deve incluir:
1. Um título chamativo em letras maiúsculas e emojis adequados.
2. Uma apresentação dos desafios dos estudantes de licenciatura ou fim de curso (como a escassez de tempo ou o stress).
3. Apresentação das soluções asseguradas pela Academia (designadamente assessoria em Trabalhos de Fim de Curso, Relatórios de Estágio, e Artigos Científicos com excelência técnica).
4. Destaque absoluto para o cumprimento rigoroso dos prazos, originalidade sem plágio e notas elevadas.
5. Chamada para acção clara impulsionando o contacto por telefone/WhatsApp: 972299319 ou email: suporteacademiaac@gmail.com.
6. Hashtags relevantes no final (como #TFC #Monografia #InvestigacaoCientifica #RelatorioDeEstagio #AngolaAcademica #ResultadosGarantidos).

Retorne a legenda devidamente estruturada com quebras de linha limpas em formato JSON.`;

    const promptText = `Gere uma legenda para redes sociais. Tom: ${tone || "Firme e Profissional"}. Detalhes do Roteiro: ${JSON.stringify(scriptSummary)}`;

    const responseText = await retryWithBackoff(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: ["caption"],
            properties: {
              caption: { type: Type.STRING, description: "A legenda final gerada pronta para copiar e colar." }
            }
          }
        }
      });
      return response.text || "{}";
    });

    try {
      const parsed = JSON.parse(responseText.trim());
      if (parsed && parsed.caption) {
        return NextResponse.json(parsed);
      } else {
        throw new Error("Invalid schema received from Gemini content for caption");
      }
    } catch (parseErr) {
      console.warn("Could not parse Gemini JSON response for caption, falling back locally:", parseErr);
      const fallback = getLocalFallbackCaption(tone);
      return NextResponse.json(fallback);
    }
  } catch (error: any) {
    console.error("Error generating caption with Gemini, falling back to smart local caption:", error);
    const fallback = getLocalFallbackCaption(tone);
    return NextResponse.json(fallback);
  }
}

