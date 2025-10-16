"use strict";
/**
 * TypeScript Type Definitions for SendIT Parcel Tracker
 *
 * This file contains all the type definitions for our application.
 * In commercial-grade applications, having well-defined types is crucial for:
 * 1. Type safety - prevents runtime errors
 * 2. Better IDE support - autocomplete, refactoring
 * 3. Documentation - types serve as living documentation
 * 4. Team collaboration - clear contracts between modules
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeightCategory = exports.OrderStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["PICKED_UP"] = "picked_up";
    OrderStatus["IN_TRANSIT"] = "in_transit";
    OrderStatus["OUT_FOR_DELIVERY"] = "out_for_delivery";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["CANCELLED"] = "cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
// Weight categories for pricing
var WeightCategory;
(function (WeightCategory) {
    WeightCategory["LIGHT"] = "light";
    WeightCategory["MEDIUM"] = "medium";
    WeightCategory["HEAVY"] = "heavy";
    WeightCategory["EXTRA_HEAVY"] = "extra_heavy"; // 50kg+
})(WeightCategory || (exports.WeightCategory = WeightCategory = {}));
//# sourceMappingURL=index.js.map