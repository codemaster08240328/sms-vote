"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("../models/Event");
/**
 * GET /
 * Vote results
 */
exports.index = (req, res) => {
    Event_1.default.findById(req.params.eventId, (err, event) => {
        res.render('results', {
            title: `Results for ${event.Name}`
        });
    });
};

//# sourceMappingURL=results.js.map
