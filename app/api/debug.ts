export default function handler(req, res) {
  res.status(200).json({ key: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY });
}
