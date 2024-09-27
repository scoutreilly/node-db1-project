const db = require("../../data/db-config");
const accountModel = require("./accounts-model");

exports.checkAccountPayload = (req, res, next) => {
  // DO YOUR MAGIC
  // Note: you can either write "manual" validation logic
  // or use the Yup library (not currently installed)
  const err = { status: 400 };
  const name = req.body.name;
  const budget = req.body.budget;
  if (name === undefined || budget === undefined) {
    res
      .status(400)
      .json({ message: "Name and budget are required for account" });
    next(err);
  } else if (typeof name !== "string") {
    res.status(400).json({ message: "Name of account must be a string" });
  } else if (name.trim().length < 5 || name.trim().length > 100) {
    res
      .status(400)
      .json({ message: "New account name must be between 5 and 100" });
  } else if (typeof budget !== "number" || isNaN(budget)) {
    res.status(400).json({
      message: "Budget must be a number, please select number amount",
    });
  } else if (budget < 0 || budget > 1000000) {
    res.status(400).json({ message: "Budget cost is too high or too low" });
  }
  if (err.message) {
    next(err);
  } else {
    req.body.name = name.trim();
    next();
  }
};

exports.checkAccountNameUnique = (req, res, next) => {
  // DO YOUR MAGIC
  try {
    const existing = await db("accounts")
      .where("name", req.body.name.trim())
      .first();
    if (existing) {
      next(
        res
          .status(400)
          .json({ message: "Given name is taken, please select new one" })
      );
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

exports.checkAccountId = (req, res, next) => {
  // DO YOUR MAGIC
  try {
    const account = await accountModel.getById(req.params.id);
    if (!account) {
      next({ status: 404, message: "Could not find account" });
    } else {
      req.account = account;
      next();
    }
  } catch (err) {
    next(err);
  }
};
