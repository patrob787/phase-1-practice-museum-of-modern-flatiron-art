console.log('code has begun!');

//Doc Variable Library

//Current Exibit:
let exhibitTitle = document.getElementById('exhibit-title');
let exhibitImage = document.getElementById('exhibit-image');
let exhibitDescription = document.getElementById('exhibit-description');
let ticketsBought = document.getElementById('tickets-bought');
let tixBtn = document.getElementById('buy-tickets-button');
let currentExhibit;

//Comments Div & Form:
let commentsSection = document.getElementById('comments-section');
let form = document.getElementById('comment-form');

//Render Current exhibit and comments to DOM
fetch("http://localhost:3000/current-exhibits")
.then(resp => resp.json())
.then(data => {
    currentExhibit = data[0];
    
    renderCurrentExhibit(currentExhibit);
})

//Function Library
function renderCurrentExhibit(exhibit) {
    exhibitTitle.textContent = exhibit.title;
    exhibitImage.src = exhibit.image;
    exhibitDescription.textContent = exhibit.descripton;
    
    if (currentExhibit.tickets_bought === 1) {
        ticketsBought.textContent = `1 Ticket Bought`
    } else {
    ticketsBought.textContent = `${currentExhibit.tickets_bought} Tickets Bought`
    }
    
    exhibit.comments.forEach((comment) => {
        postComment(comment);
    });
}

function postComment(comment) {
    let p = document.createElement('p');
    p.textContent = comment;
    commentsSection.appendChild(p);
}

function patchExhibitComments(exhibitObj) {
    fetch(`http://localhost:3000/current-exhibits/${exhibitObj.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(exhibitObj)
    })
    .then(resp => resp.json())
}

//Adding a new comment
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let newComment = e.target["comment-input"].value
    currentExhibit.comments.push(newComment);
    postComment(newComment)

    patchExhibitComments(currentExhibit);

    e.target['comment-input'].value = "";
    
})

//Handling Buy Tickets
tixBtn.addEventListener('click', (e) => {
    //console.log(e);
    currentExhibit.tickets_bought++;
    if (currentExhibit.tickets_bought === 1) {
        ticketsBought.textContent = `1 Ticket Bought`;
    } else {
        ticketsBought.textContent = `${currentExhibit.tickets_bought} Tickets Bought`
    };

    fetch(`http://localhost:3000/current-exhibits/${currentExhibit.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(currentExhibit)
    })
    .then(resp => resp.json())
})

