function isAllFeaturesFree() {
  return process.env.NEXT_PUBLIC_ALL_FEATURES_FREE === "true";
}

function freeModeSubscription() {
  return {
    status: "all_features_free",
    plan: null,
    expiresAt: null,
    isPremium: true,
    allFeaturesFree: true
  };
}

module.exports = {
  freeModeSubscription,
  isAllFeaturesFree
};

