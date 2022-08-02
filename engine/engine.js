var SearchEngine = module.exports = {}

// SearchEngine.search = (_index, query, res) => {
// 	return global.client.search({ index: _index, body: query })
//   .then((resp) => {
//     console.log(`found ${resp.hits.total} items in ${resp.took}ms`);
//     return { 'results': resp.hits.hits, 'time': resp.took, 'total': resp.hits.total};
//   })
//   .catch(console.error)
// }

SearchEngine.searchQueries = async function (_index, searchText) {
    console.log('resp-> ', searchText);
    if(searchText == ''){
        searchText = '*';
    }

    let query = {
        index: _index,
        queryString: `*${searchText}*`
    }
    global.client.search(query)
    .then(resp => {
        console.log('resp.hits.hits-> '.resp.hits.hits);
        console.log('resp.hits.hits._source-> '.resp.hits.hits._source);
        var results = [];
        results = resp.hits.hits.map(function(hit){ return hit._source });
        resp.header('Content-Type', 'application/json');
        resp.end(JSON.stringify(results));
        // return res.status(200).json({
        //     questions: JSON.stringify(resp.hits.hits._source)
        // });
    }).catch(err=> {
        console.log(`Error in ES search API-> ${err}`);
        return;
    });
}

SearchEngine.indexQuestionData = async function (_index, _id, req) {
    try{
        await global.client.index({
            index: _index,
            id: _id,
            refresh: true,
            body: req.body
            });
        await global.client.indices.refresh({index: _index});
        console.log('indexed question good!');
        return;
        }catch(err) {
            console.log('Error in indexing Question!', err);
            return;
        }
}

// SearchEngine.indices = function(){
//   return global.client.cat.indices({v: true})
//   .then(console.log)
//   .catch(err => console.error(`Error connecting to es global.client ${err}`))
// }

/**
 * @param  {[indexName]}
 * @return {[{acknowledge: true}]}
 */
// SearchEngine.deleteIndex = (index) => {
// 	return global.client.delete({
// 		index: index
// 	});
// }

 /**
  * [description]
  * @param  {[string]} search string
  * @param  {[string]} index name
  * @return {[json]}  suggestion json
  */
// SearchEngine.suggest = (param, index) => {
//   return global.client.suggest({
//     index: index,
//     body: {
//       mysuggester: {
//         text: param,
//         term: {
//           field: 'name'
//         }
//       }
//     }
//   })
// }