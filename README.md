# student-control-panel  
Creating a table Student Control Panel  
I used html (in html I wrote styles, because there are few of them) for layout and JavaScript  
## how to use  
First of all you have to install <a href = 'https://nodejs.org/ru'>node</a> on you PC
Step 2: you have to call cmd in <a href = 'https://github.com/ksen322/student-control-panel/tree/master/backend'> *backend* </a> folder. Then you have to write *node index.js* in command line
When you server is running, you can see this image:
![image](https://github.com/ksen322/student-control-panel/assets/119673458/250ad833-fd62-40f1-b484-6bb4b5b352a3)

And then you can run index.html in <a href = 'https://github.com/ksen322/student-control-panel/tree/master/frontend'> *frontend* </a> folder
## firstLetterUpper  
This function takes one argument - string, and used for to uppercase first letter  

## event listener filterStd  
1. Created variables for filter  
2. Created a new array filteredStudent in which the original array studentsList is filtered using the method filter()  
Callback function is executed for each student in array studentsList
3. Inside callback function:
    - created fullName variable in which combines lastname, name and patronymic name with space
    - created startYear, endYear variables which contains numeric values of year of admission, year of graduation
    - if filter value for filtered value (...FilterValue) is not empty and fullName (or faculty) of student doesn't contain filter value (...YearFilterValue is not a number and is not equal to the ...Year), then student element is excluded from filter array by returning false
    - if all previous conditions aren't met, then student element is included in the filtered list by returning true
4. Called function __renderStudents__ which display filtered array of students

## event listener addStudentForm  
1. Created variables for add
2. Created an empty array errors to store validation errors
3. Two conditions validate the entered values
4. If there is at least one error in the errors array, then an error message is displayed on the page, otherwise the following actions are performed:
    - The form is cleared using the reset method.
    - The __createStudentOnServer__ function is called, passing into it the values of the student’s first name, last name, patronymic, date of birth, year of study and department. Waiting for the result of a request to the server is indicated by the await keyword.
    - The __loadStudents__ function is called, which loads the list of students.  

5.The values of the input elements are cleared  

## loadStudents and createStudentOnServer  
Function __loadStudents__ loads data from server using array studentsList data  
Function __createStudentOnServer__ saves data about students on server  
## deleteStudent
This function deletes student from studentList array and also delete from server by calling function __deleteStudentFromServer__  
## sortByName  
This function sorts the array of students' names by last name.  
When you first click on the column with their full name, students are sorted in ascending order (i.e., from A to Z), when clicked again, the sorting occurs in descending order (i.e., from Z to A).  
With other repeated clicks, the order is repeated  
## renderStudents  
This function takes one argument - array filteredStudents  
It creates a new row <tr> for each student in the array and then creates <td> cell for fullName, faculty, dateBirth, startYear and course. Also cell <td> is created for deleteButton which when clicked calls the function __deleteStudent__  

And ___how it looks like___ 👇 
![image](https://github.com/ksen322/student-control-panel/assets/119673458/8b981784-666f-4bb3-9e16-7eaa262e9767)

