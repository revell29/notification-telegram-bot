import { VercelRequest, VercelResponse } from "@vercel/node";

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    console.log(req.body);
    return res.status(200).send({ message: req.body });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
