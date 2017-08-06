"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * GET /
 * Admin page.
 */
exports.getAdmin = (req, res) => {
    res.render('admin/votes', {
        title: 'Admin'
    });
};
//# sourceMappingURL=admin.js.map