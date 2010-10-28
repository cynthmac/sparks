/*globals console sparks $ breadModel getBreadBoard */

(function() {
  sparks.ActivityConstructor = function(jsonActivity, assessment){
    this.jsonActivity = jsonActivity;
    this.assessment = assessment;
  };
  
  sparks.ActivityConstructor.prototype = {
    /*
      Creates the breadboard from the JSON representation of the
      circuit. See tests/jspc/spec/spec.common/spec.circuit_constructor
      for examples of json circuits
    */
    createBreadboard: function() {
      if (!this.jsonActivity.circuit){
        console.log("ERROR: No circuit defined");
        return;
      }
      
      breadModel("createCircuit", this.jsonActivity.circuit);
    },
    
    /*
      Creates questions from the JSON represenation of the questions,
      and embeds them in the jquery element provided
    */
    createQuestions: function($element){
      if (!this.jsonActivity.questions){
        console.log("ERROR: No questions defined");
        return;
      }
      
      var assessment = this.assessment;
      var self = this;
      $.each(this.jsonActivity.questions, function(i, val){
        val.correct_answer = self.calculateCorrectAnswer(val.correct_answer);
        assessment.addQuestion(val);
      });
      
      if (!!$element) {
        this.embedQuestions($element);
      }
    },
    
    /*
      When passed a string such as "100 + ${r1.resistance} / ${r2.nominalResistance}"
      This will first substitute the actual values of the variables in ${...}, assuming
      the components and their properties exist in the circuit, and then perform the
      calculation.
    */
    calculateCorrectAnswer: function(answer){
      if (!isNaN(Number(answer))){
        return answer;
      }
      
      var varPattern = /\${[^}]+}/g
      var matches = answer.match(varPattern);
      $.each(matches, function(i, match){
        var variable = match.substring(2,match.length-1).split('.');
        var component = variable[0];
        var property = variable[1];
        
        var components = getBreadBoard().components; 
        
        if (!components[component]){
          console.log("ERROR calculating answer: No component name '"+component+"' in circuit");
          answer = -1;
          return;
        }
        
        if (components[component][property] === undefined || components[component][property] === null){
          console.log("ERROR calculating answer: No property name '"+property+"' in component '"+component+"'");
          answer = -1;
          return;
        }
        
        var value = components[component][property];
        answer = answer.replace(match, value);
      });
      
      var calculatedAnswer = eval(answer);
      if (!isNaN(Number(calculatedAnswer))){
        return calculatedAnswer;
      }
      
      console.log("ERROR calculating answer: Cannot compute the value of "+answer);
      return -1;
    },
    
    embedQuestions: function($element){
      var questions = this.assessment.questions;
      $.each(questions, function(i, question){
        var $form = $("<form>").addClass("question_form");
        
        $form.append(
          $("<span>").addClass("prompt").text(question.prompt)
        );
        
        $form.append(
          $("<input>")
        );
        
        if (!!question.correct_units){
          var $select = $("<select>");
          var options = ["Units...","&#x00b5;V","mV","V","&#x2126;","k&#x2126;","M&#x2126;","&#x00b5;A","mA","A"];
          $.each(options, function(i, val){
            $select.append($("<option>").html(val).attr("defaultSelected", i===0));
          });
          $form.append($select);
        }
        
        $form.append(
          $("<button>").addClass("submit").text("Submit")
        );
        
        console.log($form.html());
        
        $element.append($form);
      });
    }
  };
})();