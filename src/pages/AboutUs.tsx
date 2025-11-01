import React from "react";

const AboutUs: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p className="text-lg text-gray-700">
        Welcome to MovieHub, your ultimate destination for everything related to
        movies. We are a passionate team of film enthusiasts dedicated to
        providing you with the latest reviews, news, and information from the
        world of cinema.
      </p>
      <p className="text-lg text-gray-700 mt-4">
        Our mission is to create a community where movie lovers can discover
        new films, share their opinions, and engage in discussions about their
        favorite movies. Whether you're a fan of blockbuster hits or indie
        gems, MovieHub has something for everyone.
      </p>
    </div>
  );
};

export default AboutUs;
