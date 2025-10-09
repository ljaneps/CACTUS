import StudyOnIcon from "../../assets/icons/icon_study_primary.svg";
import StudyOffIcon from "../../assets/icons/icon_study_secondary.svg";
import ListOnIcon from "../../assets/icons/icon_list_primary.svg";
import ListOffIcon from "../../assets/icons/icon_list_secondary.svg";
import GoOnIcon from "../../assets/icons/icon_go_primary.svg";
import GoOffIcon from "../../assets/icons/icon_go_secondary.svg";

export function CardSubTopicComponent() {
  return (
    <div className="w-96 h-72 p-6 bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-white flex flex-col justify-between">
      <div>
        <a href="#">
          <h5 className="mb-5 text-lg font-bold tracking-tight text-gray-900 dark:text-primary text-center">
            Noteworthy technology 2021
          </h5>
        </a>
        <p className="mb-2 font-normal text-gray-700 dark:text-gray-400 text-justify">
          Here are the biggest enterprise technology acquisitions of 2021 so
          far, in reverse chronological order.
        </p>
      </div>

      {/* --- BOTONES INFERIORES --- */}
      <div className="flex justify-around mt-2 border-t border-gray-200 pt-3">
        {/* Botón 1 */}
        <button className="group transition">
          <img
            src={StudyOnIcon}
            alt="Study"
            className="w-8 h-8 group-hover:hidden"
          />
          <img
            src={StudyOffIcon}
            alt="Study hover"
            className="w-8 h-8 hidden group-hover:block"
          />
        </button>

        {/* Botón 2 */}
        <button className="group transition">
          <img
            src={ListOnIcon}
            alt="List"
            className="w-8 h-8 group-hover:hidden"
          />
          <img
            src={ListOffIcon}
            alt="List hover"
            className="w-8 h-8 hidden group-hover:block"
          />
        </button>

        {/* Botón 3 */}
        <button className="group transition">
          <img src={GoOnIcon} alt="Go" className="w-8 h-8 group-hover:hidden" />
          <img
            src={GoOffIcon}
            alt="Go hover"
            className="w-8 h-8 hidden group-hover:block"
          />
        </button>
      </div>
    </div>
  );
}
