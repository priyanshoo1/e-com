class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    };

    search() {
        // console.log(this.query);
        const keyword = (this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            },
        } : {});
        this.query = this.query.find({...keyword });
        // console.log(this.query);
        return this;
    };

    filter() {
        // const querycopy = this.queryStr;//It passes queryStr by reference.
        //We need a copy of queryStr
        var queryCopy = {...this.queryStr };

        //We need to remove some fields from the query string
        const removeFields = ["keyword", "page", "limit"];

        removeFields.forEach(key => delete queryCopy[key]);

        //Filter for price and rating 
        let queryStr = JSON.stringify(queryCopy);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    };

    pagination(resultPerPage) {
        let currPage = Number(this.queryStr.page) || 1;

        let skip = (currPage - 1) * resultPerPage;

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }
};

module.exports = ApiFeatures;