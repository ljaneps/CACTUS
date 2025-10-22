import { useState } from "react";
import { Save, Edit, Trash } from "lucide-react";

export function CardDetailComponent({
  id,
  title,
  pregunta,
  respuesta,
  onChange,
  onDelete,
}) {
  const [editando, setEditando] = useState(false);
  const [tempPregunta, setTempPregunta] = useState(pregunta);
  const [tempRespuesta, setTempRespuesta] = useState(respuesta);

  const handleSave = () => {
    if (onChange) {
      onChange(id, { pregunta: tempPregunta, respuesta: tempRespuesta });
    }
    setEditando(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4 shadow-sm bg-gradient-to-r from-primary to-secondary">
      {/* Pregunta */}
      <div className="flex-1 border rounded-md p-4 text-center text-gray-700 bg-gray-50">
        <strong>{title}</strong>
        {editando ? (
          <textarea
            value={tempPregunta}
            onChange={(e) => setTempPregunta(e.target.value)}
            placeholder="Escribe tu pregunta aquí."
            className="w-full mt-2 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        ) : (
          <p className="mt-2 text-gray-800">{pregunta || "Sin pregunta"}</p>
        )}
      </div>

      {/* Respuesta */}
      <div className="flex-1 border rounded-md p-4 bg-white text-gray-700">
        <strong>Respuesta</strong>
        {editando ? (
          <textarea
            value={tempRespuesta}
            onChange={(e) => setTempRespuesta(e.target.value)}
            placeholder="Escribe aquí la respuesta."
            className="w-full mt-2 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        ) : (
          <p className="mt-2 text-gray-800">{respuesta || "Sin respuesta"}</p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex sm:flex-col items-center justify-around sm:justify-center gap-3 sm:ml-2">
        {editando ? (
          <button
            onClick={handleSave}
            className="text-white hover:text-primary-medium"
            title="Guardar">
            <Save size={22} />
          </button>
        ) : (
          <button
            onClick={() => setEditando(true)}
            className="text-white hover:text-primary-medium"
            title="Editar">
            <Edit size={22} />
          </button>
        )}

        <button
          onClick={() => onDelete(id)}
          className="text-white hover:text-red-600"
          title="Eliminar">
          <Trash size={22} />
        </button>
      </div>
    </div>
  );
}
