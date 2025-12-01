const cookieOptions = (res) => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction && res.hostname !== "localhost",
    sameSite: "strict",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };
};

export default cookieOptions;
