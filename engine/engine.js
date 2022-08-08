const loggerConfigLog4js = require("../config/loggerConfigLog4js");

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
                "fields": [ "title", "tags", "answer"],
                "fuzziness": 1
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
        console.log('Successfully indexed');
        return;
        }catch(err) {
            console.log('Error in indexing Question/Answer', err);
            return;
        }
}

SearchEngine.addAnswerToQuestion = async function (_index, _id, req) {
  try{
    await client.update({
      index: _index,
      id: _id,
      body:{
        doc:{
          answer: req.body.answer
        }
      }
    });
    
    console.log(`Added answer to question with ESId: ${_id}`);
    logger.info({message: `Added answer to question with ESId: ${_id}`});
    return;
  }catch(err){
    console.log('Error in adding Answer to Question in ES', err);
    logger.error({message: `Error in adding Answer to Question in ES. Error: ${_id}`});
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