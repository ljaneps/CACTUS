import CheckAuth from "../components/CheckAuth";
import { ContentsDetailSection } from "../components/sections/ContentsDetailSection";

export default function ContentsDetaillSection() {
  return (
    <CheckAuth requireAuth={true}>
      <ContentsDetailSection />
    </CheckAuth>
  );
}
