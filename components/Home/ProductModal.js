"use client";

import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  Star,
  Heart,
  ShoppingCart,
  MapPin,
  Shield,
  Award,
  Package,
  Truck,
  RotateCcw,
  CreditCard,
  Zap,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addItem as addToCart,
  selectCartItems,
} from '@/store/cartSlice';
import {
  addItem as addToWishlist,
  removeItem as removeFromWishlist,
  selectWishlistItems,
} from '@/store/wishlistSlice';
import { useAuth } from '@/contexts/AuthContext';
import RazorpayPayment from '@/components/Payment/RazorpayPayment';
import toast from 'react-hot-toast';
import Image from 'next/image';

// Helper function to safely parse price strings
const parsePrice = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseInt(value.replace(/[₹,]/g, ''), 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// Main Component
const ProductModal = ({ product, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const wishlistItems = useSelector(selectWishlistItems);
  const { currentUser } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  const modalRef = useRef(null);

  // Memoized state for cart and wishlist checks
  const isInCart = cartItems.some((item) => item.id === (product && product.id));
  const isInWishlist = wishlistItems.some((item) => item.id === (product && product.id));

  // Prevent background scroll effect
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key press and click outside
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  // Render stars based on rating
  const renderStars = (rating) => (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  // Calculate discount percentage
  const price = parsePrice(product.price);
  const originalPrice = parsePrice(product.originalPrice);
  const discountPercent = originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      if (isInCart) {
        toast(`${product.name} is already in your cart.`, { icon: '🛒' });
      } else {
        dispatch(addToCart({ ...product, quantity: 1 }));
        toast.success(`${product.name} added to cart!`, { icon: '🎉' });
      }
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    if (product) {
      if (isInWishlist) {
        dispatch(removeFromWishlist(product.id));
        toast.success(`${product.name} removed from wishlist.`, { icon: '💔' });
      } else {
        dispatch(addToWishlist(product));
        toast.success(`${product.name} added to wishlist!`, { icon: '❤️' });
      }
    }
  };

  // Handle buy now
  const handleBuyNow = () => {
    if (!currentUser) {
      toast.error('Please login to continue with your purchase.');
      return;
    }
    setShowPayment(true);
  };

  // Handle payment success
  const handlePaymentSuccess = async (paymentData) => {
    try {
      const orderData = {
        orderId: paymentData.orderId,
        razorpayPaymentId: paymentData.razorpay_payment_id,
        razorpayOrderId: paymentData.razorpay_order_id,
        customerId: currentUser?.uid,
        customerEmail: currentUser?.email,
        customerName: currentUser?.displayName,
        items: paymentData.items,
        amount: paymentData.amount,
        status: 'confirmed',
        paymentStatus: 'paid',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to save order');
      }

      toast.success('Order placed successfully!', { icon: '✅' });
      setShowPayment(false);
      onClose();
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Order placed, but failed to save details. Please contact support.', { icon: '⚠️' });
    }
  };

  const handlePaymentFailure = () => {
    toast.error('Payment failed. Please try again.', { icon: '❌' });
    setShowPayment(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div ref={modalRef} className="relative bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 bg-white/90 rounded-full p-2 hover:bg-white shadow-lg transition-all duration-200 hover:scale-110"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Left - Images & Gallery */}
          <div className="lg:w-1/2 p-8">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative rounded-2xl bg-gray-100 aspect-square overflow-hidden">
                <Image
                  fill
                  loading="lazy"
                  src={product.image}
                  alt={product.name}
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">{product.badge}</span>
                <button
                  onClick={handleWishlistToggle}
                  className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                </button>
              </div>

              {/* Gallery */}
              <div className="grid grid-cols-4 gap-2">
                {product.gallery?.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-75 transition-opacity">
                    <Image
                      loading="lazy"
                      fill
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Details */}
          <div className="lg:w-1/2 p-8 space-y-6 overflow-y-auto">
            {/* Location & Title */}
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-600">{product.location}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              {renderStars(product.rating)}
              <span className="text-sm text-gray-600">{product.rating} ({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-800">₹{price.toLocaleString()}</span>
              <span className="text-xl text-gray-500 line-through">₹{originalPrice.toLocaleString()}</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">Save {discountPercent}%</span>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{product.description || "This exquisite handcrafted piece represents the finest traditions of Indian artisanship."}</p>

            {/* Key Features */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Key Features</h3>
              <ul className="grid grid-cols-1 gap-2">
                {(product.features || ["100% Handcrafted", "Authentic Traditional Design"]).map((f, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Specifications</h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                {Object.entries(product.specifications || {}).length > 0 ? (
                  Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">{key}:</span>
                      <span className="text-sm text-gray-800">{value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No specifications available.</p>
                )}
              </div>
            </div>

            {/* Artisan Info */}
            {product.artisan && (
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Meet the Artisan</h3>
                <div className="flex items-start space-x-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      fill
                      loading="lazy"
                      src={product.artisan.image}
                      alt={product.artisan.name}
                      className="object-cover border-4 border-white shadow-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{product.artisan.name}</h4>
                    <p className="text-sm text-orange-600 font-medium mb-2">{product.artisan.experience} Experience</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{product.artisan.story}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <span className="text-xs font-medium text-blue-800">Authenticity Verified</span>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <Award className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <span className="text-xs font-medium text-green-800">Quality Assured</span>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-xl">
                <Package className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <span className="text-xs font-medium text-purple-800">Secure Packaging</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={handleBuyNow}
                className="w-full bg-gradient-to-r from-[#B66E41] to-[#A05A2E] text-white py-4 rounded-xl font-bold text-lg hover:from-[#A05A2E] hover:to-[#8B4A1F] transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
              >
                <Zap className="w-5 h-5" />
                <span>Buy Now</span>
              </button>
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{isInCart ? 'Already in Cart' : 'Add to Cart'}</span>
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isInWishlist ? 'bg-red-50 border-2 border-red-500 text-red-600 hover:bg-red-100' : 'bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                <span>{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* Delivery & Payment */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center space-x-3"><Truck className="w-5 h-5 text-green-600" /><span className="text-sm text-gray-700">Free delivery on orders above ₹999</span></div>
              <div className="flex items-center space-x-3"><RotateCcw className="w-5 h-5 text-blue-600" /><span className="text-sm text-gray-700">7-day easy returns</span></div>
              <div className="flex items-center space-x-3"><CreditCard className="w-5 h-5 text-purple-600" /><span className="text-sm text-gray-700">Secure payments via Razorpay</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && product && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <RazorpayPayment
            items={[{
              id: product.id.toString(),
              name: product.name,
              price: price,
              quantity: 1,
              image: product.image,
            }]}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentFailure={handlePaymentFailure}
            onClose={() => setShowPayment(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ProductModal;