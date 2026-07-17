import React from 'react';
import Hero from '../components/Hero';
import Beauty from '../components/Beauty';
import About from '../components/About';
import Services from '../components/Services';
import Destinations from '../components/Destinations';
import TourPackages from '../components/TourPackages';
import Hotels from '../components/Hotels';
import Vehicles from '../components/Vehicles';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import TripPlanner from '../components/TripPlanner';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="relative w-full">
      <Hero />
      <Beauty />
      <About />
      <Services />
      <Destinations />
      <TourPackages />
      <Hotels />
      <Vehicles />
      <Gallery />
      <Testimonials />
      <TripPlanner />
      <Footer />
    </div>
  );
}
