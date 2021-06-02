/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function () {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  sails.bcrypt = require('bcryptjs');
  var salt = await sails.bcrypt.genSalt(10);



  if (await Restaurant.count() > 0) {
    return generateUsers();
  }

  await Restaurant.createEach([
    { title: "Simply receive a complimentary drink", restaurant: "Greyhound Cafe", region: "HK Island", mall: "IFC Mall", image: "https://www.asia-bars.com/wp-content/uploads/2011/12/greyhound-hk015.jpg", quota: 600, coins: 500, expirydate: "2021-03-31", detail: "Offer is valid after 6pm for dine-in only." },
    { title: "50% discount on Supreme Seafood Feast (for 2 persons)", restaurant: "Mango Tree", region: "Kowloon", mall: "Elements", image: "https://cdn.asiatatler.com/asiatatler/i/hk/2019/01/10141632-mango-tree-elements-entrance-2_article_2000x1338.jpg", quota: 500, coins: 750, expirydate: "2021-06-16", detail: "Original price: HK$790 per person." },
    { title: "50% Off Yoogane's Chicken Galbi", restaurant: "Yoogane", region: "New Territories", mall: "New Town Plaza", image: "https://media-cdn.tripadvisor.com/media/photo-s/10/05/a1/d2/caption.jpg", quota: 550, coins: 500, expirydate: "2021-02-10", detail: "Only available on weekdays." },
    { title: "15% Off on Whole Bill", restaurant: "ANA Gura", region: "Kowloon", mall: "Festival Walk", image: "https://lubuds.com/wp-content/uploads/2016/01/DSC_0202-768x432-650x400.jpg", quota: 650, coins: 500, expirydate: "2021-06-25", detail: "This offer is only available after 6pm for dine-in." }
  ]);

  return generateUsers();

  async function generateUsers() {

    if (await User.count() > 0) {
      return;
    }

    var hash = await sails.bcrypt.hash('123456', salt);

    await User.createEach([
      { username: "admin", password: hash, coins: 1000, role: "admin" },
      { username: "member", password: hash, coins: 1000, role: "member" },
      { username: "anthony", password: hash, coins: 1000, role: "member" }
      // etc.

    ]);

    const Greyhound = await Restaurant.findOne({ restaurant: "Greyhound Cafe" });
    const Mango = await Restaurant.findOne({ restaurant: "Mango Tree" });
    const admin = await User.findOne({ username: "admin" });
    const member = await User.findOne({ username: "member" });

    await User.addToCollection(admin.id, 'coupons').members(Greyhound.id);
    await User.addToCollection(member.id, 'coupons').members([Mango.id, Greyhound.id]);
  }

};
