import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useProducts } from '../hooks/useProducts';

const SquashShop: React.FC = () => {
  const { t } = useLanguage();
  const { products } = useProducts();

  const handlePurchase = (product: any) => {
    const message = encodeURIComponent(t('whatsappPurchaseMsg', `Hi! I'm interested in purchasing ${product.name} for ${product.price} EGP`));
    window.open(`https://wa.me/+201006115163?text=${message}`, '_blank');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="shop-particle-1"></div>
        <div className="shop-particle-2"></div>
        <div className="shop-particle-3"></div>
        <div className="shop-particle-4"></div>
        <div className="shop-particle-5"></div>
        <div className="shop-particle-6"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-blue-50/60 to-indigo-100/80"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="shop-title-container">
            <h2 className="shop-title-cinematic">
              <span className="shop-title-line-1">{t('squashShop', 'Squash Shop')}</span>
              <span className="shop-title-line-2">{t('premiumEquipment', 'Premium Equipment')}</span>
            </h2>
          </div>
          <div className="shop-subtitle-container">
            <p className="shop-subtitle-text">
              {t('shopDescription', 'Discover our curated collection of professional-grade Squash equipment and accessories.')}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="shop-grid-cinematic">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="shop-card-cinematic"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Card Glow Effect */}
              <div className="shop-card-glow"></div>
              
              {/* Card Content */}
              <div className="shop-card-content">
                {/* Product Image Container */}
                <div className="shop-image-container">
                  <div className="shop-image-wrapper">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="shop-image"
                    />
                    <div className="shop-image-overlay">
                      <div className="shop-image-glow"></div>
                    </div>
                  </div>
                  
                  {/* Product Badge */}
                  <div className="shop-product-badge">
                    <span className="shop-badge-text">{t('new', 'NEW')}</span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="shop-product-info">
                  <h3 className="shop-product-name">{product.name}</h3>
                  <p className="shop-product-description">{product.description}</p>
                  
                  {/* Product Features */}
                  <div className="shop-product-features">
                    <div className="shop-feature-item">
                      <svg className="shop-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{t('premiumQuality', 'Premium Quality')}</span>
                    </div>
                    <div className="shop-feature-item">
                      <svg className="shop-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{t('fastDelivery', 'Fast Delivery')}</span>
                    </div>
                  </div>
                </div>

                {/* Product Footer */}
                <div className="shop-product-footer">
                  <div className="shop-price-container">
                    <span className="shop-price-currency">{t('egp', 'EGP')}</span>
                    <span className="shop-price-amount">{product.price}</span>
                  </div>
                  
                  <button
                    onClick={() => handlePurchase(product)}
                    className="shop-buy-btn"
                  >
                    <span className="shop-buy-btn-text">{t('buyNow', 'Buy Now')}</span>
                    <div className="shop-buy-btn-glow"></div>
                    <svg className="shop-buy-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Hover Shimmer Effect */}
              <div className="shop-shimmer-effect"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SquashShop;
