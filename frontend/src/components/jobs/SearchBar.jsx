import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export const SearchBar = ({ query = "", city = "" }) => {
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

export default SearchBar;