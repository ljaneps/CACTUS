import { NewSubtopicContentsSection } from "../components/sections/NewSubtopicContentSection";
import CheckAuth from "../components/CheckAuth";

export default function NewSubtopicContentPage() {
  return (
    <CheckAuth requireAuth={false}>
      <NewSubtopicContentsSection />
    </CheckAuth>
  );
}
