import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Données du sujet (extraites du PDF)
const organisation = {
  name: "entreprise",
  securityCheck: "03/10/2021",
  services: [
    {
      name: "commercial",
      securityCheck: "03/10/2021",
      services: [
        { name: "vente",        securityCheck: "14/11/2021" },
        { name: "marketing",    securityCheck: "30/06/2020" },
        {
          name: "communication",
          securityCheck: "08/03/2021",
          services: [
            { name: "design",   securityCheck: "27/07/2021" }
          ]
        }
      ]
    },
    {
      name: "technique",
      securityCheck: "24/08/2021",
      services: [
        { name: "electronique", securityCheck: "14/11/2021" },
        {
          name: "robotique",
          securityCheck: "30/06/2020",
          services: [
            { name: "mécanique",   securityCheck: "12/08/2021" },
            { name: "automatisme", securityCheck: "01/09/2021" },
            { name: "IA",          securityCheck: "07/09/2021" }
          ]
        }
      ]
    },
    {
      name: "logistique",
      securityCheck: "03/10/2021",
      // le PDF contient deux fois securityCheck pour logistique ; on tolère et on garde une seule entrée ici
      services: [
        { name: "transport",  securityCheck: "14/11/2021" },
        { name: "etiquetage", securityCheck: "30/06/2020" },
        { name: "nettoyage",  securityCheck: "05/09/2021" }
      ]
    }
  ]
};

/**
 * Retourne la liste UNIQUE des services/sous-services dont le securityCheck
 * est plus vieux que nbMonth mois (différence en MOIS calendaires, jour ignoré).
 * @param {object} data  - racine "organisation" (ou nœud) tel que dans l'énoncé
 * @param {number} nbMonth - nombre de mois
 * @param {Date} [now=new Date()] - date de référence (utile pour reproduire l'exemple)
 * @returns {string[]} noms uniques
 */
export function securityUncheckedSince(data, nbMonth, now = new Date()) {
  if (!data || typeof nbMonth !== 'number' || nbMonth <= 0) return [];

  const result = new Set();

  // Parse "JJ/MM/AAAA" -> Date
  const parseFr = (s) => {
    if (typeof s !== 'string') return null;
    const [dd, mm, yyyy] = s.split('/').map(Number);
    if (!dd || !mm || !yyyy) return null;
    return new Date(yyyy, mm - 1, dd); // mois JS: 0..11
  };

  // Différence en mois (calendaires), en ignorant le jour du mois
  const diffInMonthsIgnoringDay = (a, b) =>
    (a.getFullYear() - b.getFullYear()) * 12 + (a.getMonth() - b.getMonth());

  const walk = (node) => {
    if (!node) return;
    const last = parseFr(node.securityCheck);
    if (last && !isNaN(last)) {
      const months = diffInMonthsIgnoringDay(now, last);
      if (months >= nbMonth && node.name) result.add(node.name);
    }
    if (Array.isArray(node.services)) {
      for (const child of node.services) walk(child);
    }
  };

  walk(data);
  return Array.from(result);
}

// --- petit runner CLI ---
// node exo3.js [N=3] [NOW=YYYY-MM-DD]
// Compatibilité Windows (espaces dans le chemin) : on compare des chemins résolus
const isCli = (() => {
  try {
    const selfPath = path.resolve(fileURLToPath(import.meta.url));
    const argPath  = path.resolve(process.argv[1] ?? '');
    return selfPath === argPath;
  } catch {
    return false;
  }
})();

if (isCli) {
  const n = Number(process.argv[2] ?? 3);
  const nowArg = process.argv[3];
  const now = nowArg ? new Date(nowArg) : new Date();

  const out = securityUncheckedSince(organisation, n, now);
  console.log(JSON.stringify(out));
}

export { organisation };
