import react, { useState } from "react";

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
