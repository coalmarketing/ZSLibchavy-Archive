import Fuse from 'fuse.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const POSTS_PER_PAGE = 30;

    // --- DOM ELEMENTS ---
    const searchInput = document.getElementById('search-input');
    const postsContainer = document.getElementById('posts');
    const paginationContainer = document.getElementById('pagination-container');
    const noResultsMessage = document.getElementById('no-results-message');

    if (!postsContainer) {
        console.error('Posts container not found.');
        return;
    }

    // --- STATE ---
    const allPostElements = Array.from(postsContainer.querySelectorAll('li[data-id]'));
    const postsData = allPostElements.map(el => ({
        id: el.dataset.id,
        title: el.dataset.searchTitle,
        content: el.dataset.searchContent
    }));

    // This array holds the DOM elements that match the current search.
    // Initially, it's all of them.
    let currentlyVisibleElements = [...allPostElements];
    let currentPage = 1;

    // --- FUSE.JS SETUP ---
    const fuse = new Fuse(postsData, {
        keys: ['title', 'content'],
        includeScore: true,
        threshold: 0.4,
        minMatchCharLength: 2,
    });

    // --- CORE DISPLAY FUNCTION ---

    /**
     * This function is now the single source of truth for what is displayed.
     * It paginates the `currentlyVisibleElements` array.
     */
    function displayCurrentPage() {
        // First, hide ALL original post elements.
        allPostElements.forEach(el => el.style.display = 'none');

        // Show or hide the "no results" message and posts container using a class
        postsContainer.classList.toggle('grid', currentlyVisibleElements.length > 0);
        postsContainer.classList.toggle('hidden', currentlyVisibleElements.length === 0);
        noResultsMessage.classList.toggle('hidden', currentlyVisibleElements.length > 0);

        // Calculate the slice of posts for the current page
        const start = (currentPage - 1) * POSTS_PER_PAGE;
        const end = start + POSTS_PER_PAGE;
        const pageItems = currentlyVisibleElements.slice(start, end);

        // Show only the elements for the current page
        pageItems.forEach(el => el.style.display = '');

        // Update the pagination controls
        renderPaginationControls(currentlyVisibleElements.length);
    }

    /**
     * This function builds the pagination buttons based on the total number
     * of items that are currently visible (after search).
     */
    function renderPaginationControls(totalItems) {
        const totalPages = Math.ceil(totalItems / POSTS_PER_PAGE);
        paginationContainer.innerHTML = ''; // Clear old buttons

        if (totalPages <= 1) return;

        // The same robust, programmatic button creation from before
        const nav = document.createElement('nav');
        nav.setAttribute('aria-label', 'Pagination');
        nav.className = 'flex items-center justify-center gap-1.5 sm:gap-4';

        const createButton = (content, page, isDisabled = false, isCurrent = false) => {
            const a = document.createElement('a');
            a.href = '#';
            a.dataset.page = page;
            a.innerHTML = content;
            a.className = `flex items-center justify-center h-8 text-sm text-gray-800 dark:text-gray-200 hover:text-gray-950 dark:hover:text-white font-medium rounded-full transition-colors duration-300`;

            if (typeof content === 'number') {
                a.classList.add('w-8');
                a.setAttribute('aria-label', `Přejít na stránku ${content}`);
            } else {
                a.classList.add('gap-1.5', 'px-3');
            }

            if (isCurrent) {
                a.className += ' bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow'
            } else {
                a.className += ' hover:bg-gray-100 dark:hover:bg-gray-950'
            }

            if (isDisabled) a.className += ' opacity-50 pointer-events-none';

            return a;
        };

        // Previous Button
        nav.appendChild(
            createButton(
                `
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 -960 960 960" fill="currentColor">
                    <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
                </svg>
                <span class="hidden sm:inline">Předchozí</span>
                `,
                currentPage - 1, currentPage === 1
            )
        );

        // Page Numbers: <a> tags are wrapped in <li> and appended to <ul>
        const ul = document.createElement('ul');
        ul.className = 'flex items-center gap-1';

        // Page Numbers (Sliding Window Logic)
        const pageRange = 3;
        let startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
        let endPage = Math.min(totalPages, startPage + pageRange - 1);

        if (endPage - startPage + 1 < pageRange) {
            startPage = Math.max(1, endPage - pageRange + 1)
        };

        if (startPage > 1) {
            const li = document.createElement('li');
            li.appendChild(createButton(1, 1));
            ul.appendChild(li);
            if (startPage > 2) ul.innerHTML += `<li><span class="flex items-center justify-center h-8 w-8">…</span></li>`;
        }
        for (let i = startPage; i <= endPage; i++) {
            const li = document.createElement('li');
            li.appendChild(createButton(i, i, false, i === currentPage));
            ul.appendChild(li);
        }
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) ul.innerHTML += `<li><span class="flex items-center justify-center h-8 w-8 text-gray-800 dark:text-gray-200">…</span></li>`;
            const li = document.createElement('li');
            li.appendChild(createButton(totalPages, totalPages));
            ul.appendChild(li);
        }

        nav.appendChild(ul);

        // Next Button
        nav.appendChild(
            createButton(
                `
                <span class="hidden sm:inline">Další</span>
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 -960 960 960" fill="currentColor">
                    <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
                </svg>
                `,
                currentPage + 1, currentPage === totalPages
            )
        );

        paginationContainer.appendChild(nav);
    }


    // --- EVENT LISTENERS ---

    // Your original, working search handler, now updated to coordinate with pagination
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.trim().toLowerCase();

            if (searchTerm.length < 2) {
                // If search is cleared, all posts are visible again
                currentlyVisibleElements = [...allPostElements];
            } else {
                // Perform the search
                const results = fuse.search(searchTerm);
                const visiblePostIds = new Set(results.map(result => result.item.id));

                // Update the array of visible elements based on search
                currentlyVisibleElements = allPostElements.filter(el => visiblePostIds.has(el.dataset.id));
            }

            // CRITICAL: Always reset to page 1 after a search and re-render
            currentPage = 1;
            displayCurrentPage();
        });
    }

    // New listener for pagination clicks
    paginationContainer.addEventListener('click', (e) => {
        const target = e.target.closest('a[data-page]');
        if (!target) return;

        e.preventDefault();
        const pageNumber = parseInt(target.dataset.page, 10);
        if (pageNumber !== currentPage) {
            currentPage = pageNumber;
            displayCurrentPage(); // Re-render with the new page number

            postsContainer.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // --- INITIAL RENDER ---
    // On page load, show the first page of all posts
    displayCurrentPage();
});