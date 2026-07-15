import HeroSection from "@/home/ui/components/HeroSection";
import SearchBar from "@/home/ui/components/SearchBar";
import CommonLayoutComponent from "@/components/layout/CommonLayoutComponent";

export default function HomePage() {
  return (
    <CommonLayoutComponent
      blobs={[
        {
          className: "pointer-events-none absolute rounded-full",
          style: {
            width: "849px",
            height: "849px",
            left: "-58px",
            top: "30px",
            background: "rgba(191, 219, 254, 0.5)",
            filter: "blur(250px)",
          },
        },
      ]}
    >
      <HeroSection />
      <section className="flex justify-center px-4 pb-24">
        <SearchBar />
      </section>
    </CommonLayoutComponent>
  );
}
