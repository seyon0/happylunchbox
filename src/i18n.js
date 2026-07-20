import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Welcome": "Welcome",
      "Order Now": "Order Now",
      "Popular Kitchens": "Popular Kitchens",
      "Menu": "Menu",
      "Cart": "Cart",
      "Profile": "Profile",
      "Home": "Home",
      "Search": "Search",
      "Checkout": "Checkout",
      "Total": "Total",
      "Add to Cart": "Add to Cart",
      "Delivery": "Delivery",
      "Pick Up": "Pick Up",
      "Settings": "Settings",
      "Language": "Language",
      "Log Out": "Log Out",
      "Help": "Help",
      "Contact Us": "Contact Us",
      "Healthy Lunchbox": "Healthy Lunchbox",
      "Quick Delivery": "Quick Delivery"
    }
  },
  ta: {
    translation: {
      "Welcome": "வரவேற்கிறோம்",
      "Order Now": "இப்போது ஆர்டர் செய்யுங்கள்",
      "Popular Kitchens": "பிரபலமான சமையலறைகள்",
      "Menu": "பட்டியல்",
      "Cart": "வண்டி",
      "Profile": "சுயவிவரம்",
      "Home": "முகப்பு",
      "Search": "தேடு",
      "Checkout": "வெளியேறு",
      "Total": "மொத்தம்",
      "Add to Cart": "வண்டியில் சேர்",
      "Delivery": "டெலிவரி",
      "Pick Up": "எடுத்துக்கொள்",
      "Settings": "அமைப்புகள்",
      "Language": "மொழி",
      "Log Out": "வெளியேறு",
      "Help": "உதவி",
      "Contact Us": "எங்களை தொடர்பு கொள்ள",
      "Healthy Lunchbox": "ஆரோக்கியமான மதிய உணவுப் பெட்டி",
      "Quick Delivery": "விரைவான டெலிவரி"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
