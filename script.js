document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const imageResults = document.getElementById('image-results');
    const loadMoreButton = document.getElementById('load-more');
    const popup = document.getElementById('popup');
    const popupImg = document.getElementById('popup-img');
    const infoModal = document.getElementById('infoModal');
    let currentPage = 1;
    let currentQuery = '';

    searchInput.addEventListener('input', function () {
        const query = searchInput.value.trim();
        if (query.length >= 3) {
            currentQuery = query;
            currentPage = 1;
            imageResults.innerHTML = '';
            searchImages(query, currentPage);
        } else {
            imageResults.innerHTML = '';
            loadMoreButton.style.display = 'none';
        }
    });

    loadMoreButton.addEventListener('click', function () {
        searchImages(currentQuery, ++currentPage);
    });

    function searchImages(query, page) {
        const clientId = 'kxKEJ_y0y5vpfRI9XCgAdUnE5bDKrJGFAgz9GhYLiEM';
        const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${clientId}&per_page=20&page=${page}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayImages(data.results);
                if (page < data.total_pages) {
                    loadMoreButton.style.display = 'block';
                } else {
                    loadMoreButton.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error fetching images:', error);
            });
    }

    function displayImages(images) {
        images.forEach(image => {
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item';
            imageItem.innerHTML = `
                <img src="${image.urls.thumb}" alt="${image.alt_description}" onclick="openPopup('${image.urls.regular}')">
                <button onclick="openInfoModal('${image.alt_description || 'No title'}', '${image.description || 'There is no description on this photo.'}', ${image.likes})">More Info</button>
            `;
            imageResults.appendChild(imageItem);
        });
    }

    window.openPopup = function (imgUrl) {
        popupImg.src = imgUrl;
        popup.style.display = 'block';
        document.body.classList.add('popup-open');
    };

    window.closePopup = function () {
        popup.style.display = 'none';
        document.body.classList.remove('popup-open');
    };

    popup.addEventListener('click', function (event) {
        if (event.target === popup) {
            closePopup();
        }
    });

    window.openInfoModal = function (title, description, likes) {
        const infoTitle = title;
        const infoDescription = description || 'There is no description on this photo.';
        document.getElementById('info-title').innerHTML = `<strong>Title:</strong> ${infoTitle}`;
        document.getElementById('info-description').innerHTML = `<strong>Description:</strong> ${infoDescription}`;
        document.getElementById('info-likes').innerHTML = `<strong>Likes:</strong> ${likes}`;
        $('#infoModal').modal('show');
    };
});
