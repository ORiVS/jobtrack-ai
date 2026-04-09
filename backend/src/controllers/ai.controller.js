const Anthropic = require("@anthropic-ai/sdk");
const prisma = require("../config/prisma");
const { createApplicationEvent } = require("../utils/applicationEvent.service");

// On crée le client Anthropic une seule fois
// Il lira automatiquement process.env.ANTHROPIC_API_KEY
const client = new Anthropic();

const parseJobOffer = async (req, res) => {
  try {
    const { rawOfferText, applicationId } = req.body;

    // Validation : le texte de l'offre est obligatoire
    if (!rawOfferText || rawOfferText.trim() === "") {
      return res.status(400).json({ error: "rawOfferText is required" });
    }

    // On récupère le profil de l'utilisateur connecté
    // pour personnaliser le fitScore selon ses préférences
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        targetStack: true,
        targetCity: true,
        targetContractType: true,
      },
    });

    // Le "system" explique à Claude son rôle global
    const systemPrompt = `Tu es un expert en analyse d'offres d'emploi.
Tu reçois le texte brut d'une offre d'emploi et le profil d'un candidat.
Tu dois retourner UNIQUEMENT un objet JSON valide, sans texte avant ou après.
Ne mets jamais de balises markdown ou de blocs de code autour du JSON.`;

    // Le "user" contient l'offre concrète à analyser
    const userPrompt = `Analyse cette offre d'emploi et retourne un JSON avec exactement ces champs :
{
  "company": "nom de l'entreprise (string ou null)",
  "title": "intitulé du poste (string ou null)",
  "location": "ville (string ou null)",
  "workMode": "REMOTE, HYBRID ou ONSITE (string ou null)",
  "contractType": "CDI, CDD, STAGE, ALTERNANCE, FREELANCE ou INTERNSHIP (string ou null)",
  "salaryMin": "salaire minimum en nombre entier (number ou null)",
  "salaryMax": "salaire maximum en nombre entier (number ou null)",
  "currency": "devise ex: EUR, USD (string ou null)",
  "technologies": ["array de strings avec toutes les compétences, outils et logiciels requis pour ce poste"],
  "experienceLevel": "Junior, Mid, Senior ou null",
  "summary": "résumé de l'offre en 2-3 phrases (string)",
  "fitScore": "score de compatibilité entre 0 et 100 basé sur le profil candidat (number)"
}

Profil du candidat :
- Stack cible : ${user?.targetStack || "non renseigné"}
- Ville cible : ${user?.targetCity || "non renseigné"}
- Type de contrat cherché : ${user?.targetContractType || "non renseigné"}

Texte de l'offre :
${rawOfferText}`;

    // Appel à l'API Claude
    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: userPrompt }],
      system: systemPrompt,
    });

    // Claude renvoie un tableau de "content blocks"
    // On prend le texte du premier bloc
    const rawContent = message.content[0].text;

    // On parse le JSON retourné par Claude
    // try/catch car Claude pourrait (rarement) ajouter du texte autour
    let parsedData;
    try {
      parsedData = JSON.parse(rawContent);
    } catch {
      return res.status(500).json({
        error: "L'IA n'a pas retourné un JSON valide",
        rawContent,
      });
    }

    // Si un applicationId est fourni, on logue l'événement AI_PARSED
    // dans l'historique de la candidature
    if (applicationId) {
      await createApplicationEvent(applicationId, "AI_PARSED", {
        note: `Offre analysée par l'IA. FitScore : ${parsedData.fitScore}/100`,
      });
    }

    // On retourne les données parsées au frontend
    return res.status(200).json({ data: parsedData });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { parseJobOffer };
