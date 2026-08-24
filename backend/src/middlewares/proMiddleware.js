export const requirePro = (req, res, next) => {
  const subscription = req.user?.subscription;

  const isPro =
    subscription?.plan === "pro" &&
    subscription?.status === "active" &&
    (!subscription.endDate || new Date(subscription.endDate) > new Date());

  if (!isPro) {
    return res.status(403).json({
      success: false,
      code: "PRO_REQUIRED",
      message: "AI Coach is available only for Pro users."
    });
  }

  next();
};
