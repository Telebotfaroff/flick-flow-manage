import React from "react";

const ContactUs: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg text-gray-700">
        We'd love to hear from you! If you have any questions, feedback, or
        suggestions, please don't hesitate to get in touch.
      </p>
      <form className="mt-8">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
