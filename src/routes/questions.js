const express = require('express');
const router = express.Router({ mergeParams: true });
const ctrl = require('../controllers/questionController');
const auth = require('../middleware/auth');


router.use(auth);
router.post('/:quizId/questions', ctrl.addQuestion); // if you prefer nested route
router.get('/:quizId/questions', ctrl.getQuestions);


// question-level operations (edit/delete by id)
router.get('/question/:id', ctrl.getQuestionForEdit);
router.put('/question/:id', ctrl.updateQuestion);
router.delete('/question/:id', ctrl.deleteQuestion);


module.exports = router;