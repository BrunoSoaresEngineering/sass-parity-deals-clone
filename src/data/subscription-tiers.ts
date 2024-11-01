const subscriptionTiers = {
  free: {
    name: 'Free',
    priceInCents: 0,
    maxNumberOfProducts: 1,
    maxNumberOfVisits: 5000,
    canAccessAnalytics: false,
    canCustomizeBanner: false,
    canRemoveBranding: false,
  },
  basic: {
    name: 'Basic',
    priceInCents: 1900,
    maxNumberOfProducts: 5,
    maxNumberOfVisits: 10000,
    canAccessAnalytics: true,
    canCustomizeBanner: false,
    canRemoveBranding: true,
  },
  standard: {
    name: 'Standard',
    priceInCents: 4900,
    maxNumberOfProducts: 30,
    maxNumberOfVisits: 100000,
    canAccessAnalytics: true,
    canCustomizeBanner: true,
    canRemoveBranding: true,
  },
  premium: {
    name: 'Premium',
    priceInCents: 9900,
    maxNumberOfProducts: 50,
    maxNumberOfVisits: 1000000,
    canAccessAnalytics: true,
    canCustomizeBanner: true,
    canRemoveBranding: true,
  },
};

const subscriptionTiersInOrder = [
  subscriptionTiers.free,
  subscriptionTiers.basic,
  subscriptionTiers.standard,
  subscriptionTiers.premium,
];

export {
  subscriptionTiersInOrder,
};
