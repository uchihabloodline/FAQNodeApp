const Question = require('../../models/question');

module.exports.home = async function (req, res) {
    const searchText = req.query.search;

    try{
        let questions = searchText ?
        await Question.find({$text: {$search: searchText}}) :
        await Question.find({});

        return res.render('faq_home', {
            questions: questions || [
                {
                    title: 'Question 1',
                    answer: 'Hello this is the answer of the question. It gives you all the information you need to answer your question. It is a bit longer that you expected. So please read it carefully.',
                    tags: ['tag-1', 'tag-2', 'tag-3']
                },
                {
                    title: 'Question 2',
                    answer: null,
                    tags: ['tag-1']
                },
                {
                    title: 'Question 3',
                    answer: 'Hello this is the answer of the question. It gives you all the information you need to answer your question. It is a bit longer that you expected. So please read it carefully.',
                    tags: ['tag-1', 'tag-2']
                },
                {
                    title: 'Question 4',
                    answer: 'Hello this is the answer of the question. It gives you all the information you need to answer your question. It is a bit longer that you expected. So please read it carefully.',
                    tags: ['tag-1', 'tag-2', 'tag-3']
                },
            ],
            canAnswer: true
        });
    }catch(err){
        console.log("ERROR in question Controller ",err);
        return res.redirect('back');
    }
}