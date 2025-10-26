import { useState } from "react";
import { ButtonComponent } from "../buttons/ButtonComponent";
import { useNavigate } from "react-router-dom";

export default function CreateTopicSection() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    tema: "",
    puntos: [],
    archivo: null,
    objetivo: today,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No autenticado");

      const body = {
        tema: formData.tema,
        puntos: formData.puntos,
        archivo: formData.archivo ? formData.archivo.name : null,
        objetivo: formData.objetivo,
      };

      const response = await fetch(
        "http://localhost:8000/topics/generar-temario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Error al crear el tema: ${errText}`);
      }

      const data = await response.json();
      console.log("Tema creado con éxito:", data);
      navigate("/main");
    } catch (err) {
      console.error("❌ Error en el proceso:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-700 text-lg font-medium">Cargando temario...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-50 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-2xl space-y-9">
        <div>
          <label className="block font-semibold text-sm mb-1 uppercase">
            Tema
          </label>
          <input
            type="text"
            name="tema"
            placeholder="Nuevo tema"
            value={formData.tema}
            onChange={handleChange}
            required
            className={`w-full border rounded-md p-2 focus:ring-2 focus:outline-none ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-emerald-600"
            }`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div>
          <label className="block font-medium text-sm mb-1">
            Puntos de interés
          </label>
          <textarea
            name="puntos"
            rows="4"
            value={formData.puntos}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-medium text-sm mb-1">
            Adjuntar archivo
          </label>
          <input
            type="file"
            name="archivo"
            onChange={handleChange}
            className="block w-full text-sm text-gray-700"
          />
        </div>

        <div>
          <label className="block font-medium text-sm mb-1">
            ¿Tienes un objetivo?
          </label>
          <input
            type="date"
            name="objetivo"
            value={formData.objetivo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        <div className="flex justify-center">
          <ButtonComponent
            text="CREAR"
            icon={null}
            disabled={loading}
            onClick={handleSubmit}
            fullWidth={false}
            primary={true}>
            {loading ? "Loading..." : "CREAR"}
          </ButtonComponent>
        </div>
      </form>
    </div>
  );
}
