window.onload = function(){
    fetch(`https://api.unsplash.com/photos?per_page=25&client_id=${API_KEY}`).then(convert_to_json).then(function (data){
        generateCards(data);
    });
}

function generateCards(data){
    console.log(data);
    const container = document.getElementById('image_container');
    for(let i = 0; i < data.length; i++){
        const single_item = data[i];
        const card        = document.createElement('div');
        const anchor      = document.createElement('a');
        const img         = document.createElement('img');

        card.classList.add('item');
        anchor.href = `./detail.html?id=${single_item.id}`;
        card.style.backgroundColor = single_item.color;
        img.src = single_item.urls.thumb;

        anchor.appendChild(img);
        card.appendChild(anchor);
        container.appendChild(card);
    }
}