import { Request, Response } from "express";

/**
 * GET /
 * Admin page.
 */
export let getAdmin = (req: Request, res: Response) => {
  res.render("admin/votes", {
    title: "Admin"
  });
};

