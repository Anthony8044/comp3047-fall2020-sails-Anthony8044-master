/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    login: async function (req, res) {

        if (req.method == "GET") return res.view('user/login');

        if (!req.body.username || !req.body.password) return res.badRequest();

        var user = await User.findOne({ username: req.body.username });

        if (!user) return res.status(401).json("User not found");

        var match = await sails.bcrypt.compare(req.body.password, user.password);

        if (!match) return res.status(401).json("Wrong Password");

        // Reuse existing session 
        if (!req.session.username) {
            req.session.username = user.username;
            req.session.userid = user.id;
            req.session.userrole = user.role;
            req.session.usercoins = user.coins;
            return res.json(user);
        }

        // Start a new session for the new login user
        req.session.regenerate(function (err) {

            if (err) return res.serverError(err);

            req.session.username = user.username;
            req.session.userid = user.id;
            req.session.userrole = user.role;
            req.session.usercoins = user.coins;
            return res.json(user);
        });
    },

    logout: async function (req, res) {

        req.session.destroy(function (err) {

            if (err) return res.serverError(err);

            return res.redirect('/');
        });
    },

    populate: async function (req, res) {

        var user = await User.findOne(req.params.id).populate("coupons");

        if (!user) return res.notFound();

        return res.json(user);
    },

    add: async function (req, res) {

        if (!await User.findOne(req.params.id)) return res.status(404).json("User not found.");

        var thatRestaurant = await Restaurant.findOne(req.params.fk).populate("owned", { id: req.params.id });

        if (!thatRestaurant) return res.status(404).json("Restaurant not found.");

        if (thatRestaurant.owned.length > 0)
            return res.status(409).json("Already added.");   // conflict

        if (thatRestaurant.coins > req.session.usercoins)
            return res.status(405).json("Not enough coins.");

        if (thatRestaurant.quota == 0)
            return res.status(406).json("Quota is full");

        await User.updateOne(req.params.id).set({
            coins: req.session.usercoins - thatRestaurant.coins
        });
        await Restaurant.updateOne(req.params.fk).set({
            quota: thatRestaurant.quota - 1
        });
        await User.addToCollection(req.params.id, "coupons").members(req.params.fk);

        return res.ok();
    },

    remove: async function (req, res) {

        if (!await User.findOne(req.params.id)) return res.status(404).json("User not found.");

        var thatRestaurant = await Restaurant.findOne(req.params.fk).populate("owned", { id: req.params.id });

        if (!thatRestaurant) return res.status(404).json("Restaurant not found.");

        if (thatRestaurant.owned.length == 0)
            return res.status(409).json("Nothing to delete.");    // conflict

        await User.removeFromCollection(req.params.id, "coupons").members(req.params.fk);

        return res.ok();
    },

    find: async function (req, res) {

        var thatuser = await User.findOne(req.params.id);

        var rest = await Restaurant.find().populate('owned',{
            where: { username: thatuser.username }
        });

        return res.view('user/myredeemed', { restaurant: rest, user: thatuser});
    },

    populateres: async function (req, res) {

        var user = await User.findOne(req.params.id).populate("coupons");

        if (!user) return res.notFound();

        return res.json(user);
    },




};

