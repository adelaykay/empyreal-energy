'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: 'Mrs. Ngozi O.',
    role: 'Business Owner, Surulere',
    content: "I was skeptical about solar at first because of the initial cost, but the 3.5kVA system has practically paid for itself. I run my frozen food business in Surulere without fear of power cuts now.",
    rating: 5,
  },
  {
    name: 'Chidi A.',
    role: 'Software Developer, Lekki Phase 1',
    content: "Engr. Adeleke was very professional. The installation team was neat, and they explained how to monitor the battery usage on the app. It handles my remote work setup perfectly.",
    rating: 5,
  },
  {
    name: 'Mr. Tunde B.',
    role: 'Pharmacy Owner, Ikeja',
    content: "Finally, a company that delivers what they promised. The batteries actually last through the night as advertised. Highly recommended for anyone tired of generator noise.",
    rating: 5,
  },
];

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="section-padding bg-gradient-to-t from-card-bg/30 to-transparent">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Client Stories</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            See what our customers say about their solar experience
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="relative min-h-[300px] flex flex-col justify-center" hover={false}>
            {/* Rating Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(currentTestimonial.rating)].map((_, i) => (
                <span key={i} className="text-accent-yellow text-2xl">★</span>
              ))}
            </div>

            {/* Content */}
            <blockquote className="text-center mb-8">
              <p className="text-text-light text-lg md:text-xl italic leading-relaxed mb-6">
                "{currentTestimonial.content}"
              </p>
              <footer>
                <div className="font-orbitron font-semibold text-primary-green mb-1">
                  {currentTestimonial.name}
                </div>
                <div className="text-text-muted text-sm">
                  {currentTestimonial.role}
                </div>
              </footer>
            </blockquote>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full border-2 border-primary-green text-primary-green hover:bg-primary-green hover:text-dark-bg transition-all duration-300 flex items-center justify-center"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-primary-green w-8'
                        : 'bg-primary-green/30 hover:bg-primary-green/50'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full border-2 border-primary-green text-primary-green hover:bg-primary-green hover:text-dark-bg transition-all duration-300 flex items-center justify-center"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
