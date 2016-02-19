'use strict';

/**
 * Query helper
 */
module.exports = {

  /**
   * Helper to get the sort and limit parameters for query
   */
  applySortAndLimit(query, sort, limit) {

    //No sort & limit specified?
    if (!sort && !limit) {
      return query;
    }

    //Sort
    if (sort && typeof sort === 'string') {

      //Get sort parameters by 'field:direction'
      let [sortField, sortDirection] = sort.split(':');
      sort = {};
      sort[sortField] = (sortDirection === 'asc') ? 1 : -1;

      //Sort now
      query = query.sort(sort);
    }

    //Limit
    if (limit && typeof limit === Number) {
      query = query.limit(limit);
    }

    //Return query
    return query;
  }
};
