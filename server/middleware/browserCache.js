/**
 * Sets Cache-Control headers for browser caching.
 * @param {number} maxAge - Max age in seconds (default: 5 minutes)
 */
const browserCache = (maxAge = 300) => {
    return (req, res, next) => {
        res.set('Cache-Control', `public, max-age=${maxAge}, stale-while-revalidate=${maxAge * 2}`);
        next();
    };
};

export { browserCache };
