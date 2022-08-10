// eslint-disable-next-line no-multi-assign
const SearchEngine = module.exports = {};

/**
 * @param  {[indexName, searchText]}
 * @return {[{promise}]}
 */
SearchEngine.search = async function search(ind, text) {
  return global.client.search({
    index: ind,
    body: {
      query: {
        multi_match: {
          query: text,
          fields: ['title', 'tags', 'answer'],
          fuzziness: 1,
        },
      },
    },
  });
};

/**
 * @param  {[indexName, documentId, request]}
 * @return {[{promise}]}
 */
// index each question added to elasticsearch indexes.
// eslint-disable-next-line no-unused-expressions
SearchEngine.indexQuestionData = async (_index, _id, req) => {
  try {
    await global.client.index({
      index: _index,
      id: _id,
      body: req.body,
    });
    console.log('Successfully indexed');
    return;
  } catch (err) {
    console.log('Error in indexing Question/Answer', err);
  }
};
/**
 * @param  {[indexName, documentId, request]}
 * @return {[{promise}]}
 */

// elasticsearch Update API to update existing docs with matching _id's.
SearchEngine.addAnswerToQuestion = async function (_index, _id, req) {
  try {
    // eslint-disable-next-line no-undef
    await client.update({
      index: _index,
      id: _id,
      body: {
        doc: {
          answer: req.body.answer,
        },
      },
    });

    console.log(`Added answer to question with ESId: ${_id}`);
    // eslint-disable-next-line no-undef
    logger.info({ message: `Added answer to question with ESId: ${_id}` });
    return;
  } catch (err) {
    console.log('Error in adding Answer to Question in ES', err);
    // eslint-disable-next-line no-undef
    logger.error({ message: `Error in adding Answer to Question in ES. Error: ${_id}` });
  }
};

// Get all the indices present in elasticsearch.
SearchEngine.indices = function () {
  return global.client.cat.indices({ v: true })
    .then(console.log)
    .catch((err) => console.error(`Error connecting to es global.client ${err}`));
};

/**
 * @param  {[indexName]}
 * @return {[{acknowledge: true}]}
 */
// SearchEngine.deleteIndex = (index) => {
// return global.client.delete({
// index: index
// });
// }
