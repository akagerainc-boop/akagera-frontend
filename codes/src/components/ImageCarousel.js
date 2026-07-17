import React, { useState, useEffect } from 'react';
import '../index.css';

const carouselStyles = `
  .carousel-container {
    width: 100%;
    margin: 0;
    padding: 0;
  }

  .carousel-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: 0;
    box-shadow: none;
    background: #f0f0f0;
    width: 100%;
    height: 700px;
  }

  @media (max-width: 768px) {
    .carousel-wrapper {
      height: 500px;
    }
  }

  @media (max-width: 480px) {
    .carousel-wrapper {
      height: 400px;
    }
  }

  .carousel-slides {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .carousel-slide {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.6s ease-in-out;
    display: block;
  }

  .carousel-slide.active {
    opacity: 1;
  }

  .carousel-slides::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 100, 200, 0.6));
    z-index: 5;
  }

  .carousel-dots {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 15;
  }

  .dot {
    width: 2px;
    height: 2px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.5);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 0 2px;
  }

  .dot.active {
    background: rgba(255, 255, 255, 1);
    width: 16px;
    height: 2px;
    border-radius: 2px;
  }

  .dot:hover {
    background: rgba(255, 255, 255, 0.8);
  }

  .carousel-text-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .carousel-text-content {
    text-align: center;
    color: white;
    font-family: 'Montserrat', sans-serif;
  }

  .carousel-description {
    font-size: 2.8rem;
    font-weight: 700;
    text-shadow: 2px 2px 12px rgba(0, 0, 0, 0.85);
    margin: 0;
    padding: 0 40px;
    letter-spacing: 0.5px;
    line-height: 1.3;
  }

  @media (max-width: 768px) {
    .carousel-description {
      font-size: 1.5rem;
      padding: 0 20px;
    }
  }

  @media (max-width: 480px) {
    .carousel-description {
      font-size: 1rem;
      padding: 0 15px;
    }
  }
`;

// Defined once, outside the component. A default parameter like `images = []`
// creates a NEW array reference on every render if no prop is passed, which
// was causing the fetch effect (keyed on [images]) to re-fire on every
// parent re-render, flashing "loading" state and hiding the images.
// Using a stable module-level reference fixes that.
const EMPTY_IMAGES = [];

const ImageCarousel = ({ images = EMPTY_IMAGES, autoSlide = true, interval = 5000, showDescriptions = false, descriptions = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(autoSlide);
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch images from database on mount
  useEffect(() => {
    const API_BASE_URL = (process.env.REACT_APP_API_URL || 'https://akagerainc-9vkh.onrender.com/api').replace(/\/$/, '');
    const buildImageUrl = (imagePath) => {
      if (!imagePath) return null;
      if (/^https?:\/\//.test(imagePath)) return imagePath;
      const baseUrl = API_BASE_URL.replace(/\/api$/, '');
      const normalized = imagePath.replace(/\\/g, '/').replace(/^\/+/, '');
      return `${baseUrl}/${normalized.startsWith('uploads/') ? normalized : `uploads/${normalized}`}`;
    };

    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/admin-xyz789-control/images?password=Admin@Akagera2024!`);
        if (response.ok) {
          const data = await response.json();
          const serverImages = (data.images || []).filter((img) => img.is_active !== false);
          if (serverImages.length > 0) {
            const mappedImages = serverImages.map((img) => ({
              id: img.id,
              url: buildImageUrl(img.url || img.image_path || img.path),
              alt: img.alt_text || img.filename || 'Carousel Image',
              description: img.alt_text || img.filename || '',
            })).filter((img) => img.url);

            if (mappedImages.length > 0) {
              setCarouselImages(mappedImages);
              setLoading(false);
              return;
            }
          }
        }
      } catch (error) {
        console.error('Error fetching carousel images:', error);
      }
      // Fallback to provided images or defaults
      const defaultImages = [
        {
          url: 'https://via.placeholder.com/1200x400/0B3C5D/FFFFFF?text=Akagera+Inc',
          alt: 'Akagera Inc',
          description: 'Akagera Inc delivers real, innovative mobile solutions tailored for Africa. Our platforms empower businesses and individuals with technology that makes a difference.'
        },
        {
          url: 'https://via.placeholder.com/1200x400/06D6A0/FFFFFF?text=Mobile+Apps',
          alt: 'Mobile Apps',
          description: 'Explore our suite of mobile apps designed for productivity, education, and seamless digital experiences. We turn ideas into reality for a smarter tomorrow.'
        },
        {
          url: 'https://via.placeholder.com/1200x400/F77F00/FFFFFF?text=Best+Experience',
          alt: 'Best Experience',
          description: 'Experience top quality service, robust support, and a commitment to excellence. Akagera Inc is your trusted partner in digital transformation.'
        },
      ];
      setCarouselImages(images.length > 0 ? images : defaultImages);
      setLoading(false);
    };

    fetchImages();
    const handleImagesUpdated = () => fetchImages();
    window.addEventListener('carousel-images-updated', handleImagesUpdated);

    return () => {
      window.removeEventListener('carousel-images-updated', handleImagesUpdated);
    };
  }, [images]);

  // Auto-slide effect
  useEffect(() => {
    if (!isAutoSliding || carouselImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoSliding, interval, carouselImages.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoSliding(false);
    // Resume auto-slide after 10 seconds of inactivity
    setTimeout(() => setIsAutoSliding(autoSlide), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
    setIsAutoSliding(false);
    setTimeout(() => setIsAutoSliding(autoSlide), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    setIsAutoSliding(false);
    setTimeout(() => setIsAutoSliding(autoSlide), 10000);
  };

  if (loading || carouselImages.length === 0) {
    return (
      <div className="carousel-container">
        <div className="carousel-wrapper" style={{ background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="carousel-container">
      <style>{carouselStyles}</style>
      <div className="carousel-wrapper">
        {/* Images */}
        <div className="carousel-slides">
          {carouselImages.map((image, index) => (
            <img
              key={index}
              src={image.url || ''}
              alt={image.alt || 'Carousel image'}
              className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
              style={{ objectFit: 'cover' }}
            />
          ))}
        </div>

        {/* Overlay with Text Description */}
        {showDescriptions && carouselImages[currentIndex]?.description && (
          <div className="carousel-text-overlay">
            <div className="carousel-text-content">
              <p className="carousel-description">{carouselImages[currentIndex].description}</p>
            </div>
          </div>
        )}

        {/* Dots/Indicators */}
        <div className="carousel-dots">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              className={`dot${index === currentIndex ? ' active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;