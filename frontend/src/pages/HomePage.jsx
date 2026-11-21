import react from "react";
import { filterJobs, useData, isPublicJob  } from "../assets/data.js";
import hero from "../assets/workplace.asset.json";
import SearchBar from "../components/jobs/SearchBar.jsx";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight,
     BriefcaseBusiness, FileText, 
     Globe2, Icon, MapPin, Sparkles, 
     SparklesIcon, Zap  } from "lucide-react";
import { JobCard } from "../components/jobs/JobCard.jsx";
import { Button } from "../components/ui/button.jsx";

export const HomePage = () => {


  const { data, error } = useData();
  const jobs = filterJobs(data.jobs, {});
  const heroUrl = hero.url;
  const categoryIcons = [BriefcaseBusiness, GraduationCap, Laptop, Globe2, Award, BookOpen];


  return (
      <><section className="hero">
          <img
              className="hero-photo"
              src={heroUrl}
              alt="Jeunes professionnels africains travaillant ensemble dans un bureau moderne" />
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
      </section><section className="section page-width">
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
                      const Icon = categoryIcons [i % categoryIcons.length] || BriefcaseBusiness;
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
          </section><section className="section bg-muted">
              <div className="page-width">
                  <div className="section-heading">
                      <div>
                          <div className="eyebrow text-muted-foreground mb-2">
                              <SparklesIcon size={13} />
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
          </section><section className="section page-width">
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
          </section><section className="cv-band">
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
          </section><section className="section page-width">
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
                      return (
                          <div key={String(title)} className="benefit-card">
                              <Icon size={27} className="text-secondary" />
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
      </>
  );
}

export default HomePage;