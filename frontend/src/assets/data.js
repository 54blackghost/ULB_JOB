import { useState, useEffect } from "react";

export const countries = [
  "Cameroun",
  "Sénégal",
  "Côte d’Ivoire",
  "Gabon",
  "Rwanda",
  "Kenya",
  "Nigeria",
  "Ghana",
  "Bénin",
  "Togo",
  "Burkina Faso",
  "Mali",
  "Niger",
  "Tchad",
  "Congo",
  "RD Congo",
  "Guinée",
  "Madagascar",
  "Maroc",
  "Tunisie",
  "Algérie",
  "Afrique du Sud",
  "Égypte",
  "Éthiopie",
  "Tanzanie",
  "Ouganda",
  "Zambie",
  "Maurice",
  "Autre pays africain",
];
export const contracts = ["CDI", "CDD", "Stage", "Freelance", "Mission", "Temps partiel"];
export const categoryNames = [
  "Emploi",
  "Stage",
  "Freelance",
  "Télétravail",
  "Bourses",
  "Formations",
];
export const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const rows = [
  [
    "Développeur Frontend React",
    "Kola Technologies",
    "Cameroun",
    "Douala",
    "Emploi",
    "CDI",
    "Hybride",
    "React, TypeScript, interfaces web",
  ],
  [
    "Chargé de communication digitale",
    "Naya Studio",
    "Cameroun",
    "Yaoundé",
    "Emploi",
    "CDI",
    "Sur site",
    "Communication, réseaux sociaux, création",
  ],
  [
    "Assistant marketing & commercial",
    "AfriLink Services",
    "Cameroun",
    "Douala",
    "Stage",
    "Stage",
    "Sur site",
    "Marketing, relation client, commerce",
  ],
  [
    "UI/UX Designer",
    "Baobab Digital",
    "Sénégal",
    "Dakar",
    "Freelance",
    "Freelance",
    "À distance",
    "Figma, design, recherche utilisateur",
  ],
  [
    "Analyste financier junior",
    "Horizon Finance",
    "Côte d’Ivoire",
    "Abidjan",
    "Emploi",
    "CDD",
    "Sur site",
    "Finance, Excel, analyse de données",
  ],
  [
    "Customer Success Manager",
    "Pamoja Solutions",
    "Kenya",
    "Nairobi",
    "Télétravail",
    "CDI",
    "À distance",
    "Relation client, anglais, SaaS",
  ],
  [
    "Stage en gestion de projet",
    "Impact Afrique",
    "Cameroun",
    "Yaoundé",
    "Stage",
    "Stage",
    "Hybride",
    "Organisation, gestion de projet, communication",
  ],
  [
    "Bourse en sciences des données",
    "Institut des Talents",
    "Rwanda",
    "Kigali",
    "Bourses",
    "Mission",
    "Sur site",
    "Python, statistiques, recherche",
  ],
  [
    "Formation au développement web",
    "Campus Numérique",
    "Cameroun",
    "Douala",
    "Formations",
    "Temps partiel",
    "Hybride",
    "HTML, CSS, JavaScript",
  ],
  [
    "Rédacteur web francophone",
    "Naya Studio",
    "Gabon",
    "Libreville",
    "Freelance",
    "Freelance",
    "À distance",
    "Rédaction, SEO, français",
  ],
  [
    "Responsable des opérations",
    "AfriLink Services",
    "Cameroun",
    "Douala",
    "Emploi",
    "CDI",
    "Sur site",
    "Management, logistique, opérations",
  ],
  [
    "Assistant ressources humaines",
    "Horizon Finance",
    "Sénégal",
    "Dakar",
    "Emploi",
    "CDD",
    "Sur site",
    "RH, recrutement, administration",
  ],
  [
    "Développeur backend Python",
    "Kola Technologies",
    "Cameroun",
    "Yaoundé",
    "Emploi",
    "CDI",
    "Hybride",
    "Python, API, PostgreSQL",
  ],
  [
    "Chef de projet digital",
    "Baobab Digital",
    "Sénégal",
    "Dakar",
    "Emploi",
    "CDI",
    "Sur site",
    "Agile, communication, gestion de projet",
  ],
];
export const demoJobs = rows.map((r, i) => ({
  id: `demo-${i + 1}`,
  title: r[0],
  slug: slugify(r[0]),
  companyName: r[1],
  companyLogo: "",
  country: r[2],
  city: r[3],
  category: r[4],
  contractType: r[5],
  locationType: r[6],
  experienceLevel: i % 3 === 0 ? "2 à 5 ans" : "Débutant / 0 à 2 ans",
  shortDescription: `Rejoignez une équipe engagée et contribuez à des projets qui font grandir les talents africains.`,
  description: `Dans le cadre de son développement, ${r[1]} recherche un talent motivé pour le poste de ${r[0].toLowerCase()}. Vous évoluerez dans un environnement collaboratif, avec des missions concrètes et un accompagnement régulier. Cette annonce est une démonstration fictive : elle ne correspond pas à un recrutement réel.`,
  responsibilities: [
    "Contribuer à la réalisation des projets de l’équipe.",
    "Collaborer avec les différentes équipes et partager vos idées.",
    "Assurer la qualité des livrables et le suivi des résultats.",
  ],
  requirements: r[7].split(", "),
  currency: "XAF",
  applicationUrl: "",
  contactEmail: "",
  publishedAt: `2026-11-${String(19 - (i % 10)).padStart(2, "0")}`,
  deadline: i === 11 ? "2026-10-30" : "2026-12-30",
  status: i === 12 ? "draft" : i === 13 ? "archived" : i === 11 ? "expired" : "published",
  isFeatured: i < 3,
  isUrgent: i === 1,
  createdAt: "2026-11-19",
  updatedAt: "2026-11-19",
  benefits:
    "Accompagnement professionnel, environnement collaboratif et opportunités de développement.",
}));
export const initialData = {
  jobs: demoJobs,
  categories: categoryNames.map((name) => ({ id: slugify(name), name, slug: slugify(name) })),
  companies: [...new Set(demoJobs.map((j) => j.companyName))].map((name, i) => ({
    id: `company-${i}`,
    name,
    country: demoJobs.find((j) => j.companyName === name)?.country || "Cameroun",
    website: "",
  })),
  subscribers: [],
  settings: {
    cvUrl: import.meta.env["VITE_CV_BUILDER_URL"] || "https://ulrichleblack.com",
    contactEmail: "",
    whatsapp: "",
    linkedin: "",
  },
};
export const effectiveStatus = (
  job,
  today = new Date().toISOString().slice(0, 10),
) =>
  job.status === "published" && job.deadline && job.deadline < today ? "expired" : job.status;
