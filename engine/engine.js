var SearchEngine = module.exports = {}

/**
 * @param  {[indexName, searchText]}
 * @return {[{promise}]}
 */
SearchEngine.search = async function search(ind, text) {
    return global.client.search({
      index: ind,
      body: {
        query: {
            "multi_match" : {
                "query":    text, 
                "fields": [ "title", "tags" ],
                "fuzziness": 2
              }
        }
      }
    });
  }

SearchEngine.indexQuestionData = async function (_index, _id, req) {
    try{
        await global.client.index({
            index: _index,
            id: _id,
            body: req.body
            });
        console.log('indexed question good!');
        return;
        }catch(err) {
            console.log('Error in indexing Question!', err);
            return;
        }
}

SearchEngine.indices = function(){
  return global.client.cat.indices({v: true})
  .then(console.log)
  .catch(err => console.error(`Error connecting to es global.client ${err}`))
}

/**
 * @param  {[indexName]}
 * @return {[{acknowledge: true}]}
 */
// SearchEngine.deleteIndex = (index) => {
// 	return global.client.delete({
// 		index: index
// 	});
// }