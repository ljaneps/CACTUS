import { useState } from "react";
import FavOffIcon from "../../assets/icons/icon_fav_primary.svg";
import FavOnIcon from "../../assets/icons/icon_fav_secondary.svg";

export function FavoriteButtonComponent({ apiUrl, itemId }) {
  const [selected, setSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    const newState = !selected;
    setSelected(newState); // Cambia el icono inmediatamente
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId, favorite: newState }),
      });

      if (!response.ok) throw new Error("Error al actualizar favorito");

      const data = await response.json();
      console.log("Respuesta del servidor:", data);
    } catch (error) {
      console.error(error);
      setSelected(!newState); // Revertir estado si falla
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="absolute top-3 right-3 group transition">
      {/* Icono actual */}
      <img
        src={selected ? FavOnIcon : FavOffIcon}
        alt="Favorito"
        className="w-6 h-6 group-hover:hidden"
      />

      {/* Icono hover */}
      <img
        src={selected ? FavOffIcon : FavOnIcon}
        alt="Favorito hover"
        className="w-6 h-6 hidden group-hover:block"
      />
    </button>
  );
}
