// isMember.js
module.exports = async function (req, res, proceed) {


    if (req.session.userrole == 'member') {
        return proceed();   //proceed to the next policy,
    } else {
        //--•
        // Otherwise, this request did not come from a logged-in user.
        return res.forbidden();
    }
};