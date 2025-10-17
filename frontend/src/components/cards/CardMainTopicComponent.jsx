import { Trash } from "lucide-react";

export function CardMainTopicComponent({
  id,
  title,
  description,
  date_ini,
  date_goal,
  low_percent,
  intermediate_percent,
  high_percent,
  onSelect,
}) {
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

  const deleteTopic = (id) => {};

  return (
    <div
      className="w-96 h-72 bg-white border border-gray-300 rounded-lg shadow-sm flex flex-col justify-between overflow-hidden cursor-pointer hover:shadow-md transition"
      onClick={handleClick}>
      <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-4 text-center">
        <h5 className="text-lg font-bold tracking-tight">{title}</h5>
      </div>

      <div className="p-6 flex-1">
        <p className="mb-2 font-normal text-gray-700 text-justify">
          {description}
        </p>
      </div>

      <div className="flex justify-end mt-2 border-t border-gray-200 pt-3 pb-3 pr-3 gap-4">
        <button
          onClick={() => deleteTopic(id)}
          className="text-emerald-900 hover:text-primary-medium"
          title="Eliminar">
          <Trash size={22} />
        </button>
      </div>
    </div>
  );
}
