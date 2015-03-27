$(document).ready(function () {
    
    document.addEventListener("deviceready", start, false)
    function start() {
        //$('.app').hide();
        $('#titel').show();
    }
    
    var question,
        questionArray = [1, 2, 3, 4],
        questionNumber = getRandomPositionInQuestionArray(),
        points = 0,
        t = null,
        time = null,
        questionTimeout,
        questionInterval;
        
    function questionObj (question, answer1, answer2, answer3, answer4, rightAnswer,questionImage, time) {
        this.question = question;
        this.answer1 = answer1;
        this.answer2 = answer2;
        this.answer3 = answer3;
        this.answer4 = answer4;
        this.rightAnswerIndex = rightAnswer;
        this.questionImage = questionImage;
        this.time = time;
    }
    
    function getRandomPositionInQuestionArray() {
        return questionArray.splice(getRandomInt(questionArray.length), 1);
    }
    
    function getRandomInt(length) {
        return Math.floor(Math.random() * length);
    }
    
    function getQuestion(questionNumber) {
        $.getJSON("question" + questionNumber + ".json", function(data) {
            question = new questionObj(data.question, data.answer[0], data.answer[1], data.answer[2], data.answer[3], data.rightAnswerIndex, data.questionImage, data.time);
            setQuestionAndAnswers();
            $("#timerDiv").html("Zeit: "+ question.time);
            t = question.time;
            time = question.time;
            stopTimer();
            questionTimeout = setTimeout(function(){ doTimeout() }, time*1000);
            questionInterval = setInterval(function() { doInterval() }, 1000);
        })
        .done(function() {
        })
        .fail(function() {
            alert("JSON konnte nicht geladen werden.");
        });
    }
    
    function setQuestionAndAnswers() {
        $("#questionDiv").html("" + question.question);
        $("#button1").html("" + question.answer1);
        $("#button2").html("" + question.answer2);
        $("#button3").html("" + question.answer3);
        $("#button4").html("" + question.answer4);
    }

    function doTimeout() {
        if(questionArray.length === 0) {
                $('#overlay').hide(); 
                $('#resultDiv').show();
                $("#resultSpan").html("" + points);
        } else {
                questionNumber = getRandomPositionInQuestionArray();
                getQuestion(questionNumber);
        }  
    }
    
    function doInterval() {
        console.log("tset");
        if(t === 0) {
            clearInterval(questionInterval);
            $("#timerDiv").html("Zeit: "+ t);
        }else {
            $("#timerDiv").html("Zeit: "+ t)
            t--;
        }
    }
    
    function stopTimer() {
        clearTimeout(questionTimeout);
        clearInterval(questionInterval);
    }
    
    function buttonTouched(element) {
        stopTimer();
        for(var i=1; i<5;i++){
            $("#button"+i).addClass("disabled");
        }
        $("#" + element.id).removeClass('btn-primary');
        
        if($(element).attr("value") === question.rightAnswerIndex) {
            $("#" + element.id).addClass('btn-success');
            points++;
            $("#pointsOwned").html("" + points);
        } else {
            $("#" + element.id).addClass('btn-warning');
        }
        setTimeout(function(){
            for(var i=1; i<5;i++){
                $("#button"+i).removeClass("btn-warning");
                $("#button"+i).removeClass("btn-success");
                $("#button"+i).addClass("btn-primary");
            } 
            if(questionArray.length === 0) {
                $('#overlay').hide(); 
                $('#resultDiv').show();
                $("#resultSpan").html("" + points);
            } else {
                questionNumber = getRandomPositionInQuestionArray();
                getQuestion(questionNumber);
            }
            for(var i=1; i<5;i++){
                $("#button"+i).removeClass("disabled");
            }
        }, 1000);
    }
    
    
    $("#startButton").on("touchend", function() {
        getQuestion(questionNumber);
        $('#startDiv').hide();
        $('#overlay').show();
    });
    
    $("#button1").on("touchend", function () {
        buttonTouched(this);
    });

    $("#button2").on("touchend", function () {
        buttonTouched(this);
    });

    $("#button3").on("touchend", function () { 
        buttonTouched(this);
    });

    $("#button4").on("touchend", function () { 
        buttonTouched(this);
    });
    
    $("#backButton").on("touchend", function () {
        stopTimer();
        points = 0;
        questionArray = [1, 2, 3, 4];
        setQuestionAndAnswers();
        $('#overlay').hide(); 
        $("#pointsOwned").html("" + points);
        $('#resultDiv').hide();
        $('#startDiv').show();
    });
    
    
    $("#resetButton").on("touchend", function () {
        stopTimer();
        points = 0;
        questionArray = [1, 2, 3, 4];
        setQuestionAndAnswers();
        $("#pointsOwned").html("" + points);
        $('#resultDiv').hide();
        $('#startButton').show();
    });
});