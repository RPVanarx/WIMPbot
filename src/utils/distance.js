const METERS_IN_MILE = 1609.344;

module.exports = {
  milesToMeters(miles) {
    return miles * METERS_IN_MILE;
  },

  metersToMiles(meters) {
    return meters / METERS_IN_MILE;
  },
};
