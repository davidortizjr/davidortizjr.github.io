function loadPage(content = 'school') {
    const projects = document.getElementById('project-content');

    fetch(`assets/projects_section/${content}.html`)
        .then(response => response.text())
        .then(data => {
            projects.innerHTML = data;
        })
        .catch(error => console.error('Error fetching file:', error));

}