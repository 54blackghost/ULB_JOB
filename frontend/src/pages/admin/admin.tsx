import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Plus,
  Tags,
  Building2,
  Mail,
  Settings,
  ArrowLeft,
  ArrowUpRight,
  Pencil,
  Trash2,
  Eye,
  Archive,
  Star,
  Send,
  FileText,
  Download,
  Save,
  X,
  RotateCcw,
  Check,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand, JobCard } from "@/components/ulb/public";
import {
  dataService,
  useData,
  effectiveStatus,
  statusLabels,
  displayDate,
  slugify,
  safeExternalUrl,
  countries,
  contracts,
  type Job,
  type JobStatus,
  type Category,
  type Company,
} from "@/features/jobs/store";

export function AdminLayout({
  children,
  title,
  action,
}: {
  children: ReactNode;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Brand />
        <nav aria-label="Administration">
          <Link to="/admin" activeOptions={{ exact: true }}>
            <LayoutDashboard size={17} />
            Vue d’ensemble
          </Link>
          <Link to="/admin/jobs" activeOptions={{ exact: true }}>
            <BriefcaseBusiness size={17} />
            Gestion des offres
          </Link>
          <Link to="/admin/jobs/new">
            <Plus size={17} />
            Ajouter une offre
          </Link>
          <Link to="/admin/categories">
            <Tags size={17} />
            Catégories
          </Link>
          <Link to="/admin/companies">
            <Building2 size={17} />
            Entreprises et organismes
          </Link>
          <Link to="/admin/newsletter">
            <Mail size={17} />
            Newsletter
          </Link>
          <Link to="/admin/settings">
            <Settings size={17} />
            Paramètres
          </Link>
          <Link to="/">
            <ArrowLeft size={17} />
            Retour au site
          </Link>
        </nav>
      </aside>
      <main className="admin-main">
        <div className="admin-top">
          <div>
            <p className="eyebrow text-muted-foreground mb-2">ULB JOB · ADMINISTRATION</p>
            <h1>{title}</h1>
          </div>
          {action}
        </div>
        <p className="demo-notice">
          Mode démonstration · accès non sécurisé. Les modifications restent dans ce navigateur. Ne
          renseignez aucune donnée sensible.
        </p>
        {children}
      </main>
    </div>
  );
}
function AddButton() {
  return (
    <Button asChild>
      <Link to="/admin/jobs/new">
        <Plus />
        Ajouter une offre
      </Link>
    </Button>
  );
}
function guarded(action: () => void, message: string) {
  try {
    action();
    toast.success(message);
  } catch {
    toast.error(
      "Impossible d’enregistrer les données locales. Vérifiez l’espace disponible dans le navigateur.",
    );
  }
}
type Confirmation = { title: string; text: string; action: () => void };
export function ConfirmModal({
  confirmation,
  close,
}: {
  confirmation: Confirmation | null;
  close: () => void;
}) {
  useEffect(() => {
    if (!confirmation) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [confirmation, close]);
  if (!confirmation) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-navy/60 flex items-center justify-center p-5"
      onClick={close}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        className="bg-background rounded-lg p-6 max-w-md w-full shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="text-lg font-extrabold">
          {confirmation.title}
        </h2>
        <p id="confirm-description" className="text-sm text-muted-foreground mt-3 leading-relaxed">
          {confirmation.text}
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" autoFocus onClick={close}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              confirmation.action();
              close();
            }}
          >
            <Trash2 />
            Confirmer
          </Button>
        </div>
      </div>
    </div>
  );
}
export function Dashboard() {
  const { data, error } = useData();
  const counts = (status: JobStatus) =>
    data.jobs.filter((j) => effectiveStatus(j) === status).length;
  return (
    <AdminLayout title="Vue d’ensemble" action={<AddButton />}>
      {error && <p className="text-destructive mb-5">{error}</p>}
      <div className="stat-grid">
        {[
          ["Total des offres", data.jobs.length],
          ["Offres publiées", counts("published")],
          ["Brouillons", counts("draft")],
          ["Offres archivées", counts("archived")],
          ["Offres expirées", counts("expired")],
        ].map(([label, count]) => (
          <div className="stat-card" key={label}>
            <p>{label}</p>
            <strong>{count}</strong>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <section>
          <h2 className="font-extrabold mb-5">Répartition par catégorie</h2>
          <div className="space-y-4">
            {data.categories.map((c) => {
              const count = data.jobs.filter((j) => j.category === c.name).length;
              return (
                <div key={c.id}>
                  <div className="flex justify-between text-xs mb-2">
                    <span>{c.name}</span>
                    <span>{count}</span>
                  </div>
                  <progress
                    className="w-full h-2"
                    value={count}
                    max={Math.max(1, data.jobs.length)}
                    aria-label={c.name}
                  />
                </div>
              );
            })}
          </div>
        </section>
        <section>
          <h2 className="font-extrabold mb-5">L’activité de la démonstration</h2>
          <div className="border-y border-border py-5 space-y-5">
            <p className="flex justify-between text-sm">
              <span>Offres à la une</span>
              <strong>
                {data.jobs.filter((j) => j.isFeatured && effectiveStatus(j) === "published").length}
              </strong>
            </p>
            <p className="flex justify-between text-sm">
              <span>Entreprises et organismes fictifs</span>
              <strong>{data.companies.length}</strong>
            </p>
            <p className="flex justify-between text-sm">
              <span>Inscriptions newsletter simulées</span>
              <strong>{data.subscribers.length}</strong>
            </p>
          </div>
        </section>
      </div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-extrabold">Dernières offres ajoutées</h2>
        <Button variant="link" asChild>
          <Link to="/admin/jobs">
            Tout voir
            <ArrowUpRight />
          </Link>
        </Button>
      </div>
      <JobTable jobs={data.jobs.slice(0, 5)} />
    </AdminLayout>
  );
}
export function AdminJobs() {
  const { data } = useData();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [cat, setCat] = useState("");
  const jobs = data.jobs.filter(
    (j) =>
      (!q || `${j.title} ${j.companyName} ${j.city}`.toLowerCase().includes(q.toLowerCase())) &&
      (!status || effectiveStatus(j) === status) &&
      (!cat || j.category === cat),
  );
  return (
    <AdminLayout title="Gestion des offres" action={<AddButton />}>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          className="field max-w-sm"
          aria-label="Rechercher dans les offres administrateur"
          placeholder="Rechercher un titre, une entreprise…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="field w-auto"
          aria-label="Filtrer par statut"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          {Object.entries(statusLabels).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select
          className="field w-auto"
          aria-label="Filtrer par catégorie"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          {data.categories.map((c) => (
            <option key={c.id}>{c.name}</option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">{jobs.length} offre(s)</span>
      </div>
      <JobTable jobs={jobs} />
    </AdminLayout>
  );
}
function JobTable({ jobs }: { jobs: Job[] }) {
  const [confirm, setConfirm] = useState<Confirmation | null>(null);
  const [preview, setPreview] = useState<Job | null>(null);
  const update = (j: Job, patch: Partial<Job>) =>
    guarded(
      () => dataService.saveJob({ ...j, ...patch, updatedAt: new Date().toISOString() }),
      "Offre mise à jour.",
    );
  return (
    <>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Offre & entreprise</th>
              <th>Localisation</th>
              <th>Catégorie / contrat</th>
              <th>Statut</th>
              <th>Publication</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id}>
                <td>
                  <strong className="block mb-1">{j.title}</strong>
                  <span className="text-muted-foreground">{j.companyName}</span>
                  {j.isFeatured && <Star className="inline ml-2 text-primary" size={12} />}
                </td>
                <td>
                  {j.city}
                  <span className="block text-muted-foreground mt-1">{j.country}</span>
                </td>
                <td>
                  {j.category}
                  <span className="block text-muted-foreground mt-1">{j.contractType}</span>
                </td>
                <td>
                  <span className={`tag ${effectiveStatus(j) === "published" ? "tag-new" : ""}`}>
                    {statusLabels[effectiveStatus(j)]}
                  </span>
                </td>
                <td className="whitespace-nowrap">{displayDate(j.publishedAt)}</td>
                <td>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Consulter ${j.title}`}
                      title="Consulter"
                      onClick={() => setPreview(j)}
                    >
                      <Eye />
                    </Button>
                    <Button variant="ghost" size="icon" asChild title="Modifier">
                      <Link
                        to="/admin/jobs/$id/edit"
                        params={{ id: j.id }}
                        aria-label={`Modifier ${j.title}`}
                      >
                        <Pencil />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title={j.status === "published" ? "Dépublier" : "Publier"}
                      aria-label={`${j.status === "published" ? "Dépublier" : "Publier"} ${j.title}`}
                      onClick={() =>
                        update(j, { status: j.status === "published" ? "draft" : "published" })
                      }
                    >
                      {j.status === "published" ? <FileText /> : <Send />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Archiver"
                      aria-label={`Archiver ${j.title}`}
                      onClick={() => update(j, { status: "archived" })}
                      disabled={j.status === "archived"}
                    >
                      <Archive />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title={j.isFeatured ? "Retirer de la une" : "Mettre à la une"}
                      aria-label={`Mettre en avant ${j.title}`}
                      onClick={() => update(j, { isFeatured: !j.isFeatured })}
                    >
                      <Star className={j.isFeatured ? "fill-primary text-primary" : ""} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Supprimer"
                      aria-label={`Supprimer ${j.title}`}
                      onClick={() =>
                        setConfirm({
                          title: "Supprimer cette offre ?",
                          text: `« ${j.title} » sera définitivement supprimée du stockage local.`,
                          action: () =>
                            guarded(() => dataService.deleteJob(j.id), "Offre supprimée."),
                        })
                      }
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {jobs.length === 0 && (
          <div className="empty-state text-sm">Aucune offre ne correspond aux filtres.</div>
        )}
      </div>
      <ConfirmModal confirmation={confirm} close={() => setConfirm(null)} />
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-navy/60 flex justify-center items-center p-5"
          onClick={() => setPreview(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Prévisualisation de l’offre"
            className="bg-background max-w-2xl w-full rounded-lg p-6 max-h-[85vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Prévisualisation</h2>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Fermer la prévisualisation"
                autoFocus
                onClick={() => setPreview(null)}
              >
                <X />
              </Button>
            </div>
            <JobCard job={preview} />
            <p className="text-sm leading-relaxed mt-5">{preview.description}</p>
            <p className="text-xs text-muted-foreground mt-4">
              Statut : {statusLabels[effectiveStatus(preview)]}
            </p>
            <Button variant="outline" className="mt-5" asChild>
              <Link to="/admin/jobs/$id/edit" params={{ id: preview.id }}>
                Modifier l’offre
                <Pencil />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
const urlSchema = z
  .string()
  .trim()
  .refine((v) => !v || !!safeExternalUrl(v), "Indiquez une adresse http ou https valide.");
const jobSchema = z
  .object({
    title: z.string().trim().min(3, "Le titre doit contenir au moins 3 caractères."),
    companyName: z.string().trim().min(2, "Renseignez l’entreprise."),
    companyLogo: urlSchema,
    category: z.string().min(1, "Choisissez une catégorie."),
    shortDescription: z.string().trim().min(10, "Ajoutez au moins 10 caractères."),
    description: z.string().trim().min(20, "Ajoutez au moins 20 caractères."),
    country: z.string().min(1, "Choisissez un pays."),
    city: z.string().trim().min(2, "Renseignez la ville."),
    address: z.string(),
    locationType: z.string(),
    contractType: z.string(),
    experienceLevel: z.string(),
    salaryMin: z
      .string()
      .refine(
        (v) => !v || (Number.isFinite(Number(v)) && Number(v) >= 0),
        "Le salaire doit être positif.",
      ),
    salaryMax: z
      .string()
      .refine(
        (v) => !v || (Number.isFinite(Number(v)) && Number(v) >= 0),
        "Le salaire doit être positif.",
      ),
    currency: z.string().min(1),
    applicationUrl: urlSchema,
    contactEmail: z
      .string()
      .refine((v) => !v || z.string().email().safeParse(v).success, "Email invalide."),
    deadline: z.string(),
    publishedAt: z.string().min(1, "Renseignez la date."),
    responsibilities: z.string(),
    requirements: z.string(),
    benefits: z.string(),
    isFeatured: z.boolean(),
    isUrgent: z.boolean(),
  })
  .refine((v) => !v.salaryMax || !v.salaryMin || Number(v.salaryMax) >= Number(v.salaryMin), {
    message: "Le maximum doit être supérieur ou égal au minimum.",
    path: ["salaryMax"],
  });
type FormValues = z.infer<typeof jobSchema>;
const emptyForm: FormValues = {
  title: "",
  companyName: "",
  companyLogo: "",
  category: "Emploi",
  shortDescription: "",
  description: "",
  country: "Cameroun",
  city: "",
  address: "",
  locationType: "Sur site",
  contractType: "CDI",
  experienceLevel: "Débutant / 0 à 2 ans",
  salaryMin: "",
  salaryMax: "",
  currency: "XAF",
  applicationUrl: "",
  contactEmail: "",
  deadline: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  responsibilities: "",
  requirements: "",
  benefits: "",
  isFeatured: false,
  isUrgent: false,
};
export function JobForm({ id }: { id?: string }) {
  const { data, ready } = useData();
  const navigate = useNavigate();
  const existing = data.jobs.find((j) => j.id === id);
  const [preview, setPreview] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(jobSchema), defaultValues: emptyForm });
  useEffect(() => {
    if (ready && existing)
      reset({
        ...emptyForm,
        ...existing,
        responsibilities: existing.responsibilities.join("\n"),
        requirements: existing.requirements.join("\n"),
        salaryMin: existing.salaryMin?.toString() || "",
        salaryMax: existing.salaryMax?.toString() || "",
        benefits: existing.benefits || "",
        address: existing.address || "",
      });
  }, [ready, existing, reset]);
  const values = watch();
  const makeJob = (v: FormValues, status: JobStatus): Job => {
    const today = new Date().toISOString();
    const jobId = existing?.id || crypto.randomUUID();
    return {
      ...v,
      id: jobId,
      slug: existing?.slug || `${slugify(v.title)}-${jobId.slice(0, 6)}`,
      responsibilities: v.responsibilities.split("\n").filter(Boolean),
      requirements: v.requirements.split("\n").filter(Boolean),
      salaryMin: v.salaryMin ? Number(v.salaryMin) : undefined,
      salaryMax: v.salaryMax ? Number(v.salaryMax) : undefined,
      status,
      createdAt: existing?.createdAt || today,
      updatedAt: today,
    };
  };
  const save = (status: JobStatus) =>
    handleSubmit((v) => {
      if (status === "published" && !v.applicationUrl) {
        toast.error("Renseignez le lien externe de candidature avant de publier.");
        return;
      }
      if (
        status === "published" &&
        v.deadline &&
        v.deadline < new Date().toISOString().slice(0, 10)
      ) {
        toast.error(
          "La date limite est dépassée. Choisissez une date future ou enregistrez un brouillon.",
        );
        return;
      }
      try {
        dataService.saveJob(makeJob(v, status));
        toast.success(
          status === "draft" ? "Brouillon enregistré." : "Offre publiée dans la démonstration.",
        );
        navigate({ to: "/admin/jobs" });
      } catch {
        toast.error("L’offre n’a pas pu être enregistrée.");
      }
    })();
  const input = (key: keyof FormValues, label: string, type = "text", required = false) => (
    <div key={key}>
      <label className="form-label" htmlFor={key}>
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={key}
        className="field"
        type={type}
        {...register(key)}
        aria-invalid={!!errors[key]}
      />
      {errors[key] && <p className="form-error">{errors[key]?.message}</p>}
    </div>
  );
  const textarea = (
    key: "description" | "shortDescription" | "responsibilities" | "requirements" | "benefits",
    label: string,
    rows = 4,
  ) => (
    <div className="sm:col-span-2" key={key}>
      <label className="form-label" htmlFor={key}>
        {label}
      </label>
      <textarea
        id={key}
        className="field"
        rows={rows}
        {...register(key)}
        aria-invalid={!!errors[key]}
      />
      {errors[key] && <p className="form-error">{errors[key]?.message}</p>}
    </div>
  );
  const select = (key: keyof FormValues, label: string, options: string[]) => (
    <div key={key}>
      <label className="form-label" htmlFor={key}>
        {label}
      </label>
      <select id={key} className="field" {...register(key)}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
  if (id && ready && !existing)
    return (
      <AdminLayout title="Offre introuvable">
        <Button asChild>
          <Link to="/admin/jobs">Retour aux offres</Link>
        </Button>
      </AdminLayout>
    );
  return (
    <AdminLayout
      title={id ? "Modifier l’offre" : "Ajouter une offre"}
      action={
        <Button variant="outline" onClick={() => setPreview(!preview)}>
          <Eye />
          {preview ? "Fermer l’aperçu" : "Prévisualiser"}
        </Button>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save("published");
        }}
        noValidate
      >
        <section className="form-section">
          <h2>Informations générales</h2>
          <div className="form-grid">
            {input("title", "Intitulé du poste", "text", true)}
            <div>
              <label className="form-label" htmlFor="companyName">
                Entreprise ou organisme *
              </label>
              <input
                id="companyName"
                className="field"
                list="companies"
                {...register("companyName")}
              />
              <datalist id="companies">
                {data.companies.map((c) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
              {errors.companyName && <p className="form-error">{errors.companyName.message}</p>}
            </div>
            {input("companyLogo", "URL du logo (facultatif)", "url")}
            {select(
              "category",
              "Catégorie",
              data.categories.map((c) => c.name),
            )}
            {textarea("shortDescription", "Description courte *", 2)}
            {textarea("description", "Description complète *", 6)}
            {textarea("responsibilities", "Missions (une par ligne)")}
            {textarea("requirements", "Compétences et profil recherché (un élément par ligne)")}
            {textarea("benefits", "Avantages (facultatif)", 3)}
          </div>
        </section>
        <section className="form-section">
          <h2>Localisation</h2>
          <div className="form-grid">
            {select("country", "Pays *", countries)}
            {input("city", "Ville", "text", true)}
            {input("address", "Adresse (facultatif)")}
            {select("locationType", "Mode de travail", ["Sur site", "À distance", "Hybride"])}
          </div>
        </section>
        <section className="form-section">
          <h2>Contrat & rémunération</h2>
          <div className="form-grid">
            {select("contractType", "Type de contrat", contracts)}
            {select("experienceLevel", "Niveau d’expérience", [
              "Débutant / 0 à 2 ans",
              "2 à 5 ans",
              "5 à 10 ans",
              "10 ans et plus",
              "Tous niveaux",
            ])}
            {input("salaryMin", "Salaire minimum (facultatif)", "number")}
            {input("salaryMax", "Salaire maximum (facultatif)", "number")}
            {select("currency", "Devise", ["XAF", "XOF", "EUR", "USD", "KES", "GHS", "NGN", "ZAR"])}
          </div>
        </section>
        <section className="form-section">
          <h2>Candidature</h2>
          <div className="form-grid">
            {input("applicationUrl", "URL externe de candidature", "url")}
            {input("contactEmail", "Email de contact (facultatif)", "email")}
            {input("deadline", "Date limite de candidature", "date")}
          </div>
        </section>
        <section className="form-section">
          <h2>Publication</h2>
          <div className="form-grid">
            {input("publishedAt", "Date de publication", "date", true)}
            <div className="flex flex-wrap items-center gap-6">
              <label className="text-sm flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-primary"
                  {...register("isFeatured")}
                />
                Mettre à la une
              </label>
              <label className="text-sm flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-primary"
                  {...register("isUrgent")}
                />
                Offre urgente
              </label>
            </div>
          </div>
        </section>
        {preview && (
          <section className="form-section">
            <h2>Prévisualisation non enregistrée</h2>
            <div className="max-w-md">
              <JobCard job={makeJob(values, "draft")} />
            </div>
            <p className="mt-4 text-sm whitespace-pre-line">{values.description}</p>
          </section>
        )}
        <div className="flex flex-wrap justify-end gap-3 py-7">
          <Button asChild variant="outline">
            <Link to="/admin/jobs">Annuler</Link>
          </Button>
          <Button type="button" variant="secondary" onClick={() => save("draft")}>
            <Save />
            Enregistrer comme brouillon
          </Button>
          <Button type="submit">
            <Send />
            Publier l’offre
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}
export function Directory({ type }: { type: "categories" | "companies" }) {
  const { data } = useData();
  const isCategory = type === "categories";
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("Cameroun");
  const [website, setWebsite] = useState("");
  const [confirm, setConfirm] = useState<Confirmation | null>(null);
  const entries = isCategory ? data.categories : data.companies;
  const clear = () => {
    setEditing(null);
    setName("");
    setCountry("Cameroun");
    setWebsite("");
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      toast.error("Le nom doit contenir au moins 2 caractères.");
      return;
    }
    if (entries.some((c) => c.id !== editing && c.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Ce nom existe déjà.");
      return;
    }
    if (!isCategory && website && !safeExternalUrl(website)) {
      toast.error("L’adresse du site doit commencer par http ou https.");
      return;
    }
    guarded(() => {
      const id = editing || crypto.randomUUID();
      const oldName = entries.find((c) => c.id === id)?.name;
      dataService.update((d) =>
        isCategory
          ? {
              ...d,
              categories: editing
                ? d.categories.map((c) =>
                    c.id === id ? { id, name: trimmed, slug: slugify(trimmed) } : c,
                  )
                : [...d.categories, { id, name: trimmed, slug: slugify(trimmed) }],
              jobs: oldName
                ? d.jobs.map((j) => (j.category === oldName ? { ...j, category: trimmed } : j))
                : d.jobs,
            }
          : {
              ...d,
              companies: editing
                ? d.companies.map((c) =>
                    c.id === id ? { id, name: trimmed, country, website } : c,
                  )
                : [...d.companies, { id, name: trimmed, country, website }],
              jobs: oldName
                ? d.jobs.map((j) =>
                    j.companyName === oldName ? { ...j, companyName: trimmed } : j,
                  )
                : d.jobs,
            },
      );
      clear();
    }, "Répertoire mis à jour.");
  };
  return (
    <AdminLayout title={isCategory ? "Catégories d’opportunités" : "Entreprises et organismes"}>
      <p className="text-sm text-muted-foreground mb-5">
        {isCategory
          ? "Les catégories organisent les offres et les filtres publics."
          : "Un répertoire de saisie, sans compte entreprise ni publication autonome."}
      </p>
      <form
        onSubmit={submit}
        className="flex flex-wrap gap-3 items-end border-y border-border py-6 mb-6"
      >
        <div className="flex-1 min-w-44">
          <label className="form-label" htmlFor="entry-name">
            {isCategory ? "Nom de la catégorie" : "Nom de l’organisme"}
          </label>
          <input
            id="entry-name"
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {!isCategory && (
          <>
            <div>
              <label className="form-label" htmlFor="entry-country">
                Pays
              </label>
              <select
                id="entry-country"
                className="field"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {countries.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-44">
              <label className="form-label" htmlFor="entry-website">
                Site web (facultatif)
              </label>
              <input
                id="entry-website"
                className="field"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </>
        )}
        <Button type="submit" className="h-11">
          {editing ? <Save /> : <Plus />}
          {editing ? "Enregistrer" : "Ajouter"}
        </Button>
        {editing && (
          <Button type="button" variant="outline" className="h-11" onClick={clear}>
            Annuler
          </Button>
        )}
      </form>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>{isCategory ? "Offres associées" : "Pays"}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((c) => (
              <tr key={c.id}>
                <td className="font-bold">{c.name}</td>
                <td>
                  {isCategory
                    ? data.jobs.filter((j) => j.category === c.name).length
                    : (c as Company).country}
                </td>
                <td>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Modifier ${c.name}`}
                      title="Modifier"
                      onClick={() => {
                        setEditing(c.id);
                        setName(c.name);
                        if (!isCategory) {
                          setCountry((c as Company).country);
                          setWebsite((c as Company).website);
                        }
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Supprimer ${c.name}`}
                      title="Supprimer"
                      onClick={() => {
                        const inUse = data.jobs.some((j) =>
                          isCategory ? j.category === c.name : j.companyName === c.name,
                        );
                        if (inUse) {
                          toast.error(
                            "Cet élément est utilisé par une offre. Modifiez ou supprimez d’abord les offres associées.",
                          );
                          return;
                        }
                        setConfirm({
                          title: `Supprimer ${c.name} ?`,
                          text: "Cette suppression est définitive dans votre navigateur.",
                          action: () =>
                            guarded(
                              () =>
                                dataService.update((d) =>
                                  isCategory
                                    ? {
                                        ...d,
                                        categories: d.categories.filter((e) => e.id !== c.id),
                                      }
                                    : { ...d, companies: d.companies.filter((e) => e.id !== c.id) },
                                ),
                              "Élément supprimé.",
                            ),
                        });
                      }}
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {entries.length === 0 && <p className="empty-state">Le répertoire est vide.</p>}
      </div>
      <ConfirmModal confirmation={confirm} close={() => setConfirm(null)} />
    </AdminLayout>
  );
}
export function AdminNewsletter() {
  const { data } = useData();
  const [q, setQ] = useState("");
  const [confirm, setConfirm] = useState<Confirmation | null>(null);
  const rows = data.subscribers.filter((s) => s.email.includes(q.toLowerCase()));
  const exportCsv = () => {
    const escape = (s: string) => `"${s.replaceAll('"', '""')}"`;
    const csv =
      "\uFEFFemail,date\n" +
      rows.map((s) => `${escape(s.email)},${escape(s.createdAt)}`).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "ulb-job-newsletter-demo.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export de la newsletter téléchargé.");
  };
  return (
    <AdminLayout
      title="Newsletter"
      action={
        <Button variant="outline" disabled={!rows.length} onClick={exportCsv}>
          <Download />
          Exporter CSV
        </Button>
      }
    >
      <p className="text-sm text-muted-foreground mb-6">
        {data.subscribers.length} inscription(s) simulée(s). Aucun email n’est envoyé.
      </p>
      <input
        className="field max-w-sm mb-5"
        aria-label="Rechercher un email"
        placeholder="Rechercher une adresse email…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Date d’inscription</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id}>
                <td>{s.email}</td>
                <td>{new Date(s.createdAt).toLocaleDateString("fr-FR")}</td>
                <td>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Supprimer l’inscription ${s.email}`}
                    onClick={() =>
                      setConfirm({
                        title: "Supprimer cette inscription ?",
                        text: "L’adresse sera retirée de la newsletter simulée.",
                        action: () =>
                          guarded(
                            () =>
                              dataService.update((d) => ({
                                ...d,
                                subscribers: d.subscribers.filter((x) => x.id !== s.id),
                              })),
                            "Inscription supprimée.",
                          ),
                      })
                    }
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && (
          <div className="empty-state">
            <Mail className="mx-auto mb-3" />
            <p>Aucune inscription pour le moment.</p>
            <p className="mt-2 text-xs">Les inscriptions simulées du site apparaîtront ici.</p>
          </div>
        )}
      </div>
      <ConfirmModal confirmation={confirm} close={() => setConfirm(null)} />
    </AdminLayout>
  );
}
export function AdminSettings() {
  const { data, ready } = useData();
  const [settings, setSettings] = useState(data.settings);
  const [confirm, setConfirm] = useState<Confirmation | null>(null);
  useEffect(() => {
    if (ready) setSettings(data.settings);
  }, [ready, data.settings]);
  return (
    <AdminLayout title="Paramètres">
      <form
        className="max-w-2xl"
        onSubmit={(e) => {
          e.preventDefault();
          if (
            Object.entries(settings).some(
              ([key, value]) => key !== "contactEmail" && value && !safeExternalUrl(value),
            )
          ) {
            toast.error("Les liens doivent être des adresses http ou https valides.");
            return;
          }
          guarded(() => dataService.update((d) => ({ ...d, settings })), "Paramètres enregistrés.");
        }}
      >
        <h2 className="font-extrabold mb-6">Liens et coordonnées</h2>
        {(
          [
            ["cvUrl", "CV_BUILDER_URL — Service externe de création de CV"],
            ["contactEmail", "Email de contact"],
            ["whatsapp", "Lien WhatsApp"],
            ["linkedin", "Lien LinkedIn"],
          ] as const
        ).map(([key, label]) => (
          <div className="mb-5" key={key}>
            <label className="form-label" htmlFor={key}>
              {label}
            </label>
            <input
              id={key}
              className="field"
              type={key === "contactEmail" ? "email" : "url"}
              value={settings[key]}
              onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
            />
          </div>
        ))}
        <Button type="submit">
          <Save />
          Enregistrer les paramètres
        </Button>
      </form>
      <section className="border-t border-border mt-10 pt-8">
        <h2 className="font-extrabold mb-3">Réinitialiser la démonstration</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Restaure les offres initiales et efface les modifications, les inscriptions et les
          paramètres locaux.
        </p>
        <Button
          variant="destructive"
          onClick={() =>
            setConfirm({
              title: "Réinitialiser toutes les données ?",
              text: "Toutes vos modifications et inscriptions locales seront supprimées. Cette action ne peut pas être annulée.",
              action: () => guarded(() => dataService.reset(), "Démonstration réinitialisée."),
            })
          }
        >
          <RotateCcw />
          Réinitialiser
        </Button>
      </section>
      <ConfirmModal confirmation={confirm} close={() => setConfirm(null)} />
    </AdminLayout>
  );
}
