/**
 * RestaurantController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    // action - create
    create: async function (req, res) {

        if (req.method == "GET") return res.view('restaurant/create');

        var restaurant = await Restaurant.create(req.body).fetch();

        return res.status(201).json({ id: restaurant.id });
    },

    // json function
    json: async function (req, res) {

        var everyones = await Restaurant.find();

        return res.json(everyones);
    },

    // action - list
    list: async function (req, res) {

        var region1 = await Restaurant.find({
            where: { region: "HK Island" },
            sort: 'id DESC',
            limit: 2
        });

        var region2 = await Restaurant.find({
            where: { region: "Kowloon" },
            sort: 'id DESC',
            limit: 2
        });

        var region3 = await Restaurant.find({
            where: { region: "New Territories" },
            sort: 'id DESC',
            limit: 2
        });

        return res.view('restaurant/list', { hkisland: region1, kowloon: region2, nt: region3, });
    },

    // action - list2
    list2: async function (req, res) {

        var everyones = await Restaurant.find();

        return res.view('restaurant/admin', { restaurant: everyones });
    },

    // action - read
    read: async function (req, res) {

        var thatRestaurant = await Restaurant.findOne(req.params.id);

        if (!thatRestaurant) return res.notFound();

        return res.view('restaurant/read', { restaurant: thatRestaurant });
    },

    // action - update
    update: async function (req, res) {

        if (req.method == "GET") {

            var thatRestaurant = await Restaurant.findOne(req.params.id);

            if (!thatRestaurant) return res.notFound();

            return res.view('restaurant/update', { restaurant: thatRestaurant });

        } else {

            var updatedRestaurant = await Restaurant.updateOne(req.params.id).set(req.body);

            if (!updatedRestaurant) return res.notFound();

            if (req.wantsJSON) {
                return res.status(204).send();	    // for ajax request
            } else {
                return res.redirect('http://localhost:1337/restaurant/admin');			// for normal request
            }
        }
    },

    // action - delete 
    delete: async function (req, res) {

        var deletedRestaurant = await Restaurant.destroyOne(req.params.id);

        if (!deletedRestaurant) return res.notFound();

        if (req.wantsJSON) {
            return res.status(204).send();	    // for ajax request
        } else {
            return res.redirect('http://localhost:1337/restaurant/admin');			// for normal request
        }
    },

    // action - paginate and search
    paginate: async function (req, res) {

        var limit = Math.max(req.query.limit, 2) || 2;
        var offset = Math.max(req.query.offset, 0) || 0;

        var whereClause = {};
        if (req.query.region) whereClause.region = { contains: req.query.region };

        var parsedMinCoin = parseInt(req.query.min);
        if (!isNaN(parsedMinCoin)) whereClause.coins = parsedMinCoin;

        var parsedMaxCoin = parseInt(req.query.max);
        if (!isNaN(parsedMaxCoin)) whereClause.coins = parsedMaxCoin;

        var someRestaurant = await Restaurant.find({
            limit: limit,
            skip: offset,
            where: whereClause,

        });

        var count = await Restaurant.count();


        return res.view('restaurant/paginate', { restaurant: someRestaurant, numOfRecords: count });
    },

    populate: async function (req, res) {

        var restaurant = await Restaurant.findOne(req.params.id).populate("owned");

        if (!restaurant) return res.notFound();

        return res.json(restaurant);
    },

    // action - aginate and search
    aginate: async function (req, res) {

        if (req.wantsJSON) {

            var limit = Math.max(req.query.limit, 2) || 2;
            var offset = Math.max(req.query.offset, 0) || 0;

            // var whereClause = {};
            // if (req.query.region) whereClause.region = { contains: req.query.region };

            // var parsedMinCoin = parseInt(req.query.min);
            // if (!isNaN(parsedMinCoin)) whereClause.coins = parsedMinCoin;

            // var parsedMaxCoin = parseInt(req.query.max);
            // if (!isNaN(parsedMaxCoin)) whereClause.coins = parsedMaxCoin;

            var someRestaurant = await Restaurant.find({
                limit: limit,
                skip: offset,
                //where: whereClause,

            });

            return res.json(someRestaurant);


        } else {

            var count = await Restaurant.count();


            return res.view('restaurant/aginate', { numOfRecords: count });


        }

    },






};

