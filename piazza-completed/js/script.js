(function(window, document, undefined) {

    // panels and lists
    var rightPane = document.getElementById('right-pane');
    var leftPane = document.getElementById('left-pane');

    // buttons and inputs
    var newQuestionButton = document.querySelector('#interactors .btn');
    var search = document.getElementById('search');

    // script elements that correspond to Handlebars templates
    var questionsTemplate = document.getElementById('questions-template');
    var questionFormTemplate = document.getElementById('question-form-template');
    var expandedQuestionTemplate = document.getElementById('expanded-question-template');

    // compiled Handlebars templates
    var templates = {
        renderQuestions: Handlebars.compile(questionsTemplate.innerHTML),
        renderQuestionForm: Handlebars.compile(questionFormTemplate.innerHTML),
        renderExpandedQuestion: Handlebars.compile(expandedQuestionTemplate.innerHTML)
    };

    // ID of the active question
    var activeQuestionID;

    /* Returns the questions stored in localStorage. */
    function getStoredQuestions() {
        if (!localStorage.questions) {
            // default to empty array
            localStorage.questions = JSON.stringify([]);
        }

        return JSON.parse(localStorage.questions);
    }

    /* Store the given questions array in localStorage.
     *
     * Arguments:
     * questions -- the questions array to store in localStorage
     */
    function storeQuestions(questions) {
        localStorage.questions = JSON.stringify(questions);
    }

    /* Returns the ID of the question that corresponds to the given
     * .question-info tag.
     *
     * Arguments:
     * questionInfo -- the .question-info tag with question information
     */
    function getQuestionID(questionInfo) {
        return parseInt(questionInfo.id, 10);
    }

    /* Returns the question object with the provided id, or undefined if no
     * such question exists.
     *
     * Arguments:
     * questions -- the list of questions
     * id -- the id of the question object to find and return
     */
    function getQuestionObjWithID(questions, id) {
        var targetQuestion;

        // search for the question with the provided identifier
        questions.forEach(function(question) {
            if (question.id == id) {
                targetQuestion = question;
            }
        });

        return targetQuestion;
    }

    /* Renders and displays an expanded question given a reference to the
     * associated .question-info tag, which contains question information.
     *
     * Arguments:
     * questionInfo -- the .question-info tag with question information
     */
    function displayExpandedQuestion(questionInfo) {
        var id = getQuestionID(questionInfo);
        var questionObj = getQuestionObjWithID(getStoredQuestions(), id);

        if (questionObj) {
            rightPane.innerHTML = templates.renderExpandedQuestion(questionObj);
            activeQuestionID = id;
        }
    }

    /* Adds a question based off the values in the given question form.
     *
     * Arguments:
     * questionForm -- the question form
     */
    function addQuestion(questionForm) {
        var subjectInput = questionForm.querySelector('[name="subject"]');
        var questionInput = questionForm.querySelector('[name="question"]');

        if (!subjectInput.value || !questionInput.value) {
            return;
        }

        var questions = getStoredQuestions();
        questions.push({
            id: new Date().getTime(),
            subject: subjectInput.value,
            question: questionInput.value,
            responses: []
        });

        storeQuestions(questions);
        leftPane.innerHTML = templates.renderQuestions(
            { questions: questions });

        // clear form inputs
        subjectInput.value = '';
        questionInput.value = '';
    }

    /* Adds an answer based off the values in the given question form.
     *
     * Arguments:
     * answerForm -- the answer form
     */
    function addResponse(responseForm) {
        var nameInput = responseForm.querySelector('[name="name"]');
        var responseInput = responseForm.querySelector('[name="response"]');

        // must have an active question, a name, and a response
        if (!activeQuestionID || !nameInput.value || !responseInput.value) {
            return;
        }

        var questions = getStoredQuestions();
        var questionObj = getQuestionObjWithID(questions, activeQuestionID);

        // add response to active question
        questionObj.responses.push({
            name: nameInput.value,
            response: responseInput.value
        });

        storeQuestions(questions);
        rightPane.innerHTML = templates.renderExpandedQuestion(questionObj);

        // clear form inputs
        nameInput.value = '';
        responseInput.value = '';
    }

    /* Display the given questions, or all questions if no argument is
     * specified.
     *
     * Arguments:
     * questions -- the questions to render
     */
    function displayQuestions(questions) {
        if (!questions) {
            questions = getStoredQuestions();
        }

        leftPane.innerHTML = templates.renderQuestions(
            { questions: questions });
    }

    // when new question button is clicked, display question form
    newQuestionButton.addEventListener('click', function(event) {
        event.preventDefault();
        rightPane.innerHTML = templates.renderQuestionForm();
    });

    // when question is clicked, display expanded question
    leftPane.addEventListener('click', function(event) {
        var target = event.target;

        // find .question-info tag
        while (target && target.className.indexOf(" question-info") === -1) {
            target = target.parentNode;
        }

        // event delegation for question clicks on .question-info tag
        if (target && target.className.indexOf(" question-info") !== -1) {
            displayExpandedQuestion(target);
        }
    });

    rightPane.addEventListener('click', function(event) {
        var target = event.target;

        if (target.className === "resolve btn") {
            var questions = getStoredQuestions();

            // remove the currently-viewed question
            questions = questions.filter(function(questionObj) {
                return questionObj.id != activeQuestionID;
            });

            storeQuestions(questions);
            leftPane.innerHTML = templates.renderQuestions(
                { questions: questions });

            rightPane.innerHTML = templates.renderQuestionForm();
            event.preventDefault();
        }
    });

    // handle response/answer form submissions
    rightPane.addEventListener('submit', function(event) {
        var target = event.target;
        event.preventDefault();

        // when question form is submitted, add question
        if (target.id === "question-form") {
            event.preventDefault();
            addQuestion(target);
        }
        
        // when response form is submitted, add answer
        if (target.id === "response-form") {
            event.preventDefault();
            addResponse(target);
        }
    });

    // filter questions when the user searches
    search.addEventListener('keyup', function(event) {
        if (!search.value) {
            displayQuestions();
        } else {
            // filter questions to only those that contain the search term
            var questions = getStoredQuestions();
            var shouldDisplayQuestionForm = false;

            questions = questions.filter(function(questionObj) {
                var shouldDisplay =
                    questionObj.subject.indexOf(search.value) !== -1 ||
                    questionObj.question.indexOf(search.value) !== -1;

                // display question form if currently expanded question doesn't
                // match the user's filter
                if (questionObj.id == activeQuestionID && !shouldDisplay) {
                    shouldDisplayQuestionForm = true;
                }

                return shouldDisplay;
            });

            displayQuestions(questions);
            if (shouldDisplayQuestionForm) {
                rightPane.innerHTML = templates.renderQuestionForm();
            }
        }
    });

    // display question list and question form initially
    displayQuestions();
    rightPane.innerHTML = templates.renderQuestionForm();

})(this, this.document);
