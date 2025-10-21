import { Trash, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CardMainTopicComponent({
  currentuser,
  id,
  title,
  description,
  date_ini,
  date_goal,
  low_percent,
  intermediate_percent,
  high_percent,
  onSelect,
  option,
  onDelete,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onSelect) {
      onSelect({
        id,
        title,
        description,
        date_ini,
        date_goal,
        low_percent,
        intermediate_percent,
        high_percent,
      });
    }
  };

  const deleteTopic = async (id) => {
    const confirmed = window.confirm("¿Seguro que deseas eliminar este tema?");
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:8000/topics/topics-by-user/${currentuser}/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar el tema: ${errorText}`);
      }
      console.log("Tema eliminado con éxito");
      if (onDelete) onDelete(id);
    } catch (error) {
      console.error("Error al eliminar el tema:", error);
    }
  };

  const addTopic = async (id) => {
    const confirmed = window.confirm(
      "¿Seguro que deseas añadir este tema a tu temario?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:8000/topics/topics-by-user/${currentuser}/${id}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al añadir el tema: ${errorText}`);
      }

      console.log("Tema añadido con éxito");
      navigate("/main");
    } catch (error) {
      console.error("Error al añadir el tema:", error);
      alert("No se pudo añadir el tema. Intenta nuevamente.");
    }
  };

  return (
    <div className="w-96 h-80 bg-white border border-gray-300 rounded-lg shadow-sm flex flex-col justify-between overflow-hidden hover:shadow-md transition">
      <div
        className="bg-gradient-to-r from-primary to-secondary text-white cursor-pointer px-4 py-4 text-center"
        onClick={handleClick}>
        <h5 className="text-lg font-bold tracking-tight">{title}</h5>
      </div>

      <div className="p-6 flex-1">
        <p className="mb-2 font-normal text-gray-700 text-justify">
          {description}
        </p>
      </div>

      <div className="flex justify-end mt-2 border-t border-gray-200 pt-3 pb-3 pr-3 gap-4">
        {option === "delete" ? (
          <button
            onClick={() => deleteTopic(id)}
            className="text-emerald-900 hover:text-primary-medium"
            title="Eliminar">
            <Trash size={22} />
          </button>
        ) : option === "add" ? (
          <button
            onClick={() => addTopic(id)}
            className="text-emerald-900 hover:text-primary-medium"
            title="Añadir">
            <Plus size={22} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
