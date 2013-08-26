/**
 * 
 */

HUMMEDIA_SERVICES.factory('Course', [function() {
    //Semester Functions
    var getSemesterObject = function(month, year){
        var int;
        var name;
        
        if(month>=1 && month<=4){
            int = year*10+1;
            name = "Winter " + year;
        }else if(month>=5 && month<=6){
            int = year*10+3;
            name = "Spring " + year;
        }else if(month>=7 && month<=8){
            int = year*10+4;
            name = "Summer " + year;
        }else if(month>=9 && month<=12){
            int = year*10+5;
            name = "Fall " + year;
        }
        return {int: int, name: name};
    };
    
    var getNextTerm = function(semester){//Takes a semester object and returns a semester object for the next term
        var int;
        var name;
        
        //Turn the semester int into a string
        var i = semester.int + "";
        //Get the last digit of the semester int
        var term = i.substring(i.length-1);
        term = parseInt(term);
        //Get the first digits for the yar
        var year = (semester.int-term)/10;        
        
        var new_term = term+1;
        
        if(new_term==2){
            int = semester.int+2;
            name = "Spring " + year;
        }else if(new_term==4){
            int = semester.int+1;
            name = "Summer " + year;
        }else if(new_term==5){
            int = semester.int+1;
            name = "Fall " + year;
        }else if(new_term==6){
            int = (year+1)*10 + 1;
            name = "Winter " + (year+1);
        }
        return {int: int, name: name};
    };
    
    var getSemesterArray = function(){//returns an array of 4 semester objects starting from the current term
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth();
        
        var semesters = [];        
        var semester = getSemesterObject(month, year);
        
        for(var i=0; i<4; i++){
            semesters.push(semester);
            semester=getNextTerm(semester);
        }
        return semesters;
    };
    
    //Course Department Functions
    
    var getCourseDepartments = function(){
        return ['AFRIK','AMST','ARAB','ASIAN','ASL','BULGN','CANT','CHIN','CLSCS',
                'CMLIT','CZECH','DANSH','DIGHT','DUTCH','ELANG','ENGL','ESL','FINN',
                'FLANG','FREN','GERM','GREEK','HCOLL','HEB','IAS','ICLND','IHUM',
                'ITAL','JAPAN','KOREA','LATIN','LING','LT AM','MESA','NE LG','NORWE',
                'PHIL','POLSH','PORT','ROM','RUSS','SCAND','SLAT','SPAN','SWED','TESOL',
                'WELSH','WS','WRTG'];
    }
    
    //Conversion functions
    
    var courseFieldsToString = function(course_department, course_number, section_number, semester){
        course_string = course_department + course_number + ' ' + section_number + ' ' + semester;
        return course_string;
    };
    
    var courseStringToFields = function(){
        
    };
    
    //Return Course object
    
    var Course = {getSemesterArray: getSemesterArray,
                  getCourseDepartments: getCourseDepartments,
                  courseFieldsToString: courseFieldsToString,
                  courseStringToFields: courseStringToFields
            };
    
    Object.seal(Course);
    Object.freeze(Course);
    
    return Course;
}]);