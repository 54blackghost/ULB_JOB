import { ArrowUpRight, Clock3, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { displayDate, effectiveStatus, safeExternalUrl } from "../../assets/data.js";


export const JobCard = ({ job }) => {
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

export default JobCard;