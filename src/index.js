// Your code here
const rendercharacters = async () => {
    let url = 'http://localhost:3000/characters';
    
    try {
        // fetch the characters data
        const response = await fetch(url);
    // check if the response is ok
        if (!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        
        }
        // pass the response as json 
        const characters = await  response.json();

        console.log(characters);

      //Get the character-bar div where character names will be rendered
const characterBar = document.getElementById('character-bar');
 
//clear previous content in character-bar
characterBar.innerHTML = '';
// loop through each character and create a span element for their name
characters.forEach(characterElement => {
    const span = document.createElement('span');
    span.textContent = characterElement.name;
    span.classList.add('character-name');
    
    // add a click event listner to each span
    span.addEventListener('click', () => displayCharacterDetails(characterElement.id))
    //append the span to the character-bar
    characterBar.appendChild(span);
})  

    } catch (error){
        console.error('failed to fetch characters', error);

    }
}
rendercharacters();

//function to dispay character details in the detailed-info div
const displayCharacterDetails = async (characterId) => {
    let url = `http://localhost:3000/characters/${characterId}`;
    try {
        //fetch the character details
        const response = await fetch(url);
        //check if the response is ok
        if (!response.ok){
            throw new Error('HTTP error! status; ${response,status}');
        }
        //pass the response as json
        const character = await response.json();
        console.log(character);
        //get the detailed-info div where character details will be rendered
        const detailedInfo = document.getElementById('detailed-info');
        //clear previous content in detailed-info
        detailedInfo.innerHTML = '';
        //create a div element for the character details
        const characterDiv = document.createElement('div');
        //add the character name to the characterDiv
        
        const name = document.createElement('h2');
        name.textContent = character.name;
        characterDiv.appendChild(name);
        //add the character image to the characterDiv
        
        const image = document.createElement('img');
        image.src = character.image;
        characterDiv.appendChild(image);
        
        //append the characterDiv to the detailed-info div
        detailedInfo.appendChild(characterDiv);

        // Display current number of votes
        const votesText = document.createElement('p');
        votesText.classList.add ('votes-text');
        votesText.textContent = `Total Votes: 0`;
        characterDiv.appendChild(votesText);

        //add the form to add votes
        const voteForm = document.createElement('form');
    voteForm.innerHTML = `
        <label for="votes">Add votes:</label>
        <input type="number" id="votes" name="votes" min="1" required>
        <button type="submit">Add Votes</button>
    `;
    characterDiv.appendChild(voteForm);
    
    //Handle vote form submission
    voteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const voteInput = document.getElementById('votes');
        const additionalVotes = parseInt(voteInput.value, 10);

        //update the characters votes cumulatively
        character.votes = (character.votes || 0) + additionalVotes;

        //update the displayed vote count
        votesText.textContent = `Total Votes: ${character.votes}`;

        //clear the input field
        voteInput.value = '';
    })
    detailedInfo.appendChild(characterDiv);

    //Display total votes in the header
    const totalVotes = document.getElementById('vote-count');
    totalVotesText.textContent = 0;

     //add event listener for the reset button
     document.getElementById('reset-votes').addEventListener('click', resetVotes)

     
    } catch (error){
        console.error('failed to fetch character details', error);
    }

};

//function to reset votes to 0
const resetVotes = () => {
    const characterBar = document.getElementById('character-bar');
    const characters = Array.from(characterBar.querySelectorAll('.character-name'));

    //reset votes for each character
    characters.forEach(character => {
        const votesText = character.querySelector('.votes-text');
        if (votesText) {
            votesText.textContent = 'Total Votes: 0';
        }

    });

};
// Add event listener for the Reset Votes button
document.getElementById('reset-votes').addEventListener('click', resetVotes);
   
// add new character via the form
const addNewCharacterForm = document.getElementById('character-form');
addNewCharacterForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const votes = parseInt(document.getElementById('votes').value, 10);

    //create a new character object
    const newCharacter = {
        name: name,
        votes: votes
    };
    try {
        const response = await fetch('http://localhost:3000/characters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCharacter),
        });

            const addedCharacter = await response.json();
            console.log(addedCharacter);

           //add new character to character bar
           const span = document.createElement('span');
           span.textContent = addedCharacter.name;
           span.classList.add('character-name');
           span.addEventListener('click', () => displayCharacterDetails(addedCharacter.id));
        
           const characterBar = document.getElementById('character-bar');
           characterBar.appendChild(span);

           //Display character details in the detailed-info section
              displayCharacterDetails(addedCharacter.id);
    } catch (error){
        console.error('Error adding new character', error);

    }
        
});
    

