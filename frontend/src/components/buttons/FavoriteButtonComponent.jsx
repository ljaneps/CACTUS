import { useState } from "react";
import { Star } from "lucide-react";

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
      className="text-emerald-900 hover:text-primary-medium"
      title="Guardar nueva flashcard">
      <Star size={24} />
    </button>
  );
}
