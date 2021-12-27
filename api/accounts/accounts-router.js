const router = require("express").Router();
const accountModel = require("./accounts-model");
const middle = require("./accounts-middleware");

router.get("/", (req, res, next) => {
  // DO YOUR MAGIC
  accountModel
    .getAll()
    .then((accounts) => {
      res.json(accounts);
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/:id", middle.checkAccountId, async (req, res) => {
  // DO YOUR MAGIC
  const account = await accountModel.getById(req.params.id);
  res.json(account);
});

router.post(
  "/",
  middle.checkAccountPayload,
  middle.checkAccountNameUnique,
  async (req, res, next) => {
    // DO YOUR MAGIC
    try {
      const newAccount = await accountModel.create(req.body);
      res.status(201).json(newAccount);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/:id",
  middle.checkAccountId,
  middle.checkAccountPayload,
  async (req, res, next) => {
    // DO YOUR MAGIC
    try {
      const updated = await accountModel.updateById(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:id", middle.checkAccountId, async (req, res, next) => {
  // DO YOUR MAGIC
  try {
    await accountModel.deleteById(req.params.id);
    res.json(req.account);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res) => {
  // eslint-disable-line
  // DO YOUR MAGIC
  res.status(err.status || 201).json(err);
});

module.exports = router;
