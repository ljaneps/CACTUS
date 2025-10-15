import { FlashcardsSection } from "../components/sections/FlashcardsSection";
import CheckAuth from "../components/CheckAuth";

export default function FlashcardsPage() {
  return (
    <CheckAuth requireAuth={true}>
      <FlashcardsSection />
    </CheckAuth>
  );
}
