let studentsList = [];

loadStudents();

function firstLetterUpper(str) {
  if (str == '') return str;
  let strOne = str.toLowerCase().trim();
  let strFin = strOne[0].toUpperCase() + strOne.slice(1);
  return strFin;
}

const addStudentform = document.getElementById('addStudentsForm');
const firstNameInput = document.getElementById('firstNameInput');
const lastNameInput = document.getElementById('lastNameInput');
const middleNameInput = document.getElementById('middleNameInput');
const birthDateInput = document.getElementById('birthDateInput');
const startYearInput = document.getElementById('startYearInput');
const facultyInput = document.getElementById('facultyInput');
const studentTableBody = document.getElementById('studentTableBody');
const nameFilter = document.getElementById('nameFilter');
const facultyFilter = document.getElementById('facultyFilter');
const startYearFilter = document.getElementById('startYearFilter');
const endYearFilter = document.getElementById('endYearFilter');
const filterStd = document.getElementById('filterStd');


filterStd.addEventListener('input', function (e) {
  e.preventDefault();
  const nameFilterValue = nameFilter.value.trim().toLowerCase();
  const facultyFilterValue = facultyFilter.value.trim().toLowerCase();
  const startYearFilterValue = parseInt(startYearFilter.value.trim());
  const endYearFilterValue = parseInt(endYearFilter.value.trim());

  const filteredStudents = studentsList.filter(function (student) {
    let fullName = student.surname + ' ' + student.name + ' ' + student.lastname + '';
    let startYear = Number(student.studyStart);
    let endYear = Number(startYear) + 4;
    let currentYear = new Date().getFullYear();
    if (nameFilterValue !== '' && !fullName.toLowerCase().includes(nameFilterValue)) {
      return false;
    }
    if (!isNaN(startYearFilterValue) && startYear !== startYearFilterValue) {
      return false;
    }
    if (!isNaN(endYearFilterValue) && endYear !== endYearFilterValue) {
      return false;
    }
    if (facultyFilterValue !== '' && !student.faculty.toLowerCase().includes(facultyFilterValue)) {
      return false;
    }
    return true;
  });
  renderStudents(filteredStudents);
});


addStudentform.addEventListener('submit', async function (e) {
  e.preventDefault();

  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const middleName = middleNameInput.value.trim();
  const birthDate = new Date(birthDateInput.value);
  const startYear = parseInt(startYearInput.value);
  const faculty = facultyInput.value.trim();

  // const student = {
  //   firstName: firstLetterUpper(firstName),
  //   lastName: firstLetterUpper(lastName),
  //   middleName: firstLetterUpper(middleName),
  //   birthDate: birthDate,
  //   startYear: startYear,
  //   faculty: firstLetterUpper(faculty),
  // };

  const errors = [];

  if (birthDate < new Date('01.01.1900') || birthDate > new Date()) {
    errors.push('Неверная дата рождения');
  }

  if (startYear < 2000 || startYear > new Date().getFullYear()) {
    errors.push('Неверный год начала обучения');
  }

  if (errors.length > 0) {
    const erorElem = document.getElementById('error');
    erorElem.innerHTML = errors.join('<br>');
  } else {
    addStudentform.reset();
    // studentsList.push(student);
    await createStudentOnServer(firstLetterUpper(firstName), firstLetterUpper(lastName), firstLetterUpper(middleName), birthDate, startYear, firstLetterUpper(faculty));
    loadStudents();
  }


  firstNameInput.value = '';
  lastNameInput.value = '';
  middleNameInput.value = '';
  birthDateInput.value = '';
  startYearInput.value = '';
  facultyInput.value = '';

});

async function loadStudents() {
  const response = await fetch('http://localhost:3000/api/students');
  const data = await response.json();
  studentsList = data;
  renderStudents(studentsList);
}

async function createStudentOnServer(name, surname, lastname, birthday, studyStart, faculty){
  const response = await fetch('http://localhost:3000/api/students', {
    method: 'POST',
    body: JSON.stringify({
      name,
      surname,
      lastname,
      birthday,
      studyStart,
      faculty,
    }),
    headers: {
      'Content-Type': 'application/json',
  }
  });

  const data = await response.json();
  return data;
}

async function deleteStudent(student) {
  const index = studentsList.findIndex(item =>  item.id === student.id);
  if (index > -1) {
    studentsList.splice(index, 1);
    renderStudents(studentsList);
    await deleteStudentFromServer(student);
  }
}

async function deleteStudentFromServer(student){
  fetch(`http://localhost:3000/api/students/${student.id}`,{
    method: 'DELETE',
  });
}

let sortDirection = "asc";

function sortByName() {
  studentsList.sort(function (a, b) {
    var nameA = a.surname.toLowerCase();
    var nameB = b.surname.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  if (sortDirection === "desc") {
    studentsList.reverse();
  }
  sortDirection = toggleSortDirection(sortDirection);
  renderStudents(studentsList);
}

function toggleSortDirection(direction) {
  return direction === "asc" ? "desc" : "asc";
}

function renderStudents(filteredStudents = studentsList) {
  studentTableBody.innerHTML = '';
  filteredStudents.forEach(function (student) {
    const row = document.createElement('tr');

    const fullNameCell = document.createElement('td');
    fullNameCell.textContent = student.surname + ' ' + student.name + ' ' + student.lastname + ' ';
    row.appendChild(fullNameCell);
    const facultyCell = document.createElement('td');
    facultyCell.textContent = student.faculty;
    row.appendChild(facultyCell);
    const birthDateAgeCell = document.createElement('td');
    const age = new Date().getFullYear() - new Date(student.birthday).getFullYear();
    birthDateAgeCell.textContent = new Date(student.birthday).toLocaleDateString() + ' (' + age + ' года)';
    row.appendChild(birthDateAgeCell);
    const startYearCourse = document.createElement('td');
    const endYear = Number(student.studyStart) + 4;
    const currentYear = new Date().getFullYear();
    startYearCourse.textContent = student.studyStart + '-' + endYear + ' (' + ((currentYear >= endYear) ? 'закончил)' : (currentYear - student.studyStart + 1) + 'курс)');
    row.appendChild(startYearCourse);

    const deleteButtonCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.addEventListener('click', async function () {
      deleteStudent(student);
    });
    deleteButtonCell.appendChild(deleteButton);
    row.appendChild(deleteButtonCell);
    studentTableBody.appendChild(row);
  });
}

const sortName = document.getElementById('name-column');
sortName.addEventListener('click', sortByName);


renderStudents(studentsList);
