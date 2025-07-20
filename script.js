function loadPage(content = 'client') {
    const maincontent = document.getElementById('maincontent');

    fetch(`projects/${content}.html`)
        .then(response => response.text())
        .then(data => {
            maincontent.innerHTML = data;
        })
        .catch(error => console.error('Error fetching file:', error));

}