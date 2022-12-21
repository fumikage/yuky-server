const common = require("./common");
const Petsitter = require("../models").Petsitter;
const User = require("../models").User;
const config = require("../../config/config.js");

module.exports = {
    allOptions: {
        attributes: { exclude: ["path"] }
    },
    oneOptions: {},

    async update(req, res) {
        let { petAccepted, other } = req.body;
        let userId = req.params.userId;

        try {
            let user = await User.findOne({ where: { id: userId } });

            if (user) {
                let petsitter = await Petsitter.findOne({
                    where: { userId: userId }
                });

                if (!petsitter) {
                    petsitter = await user.createPetsitter({
                        pet_accepted: JSON.stringify(petAccepted),
                        other: other
                    });
                } else {
                    await petsitter.update({
                        pet_accepted: JSON.stringify(petAccepted),
                        other: other
                    });
                    console.log(petsitter);
                }

                common.sendAPIResponse(res, 201, { id: petsitter.id });
            }
        } catch (error) {
            return common.sendAPIError(
                res,
                ...common.onCRUDError(error, "create_failed")
            );
        }
    },
    async get(req, res) {
        let userId = req.params.userId;
        try {
            let user = await User.findOne({ where: { id: userId } });

            if (user) {
                let petsitter = await Petsitter.findOne({
                    where: { userId: userId }
                });
                common.sendAPIResponse(res, 200, petsitter);
            }
        } catch (error) {
            common.sendAPIError(res, 404, "ressource_not_found", {
                type: "Pets"
            });
        }
    }
};
