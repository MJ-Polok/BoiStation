export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    res.status(403);
    next(new Error("Admin access required"));
    return;
  }

  next();
}
