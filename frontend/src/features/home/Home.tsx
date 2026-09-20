import HeroSection from "./HeroSection";
import FeaturePreviewSections from "./FeaturePreviewSections";
import RecentBooksSection from "./RecentBooksSection";

const Home = () => {
    return (
        <main>
            <HeroSection />
            <FeaturePreviewSections />
            <RecentBooksSection />
        </main>
    );
};

export default Home;
