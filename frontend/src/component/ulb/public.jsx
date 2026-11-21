import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Laptop,
  Globe2,
  Award,
  BookOpen,
  MapPin,
  Search,
  Menu,
  X,
  FileText,
  Sparkles,
  Check,
  Clock3,
  Building2,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Copy,
  Send,
  Linkedin,
  Mail,
  ShieldCheck,
  Zap,
  Users,
  Target,
} from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import hero from "../../assets/workplace.asset.json";
import {
  useData,
  dataService,
  filterJobs,
  effectiveStatus,
  canApply,
  isPublicJob,
  displayDate,
  countries,
  contracts,
  categoryNames,
  safeExternalUrl,
} from "../../assets/data";

export const heroUrl = hero.url;
export const pageHead = (title, description, image) => ({
  meta: [
    { title: `${title} | ULB JOB` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} | ULB JOB` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    ...(image
      ? [
          { property: "og:image", content: image },
          { name: "twitter:image", content: image },
        ]
      : []),
  ],
});
export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="ULB JOB — Accueil">
      <span className="brand-mark">
        <BriefcaseBusiness size={23} strokeWidth={2.1} />
      </span>
      <span>
        ULB <em>JOB</em>
        <span className="sr-only">, opportunités africaines</span>
      </span>
    </Link>
  );
}
export function PublicLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { data } = useData();
  const nav = (
    <>
      <Link to="/" activeOptions={{ exact: true }}>
        Accueil
      </Link>
      <Link to="/jobs">Offres d’emploi</Link>
      <Link to="/stages">Stages</Link>
      <Link to="/freelance">Freelance</Link>
      <Link to="/career-advice">Conseils carrière</Link>
    </>
  );
  return (
    <>
      <header className="site-header">
        <div className="page-width header-inner">
          <Brand />
          <nav className="nav-links" aria-label="Navigation principale">
            {nav}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild className="hidden sm:inline-flex h-10 text-xs">
              <Link to="/create-cv">
                <FileText />
                Créer mon CV
                <ArrowUpRight />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </header>
      {open && (
        <nav className="mobile-nav" aria-label="Navigation mobile" onClick={() => setOpen(false)}>
          {nav}
          <Link to="/create-cv">Créer mon CV</Link>
        </nav>
      )}
      <main>{children}</main>
      <Newsletter />
      <footer className="site-footer">
        <div className="page-width">
          <div className="footer-grid">
            <div>
              <Brand />
              <p className="mt-4 max-w-xs">
                Le talent africain mérite les meilleures opportunités. Emplois, stages et nouveaux
                horizons, au Cameroun et partout en Afrique.
              </p>
              <p className="mt-3">Offres et organismes de démonstration.</p>
            </div>
            <div>
              <h3>Explorer</h3>
              <div className="grid gap-1">
                <Link to="/jobs">Offres d’emploi</Link>
                <Link to="/stages">Stages</Link>
                <Link to="/freelance">Freelance</Link>
                <Link to="/career-advice">Conseils carrière</Link>
              </div>
            </div>
            <div>
              <h3>Opportunités</h3>
              <div className="grid gap-1">
                <Link to="/remote">Télétravail</Link>
                <Link to="/jobs" search={{ category: "Bourses" }}>
                  Bourses
                </Link>
                <Link to="/jobs" search={{ category: "Formations" }}>
                  Formations
                </Link>
                <Link to="/create-cv">Créer mon CV</Link>
              </div>
            </div>
            <div>
              <h3>Restons en contact</h3>
              <div className="grid gap-1">
                <Link to="/contact">Contact</Link>
                {safeExternalUrl(data.settings.linkedin) && (
                  <a href={data.settings.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                )}
                {safeExternalUrl(data.settings.whatsapp) && (
                  <a href={data.settings.whatsapp} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                )}
                <Link to="/admin">Administration démo</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} ULB JOB. Tous droits réservés.</span>
            <div className="flex flex-wrap gap-5">
              <Link to="/privacy">Politique de confidentialité</Link>
              <Link to="/terms">Conditions d’utilisation</Link>
              <span>Fait pour les talents africains.</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  function submit(e) {
    e.preventDefault();
    try {
      const normalized = email.trim().toLowerCase();
      if (dataService.get().subscribers.some((s) => s.email === normalized)) {
        toast.info("Cette adresse est déjà inscrite dans la démonstration.");
        setDone(true);
        return;
      }
      dataService.update((d) => ({
        ...d,
        subscribers: [
          ...d.subscribers,
          { id: crypto.randomUUID(), email: normalized, createdAt: new Date().toISOString() },
        ],
      }));
      setDone(true);
      toast.success("Inscription de démonstration enregistrée. Aucun email ne sera envoyé.");
    } catch {
      toast.error("L’inscription locale n’a pas pu être enregistrée.");
    }
  }
  return (
    <section className="newsletter">
      <div className="page-width newsletter-inner">
        <div>
          <div className="flex items-center gap-3">
            <Mail className="text-secondary" size={24} />
            <h2>La bonne opportunité, au bon moment.</h2>
          </div>
          <p>
            Les nouvelles opportunités dans ta boîte mail. Inscription simulée pour cette
            démonstration.
          </p>
        </div>
        <form onSubmit={submit}>
          <input
            className="field"
            type="email"
            aria-label="Votre adresse email"
            placeholder="Ton adresse email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setDone(false);
            }}
          />
          <Button type="submit" className="h-11">
            {done ? (
              <>
                <Check />
                Inscrit
              </>
            ) : (
              <>
                M’inscrire
                <ArrowRight />
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
export function SearchBar({ query = "", city = "" }: { query?: string; city?: string }) {
  const [q, setQ] = useState(query);
  const [location, setLocation] = useState(city);
  const navigate = useNavigate();
  return (
    <form
      className="search-bar"
      onSubmit={(e) => {
        e.preventDefault();
        navigate({ to: "/jobs", search: { q, city: location } });
      }}
    >
      <div className="search-field">
        <Search />
        <input
          aria-label="Intitulé du poste ou compétence"
          placeholder="Intitulé du poste, entreprise ou compétence"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="search-field location">
        <MapPin />
        <input
          aria-label="Localisation"
          placeholder="Ville, ex. Douala"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <Button type="submit">
        Rechercher une opportunité
        <ArrowRight />
      </Button>
    </form>
  );
}
export function JobCard({ job }: { job: Job }) {
  const status = effectiveStatus(job);
  const recent =
    status === "published" && (Date.now() - Date.parse(job.publishedAt)) / 86400000 < 7;
  return (
    <article className={`job-card ${job.isFeatured ? "featured" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="company-avatar">
          {job.companyLogo && safeExternalUrl(job.companyLogo) ? (
            <img src={job.companyLogo} alt={job.companyName} />
          ) : (
            job.companyName
              .split(" ")
              .map((s) => s[0])
              .slice(0, 2)
              .join("")
          )}
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          {status === "expired" ? (
            <span className="tag">Expirée</span>
          ) : recent ? (
            <span className="tag tag-new">Nouveau</span>
          ) : null}
          {job.isFeatured && (
            <span className="tag tag-featured">
              <Sparkles size={10} />À la une
            </span>
          )}
        </div>
      </div>
      <h3>
        <Link to="/jobs/$slug" params={{ slug: job.slug }}>
          {job.title}
        </Link>
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">{job.companyName}</p>
      <div className="job-meta mt-4">
        <MapPin />
        {job.city}, {job.country}
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="tag">{job.contractType}</span>
        <span className="tag">{job.category}</span>
        {job.locationType !== "Sur site" && <span className="tag">{job.locationType}</span>}
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-border mt-5 pt-4">
        <span className="job-meta">
          <Clock3 />
          {displayDate(job.publishedAt).replace(" 2026", "")}
        </span>
        <Link className="section-link" to="/jobs/$slug" params={{ slug: job.slug }}>
          Voir l’offre
          <ArrowUpRight />
        </Link>
      </div>
      {job.deadline && (
        <p className="text-[10px] text-muted-foreground mt-3">
          Date limite : {displayDate(job.deadline)}
        </p>
      )}
    </article>
  );
}
const categoryIcons = [BriefcaseBusiness, GraduationCap, Laptop, Globe2, Award, BookOpen];
export function HomePage() {
  const { data, error } = useData();
  const jobs = filterJobs(data.jobs, {});
  return (
    <PublicLayout>
      <section className="hero">
        <img
          className="hero-photo"
          src={heroUrl}
          alt="Jeunes professionnels africains travaillant ensemble dans un bureau moderne"
        />
        <div className="hero-shade" />
        <div className="page-width hero-content">
          <div className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            DES TALENTS. DES OPPORTUNITÉS. UN CONTINENT.
          </div>
          <h1>
            Le prochain chapitre
            <br />
            de ta carrière
            <br />
            <span>commence ici.</span>
          </h1>
          <p className="hero-description">
            Découvre des offres d’emploi, des stages et des opportunités professionnelles au
            Cameroun et partout en Afrique.
          </p>
          <SearchBar />
          <div className="quick-links">
            <span className="mr-1 opacity-70">À la recherche de :</span>
            <Link to="/jobs">Emploi</Link>
            <Link to="/stages">Stage</Link>
            <Link to="/freelance">Freelance</Link>
            <Link to="/remote">Télétravail</Link>
          </div>
          <div className="hero-note">Le talent africain mérite les meilleures opportunités.</div>
        </div>
      </section>
      <section className="section page-width">
        <div className="section-heading">
          <div>
            <h2>À chaque ambition, son opportunité.</h2>
            <p>Explore les possibilités qui te ressemblent.</p>
          </div>
          <span className="hidden sm:flex text-[10px] text-muted-foreground items-center gap-2">
            <Globe2 size={14} />
            Cameroun & Afrique
          </span>
        </div>
        <div className="category-grid">
          {data.categories.map((c, i) => {
            const Icon = categoryIcons[i % categoryIcons.length] || BriefcaseBusiness;
            return (
              <Link key={c.id} to="/jobs" search={{ category: c.name }} className="category-card">
                <div className="category-icon">
                  <Icon size={22} />
                </div>
                <h3>{c.name}</h3>
                <p>
                  {data.jobs.filter((j) => isPublicJob(j) && j.category === c.name).length}{" "}
                  opportunités démo
                </p>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="section bg-muted">
        <div className="page-width">
          <div className="section-heading">
            <div>
              <div className="eyebrow text-muted-foreground mb-2">
                <Sparkles size={13} />
                NOTRE SÉLECTION
              </div>
              <h2>Les opportunités à ne pas manquer</h2>
              <p>Une nouvelle étape t’attend peut-être ici.</p>
            </div>
            <Link to="/jobs" className="section-link">
              Toutes les offres
              <ArrowRight />
            </Link>
          </div>
          {error && <p className="demo-notice">{error}</p>}
          <div className="job-grid">
            {jobs
              .filter((j) => j.isFeatured)
              .slice(0, 3)
              .map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
          </div>
        </div>
      </section>
      <section className="section page-width">
        <div className="section-heading">
          <div>
            <h2>Les dernières opportunités</h2>
            <p>Des annonces de démonstration pour découvrir ULB JOB.</p>
          </div>
          <Link to="/jobs" className="section-link">
            Tout explorer
            <ArrowRight />
          </Link>
        </div>
        <div className="job-grid">
          {jobs
            .filter((j) => !j.isFeatured)
            .slice(0, 6)
            .map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" asChild className="h-11">
            <Link to="/jobs">
              Voir toutes les opportunités
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
      <section className="cv-band">
        <div className="page-width cv-inner">
          <div>
            <div className="eyebrow text-primary">
              <FileText size={14} />
              PRÊT POUR LA SUITE ?
            </div>
            <h2>Ton CV est ton premier ambassadeur.</h2>
            <p>Prépare un CV professionnel et donne plus de force à tes candidatures.</p>
            <Button asChild className="mt-6 h-11 text-xs">
              <Link to="/create-cv">
                Créer mon CV maintenant
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
          <div className="cv-paper" aria-hidden="true">
            <div className="flex gap-2 items-center">
              <div className="h-7 w-7 rounded-full bg-info-soft" />
              <div>
                <div className="h-2 w-12 bg-secondary" />
                <div className="h-1 w-8 bg-primary mt-2" />
              </div>
            </div>
            <div className="paper-line mt-6" />
            <div className="paper-line" />
            <div className="h-1 w-12 bg-primary mt-5" />
            <div className="paper-line" />
            <div className="paper-line" />
            <div className="paper-line" />
          </div>
        </div>
      </section>
      <section className="section page-width">
        <div className="section-heading">
          <div>
            <h2>Avançons ensemble.</h2>
            <p>La recherche d’opportunités, en plus simple.</p>
          </div>
        </div>
        <div className="benefit-grid">
          {[
            [
              Globe2,
              "Des opportunités centralisées",
              "Emplois, stages, missions et formations réunis au même endroit.",
            ],
            [
              Zap,
              "Une recherche simple et rapide",
              "Trouve les annonces qui correspondent à ton profil et à tes envies.",
            ],
            [
              MapPin,
              "Le Cameroun et toute l’Afrique",
              "Des perspectives près de chez toi, et au-delà des frontières.",
            ],
            [
              ArrowUpRight,
              "Un accès direct aux candidatures",
              "Consulte l’annonce et rejoins directement le site de candidature.",
            ],
          ].map(([Icon, title, text]) => {
            const I = Icon as typeof Globe2;
            return (
              <div key={St
                <I size={27} className="text-secondary" />
                <h3>{String(title)}</h3>
                <p>{String(text)}</p>
              </div>
            );
          })}
        </div>
      </section>
      <section className="section bg-muted">
        <div className="page-width">
          <div className="section-heading">
            <div>
              <h2>Un coup de pouce pour ta carrière</h2>
              <p>Les bons conseils pour faire la différence.</p>
            </div>
            <Link to="/career-advice" className="section-link">
              Tous les conseils
              <ArrowRight />
            </Link>
          </div>
          <div className="job-grid">
            {articles.slice(0, 3).map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
export function JobsPage({
  category = "",
  remote = false,
  search = {},
}: {
  category?: string;
  const [filters, setFilters] = useState<JobFilters>({
    query: search.q || "",
    country: search.country || "",
    city: search.city || "",
    category: category || search.category || "",
    remote,
  });
  const [page, setPage] = useState(1);
  useEffect(() => {
    setFilters({
      query: search.q || "",
      country: search.country || "",
      city: search.city || "",
      category: category || search.category || "",
      remote,
    });
    setPage(1);
  }, [search.q, search.country, search.city, search.category, category, remote]);
  const results = filterJobs(data.jobs, filters);
  const perPage = 6;
  const maxPage = Math.max(1, Math.ceil(results.length / perPage));
  const currentPage = Math.min(page, maxPage);
  const change = (key: keyof JobFilters, value: string | boolean) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };
  return (
    <PublicLayout>
      <section className="page-title">
        <div className="page-width">
          <div className="eyebrow text-muted-foreground mb-3">TON PROCHAIN DÉFI COMMENCE ICI</div>
          <h1>
            {remote
              ? "Les , value
              : category === "Stage"
                ? "Les stages pour prendre ton envol"
                : category === "Freelance"
                  ? "Les missions freelance"
                  : "Trouve ta prochaine opportunité"}
          </h1>
          <p>Des perspectives professionnelles au Cameroun et partout en Afrique.</p>
          <div className="search-bar w-full">
            <div className="search-field">
              <Search />
              <input
                aria-label="Rechercher les offres"
                value={filters.query || ""}
                onChange={(e) => change("query", e.target.value)}
                placeholder="Poste, entreprise ou compétence…"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="page-width search-layout">
        <aside>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-sm flex gap-2">
              <SlidersHorizontal size={17} />
              Filtres
            </h2>
            <Button
              variant="link"
              className="text-xs p-0 h-auto"
              onClick={() => {
                setFilters({ category, remote });
                setPage(1);
              }}
            >
              Réinitialiser
            </Button>
          </div>
          <div className="filters-panel">
            <Filter
              label="Pays"
              value={filters.country || ""}
              options={countries}
              onChange={(v) => change("country", v)}
              empty="Tous les pays"
            />
            <div className="filter-group">
              <label htmlFor="city-filter">Ville</label>
              <input
                id="city-filter"
                className="field"
                placeholder="Toutes les villes"
                value={filters.city || ""}
                onChange={(e) => change("city", e.target.value)}
              />
            </div>
            <Filter
              label="Catégorie"
              value={filters.category || ""}
              options={data.categories.map((c) => c.name)}
              onChange={(v) => change("category", v)}
              empty="Toutes les catégories"
            />
            <Filter
              label="Type de contrat"
              value={filters.contract || ""}
              options={contracts}
              onChange={(v) => change("contract", v)}
              empty="Tous les contrats"
            />
            <div className="filter-group">
              <label htmlFor="date-filter">Date de publication</label>
              <select
                id="date-filter"
                className="field"
                value={filters.days || ""}
                onChange={(e) => change("days", e.target.value)}
              >
                <option value="">Toutes les dates</option>
                <option value="1">Dernières 24 heures</option>
                <option value="7">7 derniers jours</option>
                <option value="30">30 derniers jours</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-xs self-start pt-2">
              <input
                type="checkbox"
                checked={!!filters.remote}
                onChange={(e) => change("remote", e.target.checked)}
                className="accent-primary h-4 w-4"
              />
              Télétravail uniquement
            </label>
          </div>
          <p className="text-[11px] text-muted-foreground mt-6 leading-relaxed">
            Les annonces et les organismes sont fictifs. Les candidatures ne sont pas actives pour
            les offres de démonstration.
          </p>
        </aside>
        <section>
          <div className="flex justify-between items-center gap-3 mb-5">
            <h2 className="text-sm font-bold">
              {results.length} opportunité{results.length > 1 ? "s" : ""}
            </h2>
            <select
              className="field max-w-44 text-xs"
              aria-label="Trier les offres"
              value={filters.sort || "date"}
              onChange={(e) => change("sort", e.target.value)}
            >
              <option value="date">Les plus récentes</option>
              <option value="relevance">Pertinence</option>
            </select>
          </div>
          {error ? (
            <div className="empty-state">
              <p>{error}</p>
              <Button variant="outline" asChild className="mt-4">
                <Link to="/admin/settings">Ouvrir les paramètres</Link>
              </Button>
            </div>
          ) : !ready ? (
            <div className="results-grid">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-md bg-muted animate-pulse" />
              ))}
            </div>
          ) : results.length ? (
            <>
              <div className="results-grid">
                {results.slice((currentPage - 1) * perPage, currentPage * perPage).map((j) => (
                  <JobCard key={j.id} job={j} />
                ))}
              </div>
              <div className="flex justify-center items-center gap-3 mt-8">
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Page précédente"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  <ChevronLeft />
                </Button>
                <span className="text-xs">
                  Page {currentPage} sur {maxPage}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Page suivante"
                  disabled={currentPage === maxPage}
                  onClick={() => setPage(currentPage + 1)}
                >
                  <ChevronRight />
                </Button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <Search className="mx-auto mb-4" size={32} />
              <h3 className="font-bold text-foreground mb-2">Aucune opportunité pour le moment</h3>
              <p className="text-sm">Essaie une autre compétence ou élargis tes filtres.</p>
              <Button variant="outline" className="mt-5" onClick={() => setFilters({})}>
                Effacer les filtres
              </Button>
            </div>
          )}
        </section>
      </div>
    </PublicLayout>
  );
}
function Filter({
  label,
  value,
  options,
  onChange,
  empty,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  empty: string;
}) {
  const id = `filter-${label.replaceAll(" ", "-")}`;
  return (
    <div className="filter-group">
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
export function JobDetail({ slug }: { slug: string }) {
  const { data, ready } = useData();
  const job = data.jobs.find((j) => j.slug === slug && isPublicJob(j));
  if (!ready)
    return (
      <PublicLayout>
        <div className="page-width section">
          <div className="h-72 animate-pulse bg-muted" />
        </div>
      </PublicLayout>
    );
  if (!job)
    return (
      <PublicLayout>
        <div className="empty-state">
          <h1 className="text-2xl font-bold">Cette offre n’est pas disponible.</h1>
          <Button asChild className="mt-5">
            <Link to="/jobs">Toute</Link>
          </Button>
        </div>
      </PublicLayout>
    );
  const expired = effectiveStatus(job) === "expired";
  const share = (platform: "whatsapp" | "linkedin") => {
    const url = encodeURIComponent(window.location.href);
    const dest =
      platform === "whatsapp"
        ? `https://wa.me/?text=${encodeURIComponent(job.title + " — ULB JOB ")}${url}`
        : `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(dest, "_blank", "noopener,noreferrer");
  };
  const similar = data.jobs
    .filter(
      (j) =>
        isPublicJob(j) &&
        j.id !== job.id &&
        (j.category === job.category || j.country === job.country),
    )
    .slice(0, 3);
  return (
    <PublicLayout>
      <section className="page-title">
        <div className="page-width">
          <Link to="/jobs" className="section-link mb-6">
            <ChevronLeft />
            Toutes les opportunités
          </Link>
          <div className="flex items-start gap-5">
            <div className="company-avatar">
              {job.companyName
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <div className="flex gap-2 mb-3">
                <span className="tag">{job.category}</span>
                {expired && <span className="tag text-destructive">Offre expirée</span>}
                {job.isFeatured && <span className="tag tag-featured">À la une</span>}
              </div>
              <h1>{job.title}</h1>
              <p>
                {job.companyName} · {job.city}, {job.country}
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="page-width detail-layout">
        <article className="prose-job">
          <p className="demo-notice">
            {job.id.startsWith("demo-")
              ? "Annonce fictive de démonstration. Aucun recrutement réel ni candidature active."
              : "Annonce enregistrée localement dans la démonstration."}
          </p>
          <h2>À propos de cette opportunité</h2>
          <p>{job.description}</p>
          <h2>Tes missions</h2>
          <ul>
            {job.responsibilities.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
          <h2>Le profil recherché</h2>
          <p>{job.experienceLevel}</p>
          <ul>
            {job.requirements.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
          {job.benefits && (
            <>
              <h2>Ce que nous proposons</h2>
              <p>{job.benefits}</p>
            </>
          )}
          {job.address && (
            <>
              <h2>Informations complémentaires</h2>
              <p>{job.address}</p>
            </>
          )}
          {job.contactEmail && (
            <p className="mt-4">
              Contact :{" "}
              <a className="underline" href={`mailto:${job.contactEmail}`}>
                {job.contactEmail}
              </a>
            </p>
          )}
        </article>
        <aside className="detail-aside">
          <h2 className="font-extrabold text-lg mb-6">L’essentiel</h2>
          {[
            [MapPin, "Localisation", `${job.city}, ${job.country}`],
            [BriefcaseBusiness, "Contrat", job.contractType],
            [Laptop, "Mode de travail", job.locationType],
            [Users, "Expérience", job.experienceLevel],
            [Clock3, "Publication", displayDate(job.publishedAt)],
            [Target, "Date limite", displayDate(job.deadline)],
          ].map(([Icon, label, value]) => {
            const I = Icon as typeof MapPin;
            return (
              <div className="flex gap-3 mb-5" key={String(label)}>
                <I className="text-muted-foreground mt-1" size={17} />
                <div>
                  <p className="text-[11px] text-muted-foreground">{String(label)}</p>
                  <p className="text-sm font-semibold mt-1">{String(value)}</p>
                </div>
              </div>
            );
          })}
          {job.salaryMin !== undefined && (
            <p className="text-sm mb-5">
              Salaire : {job.salaryMin.toLocaleString("fr-FR")}
              {job.salaryMax !== undefined
                ? ` – ${job.salaryMax.toLocaleString("fr-FR")}`
                : ""}{" "}
              {job.currenc
            </p>
          )}
          {canApply(job) ? (
            <Button className="w-full h-12" asChild>
              <a
                href={safeExternalUrl(job.applicationUrl)}
                target="_blank"
                rel="noopener noreferrer"
              >
                POSTULER MAINTENANT
                <ArrowUpRight />
              </a>
            </Button>
          ) : (
            <Button className="w-full h-12" disabled>
              {expired ? "OFFRE EXPIRÉE" : "CANDIDATURE NON DISPONIBLE"}
            </Button>
          )}
          <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
            {expired
              ? "La date limite de cette annonce est dépassée."
              : "Les candidatures s’effectuent sur le site externe fourni dans l’annonce."}
          </p>
          <div className="border-t border-border mt-6 pt-5">
            <p className="text-xs font-bold mb-3">Partager cette opportunité</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                aria-label="Partager sur WhatsApp"
                title="Partager sur WhatsApp"
                onClick={() => share("whatsapp")}
              >
                <Send />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Partager sur LinkedIn"
                title="Partager sur LinkedIn"
                onClick={() => share("linkedin")}
              >
                <Linkedin />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Copier le lien"
                title="Copier le lien"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    toast.success("Lien copié.");
                  } catch {
                    toast.error("Le lien n’a pas pu être copié.");
                  }
                }}
              >
                <Copy />
              </Button>
            </div>
          </div>
        </aside>
      </div>
      {similar.length > 0 && (
        <section className="section bg-muted">
          <div className="page-width">
            <div className="section-heading">
              <h2>D’autres opportunités pour toi</h2>
            </div>
            <div className="job-grid">
              {similar.map((j) => (
                <JobCard job={j} key={j.id} />
              ))}
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
export const articles = [
  {
    slug: "reussir-son-entretien",
    title: "Réussir son entretien : les bons réflexes",
    category: "ENTRETIEN",
    icon: Users,
    intro: "Prépare-toi avec confiance et montre ce qui fait ta différence.",
    body: [
      "Renseigne-toi sur l’organisation, ses projets et les missions du poste. Relis l’annonce et repère les compétences prioritaires.",
      "Prépare trois exemples concrets de tes expériences : une difficulté surmontée, une collaboration réussie et un résultat dont tu es fier.",
      "Entraîne-toi à présenter ton parcours en deux minutes. Une réponse claire vaut mieux qu’un discours appris par cœur.",
      "Prépare des questions sur l’équipe, les priorités du poste et les prochaines étapes. Après l’entretien, envoie un court message de remerciement.",
    ],
  },
  {
    slug: "construire-un-cv",
    title: "Un CV qui met ton talent en valeur",
    category: "CV & CANDIDATURE",
    icon: FileText,
    intro: "Un parcours clair, des expériences concrètes et un CV qui te ressemble.",
    body: [
      "Adapte le titre de ton CV au poste visé et rends tes coordonnées faciles à trouver.",
      "Présente tes expériences de la plus récente à la plus ancienne. Décris tes actions et leurs résultats sans inventer de chiffres.",
      "Sélectionne les compétences pertinentes pour l’annonce. Pour un premier emploi, les projets étudiants, stages et engagements associatifs comptent aussi.",
      "Vérifie l’orthographe, garde une mise en page lisible et exporte ton CV en PDF. Un nom de fichier clair facilite sa lecture.",
    ],
  },
  {
    slug: "recherche-emploi",
    title: "Donne un nouvel élan à ta recherche",
    category: "RECHERCHE D’EMPLOI",
    icon: Search,
    intro: "Construis une recherche ciblée et avance, une candidature à la fois.",
    body: [
      "Définis les métiers, les villes et les modes de travail qui correspondent à tes objectifs.",
      "Tiens un tableau simple de tes candidatures : poste, entreprise, date d’envoi et prochaine action.",
      "Personnalise chaque candidature en montrant le lien entre tes expériences et les besoins de l’organisation.",
      "Échange avec ton réseau, développe tes compétences et préserve des temps de repos. Une recherche régulière est plus durable qu’une course permanente.",
    ],
  },
  {
    slug: "developper-ses-competences",
    title: "Les compétences qui ouvrent des portes",
    category: "DÉVELOPPEMENT",
    icon: GraduationCap,
    intro: "Apprends, pratique et construis les compétences de demain.",
    body: [
      "Observe les compétences demandées dans les offres de ton secteur et choisis une priorité.",
      "Privilégie un apprentissage concret : un projet, une étude de cas ou un exercice régulier.",
      "Documente tes réalisations dans un portfolio et demande des retours à des personnes de confiance.",
      "Les compétences humaines sont essentielles : communication, organisation, collaboration et capacité à apprendre.",
    ],
  },
];
function ArticleCard({ article }: { article: (typeof articles)[number] }) {
  const Icon = article.icon;
  return (
    <Link to="/career-advice/$slug" params={{ slug: article.slug }} className="article-card">
      <div className="article-art">
        <Icon />
      </div>
      <p className="text-[10px] font-bold text-muted-foreground mb-2">
        {article.category} · 4 MIN DE LECTURE
      </p>
      <h3 className="font-extrabold text-base mb-2">{article.title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{article.intro}</p>
      <span className="section-link mt-4">
        Lire le conseil
        <ArrowUpRight />
      </span>
    </Link>
  );
}
export function CareerPage({ slug }: { slug?: string }) {
  const article = articles.find((a) => a.slug === slug);
  return (
    <PublicLayout>
      <section className="page-title">
        <div className="page-width">
          <div className="eyebrow text-muted-foreground mb-3">CONSEILS CARRIÈRE</div>
          <h1>{article?.title || "Fais grandir tes ambitions."}</h1>
          <p>
            {article?.intro ||
              "Des conseils concrets pour préparer ta prochaine étape professionnelle."}
          </p>
        </div>
      </section>
      {slug ? (
        <article className="page-width section max-w-3xl prose-job">
          {article ? (
            <>
              {article.body.map((p, i) => (
                <div key={p}>
                  <h2>
                    0{i + 1}.{" "}
                    {["Préparer", "Structurer", "Passer à l’action", "Aller plus loin"][i]}
                  </h2>
                  <p>{p}</p>
                </div>
              ))}
              <Button asChild className="mt-8">
                <Link to="/jobs">
                  Explorer les opportunités
                  <ArrowRight />
                </Link>
              </Button>
            </>
          ) : (
            <h2>Conseil introuvable.</h2>
          )}
          <div className="mt-8">
            <Link to="/career-advice" className="section-link">
              <ChevronLeft />
              Tous les conseils
            </Link>
          </div>
        </article>
      ) : (
        <section className="section page-width">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {articles.map((a) => (
              <ArticleCard article={a} key={a.slug} />
            ))}
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
export function CvPage() {
  const { data, ready } = useData();
  const url = safeExternalUrl(data.settings.cvUrl);
  useEffect(() => {
    if (ready && url) window.location.replace(url);
  }, [url, ready]);
  return (
    <PublicLayout>
      <div className="empty-state">
        <FileText size={40} className="mx-auto text-secondary mb-5" />
        <h1 className="font-extrabold text-3xl">Ton CV est ton premier ambassadeur.</h1>
        <p className="mt-4">
          {url
            ? "Tu vas rejoindre le service de création de CV."
            : "Le service de création de CV n’est pas encore configuré."}
        </p>
        {url && (
          <Button asChild className="mt-6">
            <a href={url} rel="noopener noreferrer">
              Créer mon CV
              <ArrowUpRight />
            </a>
          </Button>
        )}
      </div>
    </PublicLayout>
  );
}
export function InfoPage({ type }: { type: "privacy" | "terms" | "contact" }) {
  const { data } = useData();
  const titles = {
    privacy: "Politique de confidentialité",
    terms: "Conditions d’utilisation",
    contact: "Contacte ULB JOB",
  };
  return (
    <PublicLayout>
      <section className="page-title">
        <div className="page-width">
          <h1>{titles[type]}</h1>
        </div>
      </section>
      <article className="page-width section prose-job max-w-3xl">
        {type === "privacy" ? (
          <>
            <h2>Une démonstration
            <p>
              Cette version ne possède pas de comptes utilisateurs ni de services connectés. Les
              annonces administrées, les paramètres et les inscriptions simulées à la newsletter
              restent dans le stockage local de ton navigateur. Aucun email n’est envoyé.
            </p>
            <h2>Effacer les données</h2>
            <p>
              Tu peux supprimer ces données dans les paramètres de l’administration ou en effaçant
              les données du site dans ton navigateur.
            </p>
            <h2>Services externes</h2>
            <p>
              Les liens de candidature et de création de CV mènent vers des services indépendants,
              qui disposent de leurs propres règles de confidentialité.
            </p>
          </>
        ) : type === "terms" ? (
          <>
            <h2>Utilisation de la démonstration</h2>
            <p>
              ULB JOB présente une interface de découverte d’opportunités professionnelles. Les
              annonces initiales et les organismes sont fictifs, et ne doivent pas être interprétés
              comme des offres de recrutement réelles.
            </p>
            <h2>Publication et candidatures</h2>
            <p>
              Les offres sont éditorialisées par l’administrateur. Aucun compte recruteur n’est
              proposé. Les candidatures actives se font uniquement sur le site externe renseigné
              dans une annonce publiée et non expirée.
            </p>
            <h2>Administration locale</h2>
            <p>
              L’administration est accessible à tous dans cette démonstration. Elle ne constitue pas
              un espace protégé et ne doit pas contenir de données sensibles.
            </p>
          </>
        ) : (
          <>
            <h2>Une question ou une suggestion ?</h2>
            <p>Le talent africain mérite les meilleures opportunités.</p>
            {data.settings.contactEmail ? (
              <Button asChild className="mt-6">
                <a href={`mailto:${data.settings.contactEmail}`}>
                  <Mail />
                  {data.settings.contactEmail}
                </a>
              </Button>
            ) : (
              <p className="mt-5 text-muted-foreground">
                Les coordonnées de contact ne sont pas encore renseignées.
              </p>
            )}
          </>
        )}
      </article>
    </PublicLayout>
  );
}
