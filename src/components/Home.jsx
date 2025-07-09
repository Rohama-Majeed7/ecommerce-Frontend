import React from "react";
import CategoryList from "./HomeComponents/CategoryList";
import Slider from "./Slider";
import HorizontalProducts from "./HomeComponents/HorizontalProducts";
import VerticalProducts from "./HomeComponents/VerticalProducts";

const Home = () => {
  return (
    <main className="w-full">
      {/* Category Navigation */}
      <section className="mb-6">
        <CategoryList />
      </section>

      {/* Hero Banner */}
      <section className="mb-6">
        <Slider />
      </section>

      {/* Horizontal Featured Products */}
      <section className="mb-8 w-11/12 mx-auto">
        <HorizontalProducts category="airpodes" heading="Top Airpods" />
        <HorizontalProducts category="Mouse" heading="Top Mouse" />
        <HorizontalProducts category="camera" heading="Top Cameras" />
      </section>

      {/* Vertical Products */}
      <section className="mb-8 w-11/12 mx-auto">
        <VerticalProducts category="mobiles" heading="Top Mobiles" />
        <VerticalProducts category="televisions" heading="Top Televisions" />
      </section>
    </main>
  );
};

export default Home;
