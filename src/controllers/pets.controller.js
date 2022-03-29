const hasAtLeastOneQuery = queryCount => queryCount>0
const handleWhereQuery = (baseQuery,queries,values) => {
    let whereQuery = ' WHERE'
    let queryCount = 0
    for (const key in queries){
        if (queries[key]){
            if (key === 'page' || key === 'per_page') continue
            if (hasAtLeastOneQuery(queryCount)){
                whereQuery += ' AND'
            }
            queryCount++
            whereQuery += ` ${key}=$${queryCount}`
            values.push(queries[key])
        }
    }
    if (hasAtLeastOneQuery(queryCount)) baseQuery += whereQuery
    return baseQuery
}
const handlePagination = (currentQuery,queries) => { 
    if (queries.page) {
    let pageLimit
    if (queries['per_page']) pageLimit = Math.min(50,Math.max(queries['per_page'],10))
    else pageLimit = 20
    currentQuery += ` LIMIT ${pageLimit} OFFSET ${(queries.page-1)*pageLimit}`
    }
    return currentQuery
}

const isValidString = datum => typeof(datum) === 'string' && datum.length > 0 && datum.length < 256
const isValidInt = datum => Number.isInteger(datum)
const isValidBoolean = datum => datum === true || datum === false

module.exports = {
    hasAtLeastOneQuery,
    handleWhereQuery,
    handlePagination,
    isValidString,
    isValidBoolean,
    isValidInt
}