export const isPublicJob = (job) => job.status === "published" || job.status === "expired";
export const safeExternalUrl = (url) => {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:" ? u.href : "";
  } catch {
    return "";
  }
};
export const canApply = (job, today) =>
  effectiveStatus(job, today) === "published" && !!safeExternalUrl(job.applicationUrl);
let snapshot = initialData;
let loaded = false;
const listeners = new Set();
const key = "ulb-job-demo-v1";
function emit() {
  listeners.forEach((fn) => fn());
}
export const dataService = {
  get: () => snapshot,
  load: () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          !Array.isArray(parsed.jobs) ||
          !Array.isArray(parsed.categories) ||
          !Array.isArray(parsed.companies) ||
          !Array.isArray(parsed.subscribers) ||
          !parsed.settings
        )
          throw new Error("Données locales invalides");
        snapshot = parsed;
      }
    } catch {
      localStorage.removeItem(key);
      snapshot = initialData;
    }
    window.addEventListener("storage", (event) => {
      if (event.key === key && event.newValue) {
        try {
          snapshot = JSON.parse(event.newValue);
          emit();
        } catch {
          /* preserve last valid state */
        }
      }
    });
    emit();
  },
  subscribe: (fn) => {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  update: (updater) => {
    const next = updater(snapshot);
    localStorage.setItem(key, JSON.stringify(next));
    snapshot = next;
    emit();
  },
  saveJob: (job) =>
    dataService.update((d) => ({
      ...d,
      jobs: d.jobs.some((j) => j.id === job.id)
        ? d.jobs.map((j) => (j.id === job.id ? job : j))
        : [job, ...d.jobs],
    })),
  deleteJob: (id) =>
    dataService.update((d) => ({ ...d, jobs: d.jobs.filter((j) => j.id !== id) })),
  reset: () => {
    localStorage.removeItem(key);
    snapshot = structuredClone(initialData);
    loaded = true;
    emit();
  },
};


export function useData() {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const unsub = dataService.subscribe(() => setData(dataService.get()));
    try {
      dataService.load();
      setData(dataService.get());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
    }
    setReady(true);
    return unsub;
  }, []);
  return { data, error, ready };
};


export function filterJobs(
  jobs,
  filters,
  today = new Date().toISOString().slice(0, 10),
) {
  const q = slugify(filters.query || "");
  return jobs
    .filter(isPublicJob)
    .filter((j) => {
      const text = slugify([j.title, j.companyName, ...j.requirements].join(" "));
      return (
        (!q || text.includes(q)) &&
        (!filters.country || j.country === filters.country) &&
        (!filters.city || slugify(j.city).includes(slugify(filters.city))) &&
        (!filters.category || j.category === filters.category) &&
        (!filters.contract || j.contractType === filters.contract) &&
        (!filters.remote || j.locationType === "À distance") &&
        (!filters.days ||
          (Date.parse(today) - Date.parse(j.publishedAt)) / 86400000 <= Number(filters.days))
      );
    })
    .sort((a, b) =>
      filters.sort === "relevance"
        ? Number(b.isFeatured) - Number(a.isFeatured)
        : b.publishedAt.localeCompare(a.publishedAt),
    );
};


export const statusLabels = {
  draft: "Brouillon",
  published: "Publié",
  archived: "Archivé",
  expired: "Expiré",
};
export const displayDate = (s) =>
  s
    ? new Date(`${s}T12:00:00`).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Non précisée";
