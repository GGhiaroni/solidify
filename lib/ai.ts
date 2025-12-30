import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateRoadmapContent(title: string, area: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
  Atue como um Tech Lead Sênior de uma Big Tech (Google/Amazon). Eu sou seu mentorado (nível Júnior/Pleno).
  
  Crie um plano de carreira técnica (Roadmap) para que eu domine: "${title}" com foco em "${area}".
  Baseie-se nos requisitos reais de vagas Sênior do LinkedIn/Indeed.

  Regras de Formato (OBRIGATÓRIO):
  1. Retorne APENAS um JSON puro. Sem markdown, sem aspas triplas.
  2. O formato deve ser um array de objetos:
     [ { "title": "...", "description": "..." } ]
  
  Regras de Conteúdo:
  1. Crie entre 7 a 15 passos estratégicos (nem muito curto, nem infinito).
  2. Ordene do "Fundamento Absoluto" até "Tópicos Avançados/Arquitetura".
  3. No campo "description", seja direto e técnico. Cite ferramentas específicas ou conceitos chave (ex: não diga apenas "estude banco de dados", diga "domine ACID, Indexing e Normalização").
  4. Idioma: Português do Brasil.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonString = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const steps = JSON.parse(jsonString);

    return steps;
  } catch (error) {
    console.error("Erro ao gerar roteiro com IA:", error);
    return null;
  }
}
